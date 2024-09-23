const Team = require('../../model/team');

const creatTeam = async (data) => {
  try {
    const team = new Team(data);
    await team.save();
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

module.exports = {
  creatTeam,
  findTeam,
  countTeam,
  updateTeamProgress,
}
