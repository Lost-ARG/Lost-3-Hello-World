const { findStory } = require("../service/database/storyService");
const { findTeam, updateTeamProgress, teamRank } = require("../service/database/teamService");
const dcBot = require('../discordBot');

const updateProgress = async (req, res) => {
  try {
    const { teamCode, storyCode } = req.body;
    const invalid = [];

    // 先檢查 TeamCode 是否存在
    const team = await findTeam({ code: teamCode });
    if (team.length === 0) {
      invalid.push("不存在的 Team Code");
    }

    // 檢查 Story 是否存在
    const story = await findStory({ code: storyCode });
    if (story.length === 0) {
      invalid.push("不存在的 Story Code");
    }

    if (invalid.length !== 0) {
      res.send({ status: 400, result: invalid });
      return;
    }

    // 檢查 story code 是否符合 Team 的進度(沒有超過當前進度 +1 的故事)
    const progressSub = story[0]["progress_num"] - team[0]["game_progress"][team[0]["game_progress"].length - 1]["level"];
    if (progressSub > 1) {
      invalid.push("隊伍進度與故事進度不符");
      res.send({ status: 400, result: invalid });
      return;
    } else if(progressSub > 0 && progressSub <= 1) {
      await updateTeamProgress({ code: teamCode }, { game_progress: { level: story[0]["progress_num"] } });
    }
    const msg = `隊伍 ${teamCode} - ${team[0]["name"]} 通過第 ${story[0]["progress_num"]} 關啦~`
    dcBot.sendMessage(msg)
    res.send({ status: 200 });
  } catch (error) {
    console.error(error);
    res.send({ status: 500 });
  }
}

const ranking = async (req, res) => {
  try {
    const rank = await teamRank();
    res.send({ status: 200, data: rank })
  } catch (error) {
    console.error(error);
    res.send({ status: 500 });
  }
}

module.exports = {
  updateProgress,
  ranking,
}
