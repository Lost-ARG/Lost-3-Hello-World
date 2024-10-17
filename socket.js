
const { Server } = require('socket.io');
const { findTeam } = require('./service/database/teamService');
const { verify } = require('./service/jwtService');
const io = new Server();
const socket = {
  io: io
};

global.swipeRFID = false;
let votingCount = 0;
let teamVote = {};

io.on("connection", (socket) => {
  console.log('socket connected successfully');
  socket.on('message', (data) => {
    console.log('Received message:', data);
  });
  socket.on('get-team-info', async (arg) => {
    try {
      const teams = await findTeam();
      socket.emit('team-info', teams)
    } catch (error) {
      console.error(error);
    }
  })

  socket.on("vote", async (args) => {
    const token = args["token"];
    const tokenVerifyResult = await verify(token);
    if (!tokenVerifyResult) {
      console.log("Token 過期!!!!!");
      return
    }
    votingCount += 1;
    teamVote[args["playerName"]] = args["choice"];
    if (votingCount < 3) {
      return;
    }
    let voteResult;
    if (global.swipeRFID) {
      voteResult = {
        "方璇": "O",
        "鄭烈": "O",
        "邢泰": "O",
        "鍾瑞基": "O",
        "魏元祖": "O",
        "韓術": "O"
      }
    } else {
      voteResult = {
        "方璇": "O",
        "鄭烈": "X",
        "邢泰": "X",
        "鍾瑞基": "X",
        "魏元祖": "X",
        "韓術": "--"
      }
    }
    // put players' choice into voteResult
    for (const key in teamVote) {
      voteResult[key] = teamVote[key];
    }

    // check vote result
    let o = 0;
    let x = 0;
    for (const key in voteResult) {
      if (Object.prototype.hasOwnProperty.call(voteResult, key)) {
        const element = voteResult[key];
        voteResult[key] = element;
        if (element === "O") {
          o += 1;
        } else if (element === "X") {
          x += 1;
        }
      }
    }
    let conclusion;
    if (o === x) {
      conclusion = "none";
    } else if (o > x) {
      conclusion = "go";
    } else {
      conclusion = "back";
    }
    const storyCode_13_1 = process.env.LEVEL_13_1_STORY_CODE;
    const storyCode_13_2 = process.env.LEVEL_13_2_STORY_CODE;

    const response = {
      voteResult,
      conclusion,
      storyCode: conclusion !== "none" ? global.swipeRFID ? storyCode_13_2 : storyCode_13_1 : ""
    }
    io.emit('vote/show', response);
  })

  socket.on("vote/reset", async (args) => {
    const token = args["token"];
    const tokenVerifyResult = await verify(token);
    if (!tokenVerifyResult) {
      console.log("Token 過期!!!!!");
      return
    }

    global.swipeRFID = false;
    votingCount = 0;
    teamVote = {};
    io.emit("vote/reset");
  })
})

module.exports = socket;
