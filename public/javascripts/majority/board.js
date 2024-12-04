const socket = io();
const sleep = ms => new Promise(rs => setTimeout(rs, ms));
let needFlush = false;

const showResult = async (data) => {
  const voteResult = document.querySelector("#vote-result");
  voteResult.innerHTML = '';
  const voteResultData = data["voteResult"];
  for (const key in voteResultData) {
    const element = voteResultData[key];
    voteResult.innerHTML += `<div class="col-lg-3 col-2">${key} ${element}</div>`;
    await sleep(800)
  }
  await sleep(1200)
  voteResult.innerHTML += '<div class="row mt-5">'
  if (data["conclusion"] === "none") {
    voteResult.innerHTML += "<h2>看來你們還沒有得到結論</h2>";
  } else if (data["conclusion"] === "back") {
    voteResult.innerHTML += `<h2>你們的選擇是:<br>美好的未來 - ${data["storyCode"]}</h2>`;
  } else {
    voteResult.innerHTML += `<h2>你們的選擇是:<br>悲慘的未來 - ${data["storyCode"]}</h2>`;
  }
}

const removeResult = () => {
  const voteResult = document.querySelector("#vote-result");
  voteResult.innerHTML = "";
}

const flush = () => {
  if(needFlush) {
    window.location.reload();
  }
}

// show vote result
socket.on('vote/show', async args => {
  showResult(args);
  await sleep(30 * 1000);
  needFlush = true;
  flush();
})

socket.on('vote/reset', args => {
  removeResult(args);
  needFlush = false;
})

const getVoteUrl = () => {
  return new Promise((rs, rj) => {
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
    
    fetch("/api/game/majority/player-url", requestOptions)
      .then((response) => response.json())
      .then((result) => rs(result["url"]))
      .catch((error) => console.error(error));
  })
}

const showQRCode = async () => {
  try {
    
    document.querySelector("#qrcode").innerHTML = "";
    const url = await getVoteUrl();
    
    new QRCode("qrcode", {
      text: url,
      width: 256,
      height: 256,
      colorDark : "#000000",
      colorLight : "#ffffff",
      correctLevel : QRCode.CorrectLevel.H
     });
  } catch (error) {
    
  }
}

setInterval(showQRCode, 10*60*1000); // 10 分鐘刷新一次

showQRCode()