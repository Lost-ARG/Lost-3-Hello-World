const myModal = new bootstrap.Modal(document.getElementById('result'));
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const controlBtns = document.querySelectorAll(".control");
const resetBtn = document.querySelector(".reset");

const sleep = ms => new Promise(rs => setTimeout(rs, ms));

class SnakePart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

let tileCount = 18;
let tileSize = canvas.width / tileCount - 2;
let headX = 10;
let headY = 10;
const snakePart = [];
let tailLen = 0;

let appleX = 5;
let appleY = 5;

let xV = 0;
let yV = 0;

let score = 0;
let touchedWall;


const playAgain = (event) => {
  if (event.keyCode == 32 || event.target.value === "reset") {
    location.reload();
  }
}

const startGame = async () => {
  snakePosition();
  let lose = await isOver();
  if (lose) {
    document.body.addEventListener('keydown', playAgain);
    return;
  }
  clearScreen();

  checkColli();
  let win = isWin();
  if (win) {
    return;
  }
  drawApple();
  drawSnake();
  drawScore();

  setTimeout(startGame, 400);
}

const isWin = () => {
  let win = false;
  if (score == 25) {
    win = true;
  }
  if (win) {
    ctx.fillStyle = "white";
    ctx.font = "50px Poppins";
    ctx.fillText("你贏了!", canvas.width / 3.6, canvas.height / 2)
  }
  return win;
}

const sendDataToCheck = async () => {
  return new Promise((rs, rj) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      tailLen,
      headX,
      headY,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch("/api/game/snake", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result["status"] === 200) {
          touchedWall = result["touchedWall"];
          document.querySelector(".modal-body").innerHTML = `
            <span>Welll Done.</span><br>
            <span>Here is the code, keep it secret.</span><br>
            <span>${result["storyCode"]}</span><br>
            <a href="/story">Use The Code</a>
          `;
          rs(true);
        }
        rs(false)
      })
      .catch((error) => console.error(error));
  })
}

const isRealWon = async () => {
  const result = await sendDataToCheck()
  return result;
}

const playAnimation = async () => {
  for(let i = 0; i < 5; i += 1) {
    canvas.style[`border${touchedWall}`] = "2px solid rgb(168, 168, 168)";
    await sleep(100)
    canvas.style[`border${touchedWall}`] = "none";
    await sleep(100)
  }
  await sleep(100)
  document.querySelector(".container").classList.add("fade-out")
  await sleep(3000)

}

const isOver = async () => {
  let Over = false;
  let realWon = false;
  if (headX < 0 || headX >= 20 || headY < 0 || headY >= 20) {
    realWon = await isRealWon();
    Over = true;
  }
  for (let i = 0; i < snakePart.length; i++) {
    if (headX == snakePart[i].x && headY == snakePart[i].y) {
      Over = true;
    }
  }
  if (Over) {
    if (!realWon) {
      ctx.fillStyle = "white";
      ctx.font = "50px Poppins";
      ctx.fillText("Game Over", canvas.width / 5, canvas.height / 2);
      ctx.font = "40px Poppins";
      ctx.fillText("再玩一次?", canvas.width / 3.5, canvas.height / 2 + 50);
      ctx.font = "25px Poppins";
      ctx.fillText("按空白鍵或點擊 RESET 按鈕", canvas.width / 12, canvas.height / 2 + 100);
    } else {
      await playAnimation()

      myModal.show();
    }
  }
  return Over;
}

const clearScreen = () => {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, 400, 400);
}

const drawSnake = () => {

  ctx.fillStyle = "green";
  for (let i = 0; i < snakePart.length; i++) {
    let part = snakePart[i];
    ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
  }

  snakePart.push(new SnakePart(headX, headY));
  if (snakePart.length > tailLen) {
    snakePart.shift();
  }

  ctx.fillStyle = 'orange';
  ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);

}

const drawApple = () => {
  ctx.fillStyle = "red";
  ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize);
}

const drawScore = () => {
  ctx.fillStyle = "white";
  ctx.font = "20px Poppins";
  ctx.fillText("Score: " + score, canvas.width - 100, 30);
}

const coordinateOverlapped = () => {
  for (let i = 0; i < snakePart.length; i++) {
    let part = snakePart[i];
    if(appleX === part.x && appleX === part.y) {
      return true;
    }
  }
  return false;
}

const checkColli = () => {
  if (appleX === headX && appleY === headY) {
    do {
      appleX = Math.floor(Math.random() * tileCount);
      appleY = Math.floor(Math.random() * tileCount);
    }
    while(coordinateOverlapped())
    tailLen++;
    score += 1;
  }
}

const snakePosition = () => {
  headX = headX + xV;
  headY = headY + yV;
}

controlBtns.forEach(btn => {
  btn.addEventListener("click", (e) => {
    const dir = e.target.value;
    //go up
    if (dir === "↑") {
      if (yV == 1)
        return;
      yV = -1;
      xV = 0;
    }

    //go down
    if (dir === "↓") {
      if (yV == -1)
        return;
      yV = 1;
      xV = 0;
    }

    //go left
    if (dir === "←") {
      if (xV == 1)
        return;
      yV = 0;
      xV = -1;
    }

    //go right
    if (dir === "→") {
      if (xV == -1)
        return;
      yV = 0;
      xV = 1;
    }

  })
});

resetBtn.addEventListener("click", playAgain)

const keyDown = (event) => {

  //go up
  if (event.keyCode == 38) {
    if (yV == 1)
      return;
    yV = -1;
    xV = 0;
  }

  //go down
  if (event.keyCode == 40) {
    if (yV == -1)
      return;
    yV = 1;
    xV = 0;
  }

  //go left
  if (event.keyCode == 37) {
    if (xV == 1)
      return;
    yV = 0;
    xV = -1;
  }

  //go right
  if (event.keyCode == 39) {
    if (xV == -1)
      return;
    yV = 0;
    xV = 1;
  }
}

document.body.addEventListener('keydown', keyDown);


startGame();
