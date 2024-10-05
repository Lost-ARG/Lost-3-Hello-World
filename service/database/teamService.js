const Team = require('../../model/team');

const creatTeam = async (data) => {
  try {
    const team = new Team(data);
    const teamObj = await team.save();
    return teamObj;
  } catch (error) {
    throw new Error(`Create Team Failed, Error: ${error.toString()}`)
  }
}

const findTeam = async (condition = {}) => {
  try {
    const team = await Team.find(condition);
    return team;
  } catch (error) {
    throw new Error(`Find Team Failed, Error: ${error.toString()}`)
  }
}

const countTeam = async (condition = {}) => {
  try {
    const count = await Team.countDocuments(condition);
    return count;
  } catch (error) {
    throw new Error(`Count Team Failed, Error: ${error.toString()}`)
  }
}

const updateTeamProgress = async (condition, data) => {
  try {
    const result = await Team.updateOne(condition, { $push: data });
    return result;
  } catch (error) {
    throw new Error(`Update Team Failed, Error: ${error.toString()}`)
  }
}

const updateTeamEmailVerify = async (email) => {
  try {
    // 先找到該 email 對應的成員和團隊
    const team = await Team.findOne({
      $or: [
        { 'members.member_1.email': email },
        { 'members.member_2.email': email },
        { 'members.member_3.email': email }
      ]
    });

    if (team) {
      let memberField = '';

      // 確定是 member_1, member_2 還是 member_3
      if (team.members.member_1.email === email) {
        memberField = 'members.member_1.email_verify';
      } else if (team.members.member_2.email === email) {
        memberField = 'members.member_2.email_verify';
      } else if (team.members.member_3.email === email) {
        memberField = 'members.member_3.email_verify';
      }

      if (memberField) {
        // 使用 $set 來更新 email_verify 欄位
        const updatedTeam = await Team.updateOne(
          { _id: team._id },
          { $set: { [memberField]: true } }  // 更新 email_verify 為 true
        );

        return updatedTeam;
      }
    } else {
      return null;  // 如果找不到該 email 對應的成員
    }
  } catch (error) {
    throw new Error(`Update Team Email Verify Failed, Error: ${error.toString()}`);
  }
}

module.exports = {
  creatTeam,
  findTeam,
  countTeam,
  updateTeamProgress,
  updateTeamEmailVerify,
}
