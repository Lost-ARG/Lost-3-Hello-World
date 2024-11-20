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

const findTeam = async (condition = {}, specifiedCol = {}) => {
  try {
    const team = await Team.find(condition, specifiedCol);

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

const updateTeam = async (condition = {}, data = {}) => {
  try {
    const updatedTeam = await Team.findOneAndUpdate(
      condition,
      { $set: data },  // Using $set to only update specified fields
      { new: true, runValidators: true }  // Return the updated doc and apply validation
    );

    // Check if a team was found and updated
    if (!updatedTeam) {
      throw new Error('Team not found or no fields were updated.');
    }

    return updatedTeam;  // Return the updated team document
  } catch (error) {
    // Detailed error handling
    throw new Error(`Update Team Failed, Condition: ${JSON.stringify(condition)}, Data: ${JSON.stringify(data)}, Error: ${error.toString()}`);
  }
};

const teamRank = async () => {
  try {
    const rank = await Team.aggregate([
      {
        $addFields: {
          lastGameProgress: { $arrayElemAt: ["$game_progress", -1] }, // Get the last game progress
          score: { $ifNull: [{ $arrayElemAt: ["$game_progress.level", -1] }, 0] } // Extract level safely
        }
      },
      {
        $sort: {
          "lastGameProgress.level": -1,     // Sort by level descending
          "lastGameProgress.timestamp": 1  // Sort by timestamp ascending
        }
      },
      {
        $project: {
          name: 1, // Include name
          game_progress: {
            $map: {
              input: "$game_progress", // Iterate over the game_progress array
              as: "gp",
              in: {
                level: "$$gp.level",    // Include only the fields you want
                timestamp: "$$gp.timestamp"
              }
            }
          },
          members: {
            member_1: {
              $cond: { if: { $eq: [{ $type: "$members.member_1" }, "object"] }, then: { name: "$members.member_1.name", id: "$members.member_1.id", email: "$members.member_1.email" }, else: null }
            },
            member_2: {
              $cond: { if: { $eq: [{ $type: "$members.member_2" }, "object"] }, then: { name: "$members.member_2.name", id: "$members.member_2.id", email: "$members.member_2.email" }, else: null }
            },
            member_3: {
              $cond: { if: { $eq: [{ $type: "$members.member_3" }, "object"] }, then: { name: "$members.member_3.name", id: "$members.member_3.id", email: "$members.member_3.email" }, else: null }
            }
          },
          code: 1,             // Include code
          lastGameProgress: 1, // Include lastGameProgress for reference
          score: 1,            // Include score
          _id: 0               // Exclude _id
        }
      }
    ]);
    return rank;
  } catch (error) {
    throw new Error(`Get Team Rank Failed, Error: ${error.message}`);
  }
};


module.exports = {
  creatTeam,
  findTeam,
  countTeam,
  updateTeamProgress,
  updateTeamEmailVerify,
  updateTeam,
  teamRank,
}
