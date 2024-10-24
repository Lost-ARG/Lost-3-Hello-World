const schedule = require('node-schedule');
const Queue = require('queue-promise');
const { v4: uuidv4 } = require('uuid');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone'); // dependent on utc plugin
const {
  createScheduleJob, getScheduleJob, updateScheduleJob, deleteScheduleJob,
} = require('./service/database/scheduleJobService');
const { sendTeamMail } = require('./service/mailService');
const { findTeam } = require('./service/database/teamService');

dayjs.extend(utc);
dayjs.extend(timezone);

const basicUrl = process.env.BASIC_URL;

const jobMap = {
  "ACTBeginEmailJob": async (job, retry = 0) => {
    // select all emails from team which team.paid equals to true
    // then send email with email template ACTBegin
    try {
      const teams = await findTeam(
        { paid: true },  // Condition: Only teams where paid == true
        { 'code': 1, 'members.member_1.email': 1, 'members.member_2.email': 1, 'members.member_3.email': 1 } // Projection to get emails only
      )
      for (let i = 0; i < teams.length; i += 1) {
        const teamEmails = Object.values(teams[i]["members"]).map(member => member.email);
        const mailTemplateData = teamEmails.map(() => ({
          teamCode: teams[i]["code"],
          title: "Lost 3 - Hello World : Begin",
          basicUrl,
          levelUrl: "/morning"
        }));

        await sendTeamMail(teamEmails, "Lost 3 - Hello World : Begin", "ACTBegin", mailTemplateData);
      }
      return job;
    } catch (error) {
      console.error(error);
      throw {
        error,
        job,
        retry
      }
    }

  },
  "ACTEndEmailJob": async (job, retry = 0) => {
    // select all emails from team which team.paid equals to true
    // then send email with email template ACTEnd
    try {
      const teams = await findTeam(
        { paid: true },  // Condition: Only teams where paid == true
        { 'members.member_1.email': 1, 'members.member_2.email': 1, 'members.member_3.email': 1 } // Projection to get emails only
      )

      for (let i = 0; i < teams.length; i += 1) {
        const teamEmails = Object.values(teams[i]["members"]).map(member => member.email);
        const mailTemplateData = teamEmails.map(() => ({
          teamCode: teams[i]["code"],
          title: "Lost 3 - Hello World : End",
          ACT_END_TIME: process.env.ACT_END_TIME,
        }));
        await sendTeamMail(teamEmails, "Lost 3 - Hello World : End", "ACTEnd", mailTemplateData);
      }
      return job;
    } catch (error) {
      console.error(error);
      throw {
        error,
        job,
        retry
      }
    }

  }
};

const updateScheduleJobResult = async (job, result) => {
  try {
    await updateScheduleJob({ uuid: job.uuid }, { result, deleted_at: dayjs().format() });
  } catch (error) {
    console.error(error);
  }
};

const queue = new Queue({
  // concurrent: 1, // 5 is the default value
  // interval: 2000 // 500 is the default value
});

queue.on('start', () => { });
queue.on('stop', () => { });
queue.on('end', () => { });

queue.on('resolve', (data) => {
  updateScheduleJobResult(data, 'success');
});

// schedule job error handler
queue.on('reject', (data) => {
  // retry will do in here
  console.error(data.error);
  if (data.retry >= 3) {
    console.log('[Schedule Job] retry over 3 times, job failed');
    updateScheduleJobResult(data.job, data.error.toString());
    return;
  }
  // 重新放到 queue 裡面再執行一次
  console.log(`[Schedule Job] retry job, count: ${data.retry + 1}`);
  queue.enqueue(() => jobMap[data.job.type](data.job, data.retry + 1));
});

const addToSchedule = (job) => {
  schedule.scheduleJob(job.uuid, job.execute_time, () => {
    queue.enqueue(() => jobMap[job.type](job));
  });
};

const cancelJob = async (uuid) => {
  // 先去資料庫把 job 刪除
  await deleteScheduleJob({ uuid });
  // 清除 schedule
  schedule.scheduledJobs[uuid].cancel();
};

const addJob = async (uuid, name, type, executeTime, data = {}) => {
  const job = {
    uuid,
    name,
    type,
    execute_time: executeTime, // 傳入的 time 都必須是 local, 因此這裡不用再轉
    data: JSON.stringify(data),
  };
  // 寫入資料庫
  await createScheduleJob(job);
  // 新增到 schedule 中
  addToSchedule(job);
};

const registerACTBeginEmailJob = () => {
  addJob(
    uuidv4(),
    "ACTBeginEmail",
    "ACTBeginEmailJob",
    process.env.ACT_BEGIN_TIME,
  )
}

const registerACTEndEmailJob = () => {
  addJob(
    uuidv4(),
    "ACTEndEmail",
    "ACTEndEmailJob",
    process.env.ACT_END_TIME,
  )
}

// 當服務被啟動時，要去撈資料庫的 schedule_job table
// 把之前排定的工作載入到程式裡的 schedule job 中
const init = async () => {
  try {
    let registerACTBeginEmail = false;
    let registerACTEndEmail = false;

    const jobs = await getScheduleJob({ deleted_at: null });
    console.log('[Schedule Job] run schedule init to load jobs from db');
    for (let i = 0; i < jobs.length; i += 1) {
      if (jobs[i].name === "ACTBeginEmail") {
        registerACTBeginEmail = true;
      }
      if (jobs[i].name === "ACTEndEmail") {
        registerACTEndEmail = true;
      }
      // db 會把時間轉成 utc, 因此需要再轉回 local
      jobs[i].execute_time = dayjs.utc(jobs[i].execute_time).tz('Asia/Taipei');
      addToSchedule(jobs[i]);
    }
    if (!registerACTBeginEmail) {
      registerACTBeginEmailJob()
    }
    if (!registerACTEndEmail) {
      registerACTEndEmailJob()
    }

  } catch (error) {
    throw new Error(error);
  }
};

const scheduler = {
  cancelJob,
  addJob,
  init,
};

module.exports = scheduler;
