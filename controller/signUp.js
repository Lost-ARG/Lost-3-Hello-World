const dayjs = require('dayjs');
require('dotenv').config();
const crypto = require('crypto');
const salt = process.env.HASH_SALT;
const basicUrl = process.env.BASIC_URL;

const { countTeam, findTeam, creatTeam, updateTeamEmailVerify } = require('../service/database/teamService');
const { sendTeamMail } = require('../service/mailService');


const isSignUpTime = (now) => {
  const startDate = process.env.SIGNUP_START_DATE;
  const endDate = process.env.SIGNUP_END_DATE;
  const startTime = process.env.SIGNUP_START_TIME;
  const endTime = process.env.SIGNUP_END_TIME;
  const begin = dayjs(`${now.format('YYYY-MM-DD')}T${startTime}`);
  const end = dayjs(`${now.format('YYYY-MM-DD')}T${endTime}`);
  const isInDate = (now.isSame(startDate) || now.isAfter(startDate)) && now.isBefore(endDate);
  const isInTime = (now.isSame(begin) || now.isAfter(begin)) && now.isBefore(end);
  return isInDate && isInTime;
}

const hasTeamQuota = async () => {
  try {
    const teamQuota = parseInt(process.env.TEAM_QUOTA, 10);
    const currentTeamCount = await countTeam();
    return teamQuota > currentTeamCount;
  } catch (error) {
    throw new Error(error.toString());
  }
}

const verifyData = async (data) => {
  try {
    const regexp = {
      // Ex: 1(04213083) 必須為 1 開頭且有後八碼數字
      idCheck: new RegExp(/^1\d{8}$/),
      // 中英文可含空白、-, 並且至少要2位元
      nameCheck: new RegExp(/^[-a-zA-Z_\s\u4e00-\u9fa5]{2,}$/),
      emailCheck: new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
      // 密碼最少四個字且要有一碼為英文
      passwordCheck: new RegExp(/^(?=.*[a-zA-Z])[0-9a-zA-Z]{4,}$/)
    }

    const dataEnum = {
      team: {
        name: "隊伍名稱",
        password: "隊伍密碼",
      },
      member_1: {
        name: "成員一姓名",
        id: "成員一學號",
        email: "成員一 Email "
      },
      member_2: {
        name: "成員二姓名",
        id: "成員二學號",
        email: "成員二 Email "
      },
      member_3: {
        name: "成員三姓名",
        id: "成員三學號",
        email: "成員三 Email "
      }
    }

    const memberObj = {
      id: [],
      email: []
    }

    const invalid = [];

    for (const key in dataEnum) {
      for (const subKey in dataEnum[key]) {
        const val = data[key][subKey];
        // 檢查資料格式 {status: 400, message: '無效的 XXX'}
        if (!val || !(regexp[`${subKey}Check`].test(val))) {
          invalid.push("無效的" + dataEnum[key][subKey]);
        } else {
          if (key === "team") {
            if (subKey === "name") {
              // 檢查隊伍名稱是否重複 {status: 400, message: '隊伍名稱重複'}
              const duplicate = await findTeam({ name: val });
              if (!(duplicate.length === 0)) {
                invalid.push("隊伍名稱重複，請重新選擇");
              }
            }
          } else {
            // 檢查同隊成員資料重複(學號信箱兩個欄位皆必須是 unique) {status: 400, message: '隊員重複'}
            if (subKey === "name") continue;
            if (memberObj[subKey].includes(val)) {
              invalid.push("重複的" + dataEnum[key][subKey])
            } else {
              memberObj[subKey].push(val);
            }
            // 檢查不同隊成員資料重複(學號信箱兩個欄位皆必須是 unique) {status: 400, message: '成員已註冊'}
            const condition = { [`members.${key}.${subKey}`]: val };
            const duplicate = await findTeam(condition);
            if (!(duplicate.length === 0)) {
              invalid.push(`${dataEnum[key][subKey]}已註冊`);
            }
          }
        }
      }
    }

    const verifyResult = {
      verified: invalid.length === 0,
      invalid
    }

    return verifyResult;

  } catch (error) {
    throw new Error(`Verify Data Failed, Error: ${error.toString()}`);
  }
}

const signUp = async (req, res) => {
  try {
    const now = dayjs();
    // 先檢查時間，是否在報名時間內
    if (!isSignUpTime(now)) {
      res.send({ status: 400, message: "當前並非報名時間" });
      return;
    }
    // 檢查隊伍數量，是否超過上限(目前上限定為 50 隊)
    if (!(await hasTeamQuota())) {
      res.send({ status: 400, message: "報名組數已滿，若有加開名額會另行公佈於粉絲團" });
      return;
    }
    const formData = req.body;
    // 驗證資料，回傳一個物件，
    const verifyResult = await verifyData(formData);
    if (!verifyResult["verified"]) {
      let message = verifyResult["invalid"].join('<br>');;
      res.send({ status: 400, message });
      return;
    }

    // 寫入 DB(需補充 emailVerify, teamProgress 等欄位) {'error':'系統錯誤 (無法上傳報名資料)'}
    const teamData = formData["team"];
    teamData["members"] = {
      member_1: formData["member_1"],
      member_2: formData["member_2"],
      member_3: formData["member_3"],
    }
    teamData["game_progress"] = {}
    const team = await creatTeam(teamData);
    // 發送驗證信箱 Email
    const teamEmails = Object.values(team["members"]).map(member => member.email);
    const mailTemplateData = teamEmails.map(email => ({
      teamCode: team["code"],
      emailHash: crypto.createHmac('sha256', salt).update(email).digest('hex'),
      email,
      basicUrl
    }));

    sendTeamMail(teamEmails, "Lost 3 活動報名驗證信", "signUp", mailTemplateData);
    res.send({ status: 200,
      message: `
        報名完成，請所有成員至 email 信箱收取信件<br>
        若未收到信件請聯絡主辦粉專<br>
        <a href="https://www.facebook.com/ncnu.occultscience">暨大神秘科學研究社</a><br>
        並請盡速至<br>
        管理學院 237 室 MOLi 或 學生活動中心 403 推理研究社社辦<br>
        完成繳費
        `
      });

  } catch (error) {
    // 其他錯誤
    console.error(error);
    res.send({ status: 500, 'error': '系統錯誤，請聯絡主辦單位' });
  }
}

const verifyEmail = async (req, res) => {
  try {
    const { email, emailHash } = req.params;
    console.log(email, emailHash);
    if (!(crypto.createHmac('sha256', salt).update(email).digest('hex') === emailHash)) {
      res.send({ status: 400, message: "Email 驗證失敗" });
      return;
    }
    // update db
    const team = await updateTeamEmailVerify(email)
    if(!team) {
      res.send({ status: 400, message: "無效的 Email" });
      return;
    }
    res.send({ status: 200, message: "Email 驗證成功，將重新導向至活動首頁", redirectUrl: "/" });
  } catch (error) {
    console.error(error);
    res.send({ status: 500 })
  }
}

module.exports = {
  signUp,
  verifyEmail
}
