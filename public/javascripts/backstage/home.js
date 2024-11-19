const signUpNumElement = document.getElementById("signup-num");
const verifyNumElement = document.getElementById("verify-num");
const fastestTeamElement = document.getElementById("fastest-team");
const latestProgressElement = document.getElementById("latest-progress");

const socket = io();

const getTeamInfo = () => {
  socket.emit('get-team-info')
}

// 接收後端 Socket 傳來的隊伍資訊
socket.on('team-info', teamInfo => {
  const signUpNum = teamInfo.length;
  let verifyNum = 0;
  let fastest = 0;
  let fastestTeam = teamInfo[fastest];
  for (let i = 0; i < teamInfo.length; i += 1) {
    const curTeam = teamInfo[i];
    // 檢查驗證 email
    if (
      curTeam['members']['member_1']['email_verify']
      && curTeam['members']['member_2']['email_verify']
      && curTeam['members']['member_3']['email_verify']
    ) {
      verifyNum += 1;
    }
    // 找最快的隊伍
    const curLevel = curTeam["game_progress"][curTeam["game_progress"].length - 1];
    const fastestLevel = fastestTeam["game_progress"][fastestTeam["game_progress"].length - 1];
    const levelSub = curLevel["level"] - fastestLevel["level"];
    if (levelSub > 0) {
      fastest = i;
    } else if (levelSub === 0) {
      // 同進度，比時間
      const curLevelTime = new Date(curLevel["timestamp"]);
      const fastestLevelTime = new Date(fastestLevel["timestamp"]);
      if (curLevelTime < fastestLevelTime) {
        fastest = i;
      }
    }
    fastestTeam = teamInfo[fastest];

  }
  signUpNumElement.innerHTML = signUpNum;
  verifyNumElement.innerHTML = verifyNum;
  fastestTeamElement.innerHTML = fastestTeam['name'];
  latestProgressElement.innerHTML = fastestTeam["game_progress"][fastestTeam["game_progress"].length - 1]["level"];
})

setInterval(getTeamInfo, 1000);

getTeamInfo();
