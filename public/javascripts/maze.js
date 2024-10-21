const myModal = new bootstrap.Modal(document.getElementById('result'));
const mazeSideLen = 19;
const canvas = document.getElementById("mycanvas");
const ctx = canvas.getContext("2d");

const span = document.querySelector("span");
let noteClicked = false;
let moveCount = 0;
let gameStart = false;

span.addEventListener("click", (e) => {
  e.target.classList.toggle("text-danger");
  noteClicked = !noteClicked;
})

let tree = Array.from({ length: mazeSideLen }, () => Array(mazeSideLen).fill(-1));
let isConnected = Array.from({ length: mazeSideLen * mazeSideLen }, () => Array(mazeSideLen * mazeSideLen).fill(-1));

const drawMazeBoard = () => {
  ctx.strokeStyle = noteClicked ? "white" : "black";
  for (let i = 0; i <= mazeSideLen; i++) {
    ctx.lineWidth = 2;
    ctx.moveTo(15 + i * 30, 15);
    ctx.lineTo(15 + i * 30, 15 + 30 * mazeSideLen);
    ctx.moveTo(15, 15 + i * 30);
    ctx.lineTo(15 + 30 * mazeSideLen, 15 + i * 30);
    ctx.stroke();
  }
}

const getNeighbors = (index) => {
  const x = Math.floor(index / mazeSideLen);
  const y = index % mazeSideLen;
  const neighbors = [];
  if (x > 0) neighbors.push((x - 1) * mazeSideLen + y);
  if (x < mazeSideLen - 1) neighbors.push((x + 1) * mazeSideLen + y);
  if (y > 0) neighbors.push(x * mazeSideLen + y - 1);
  if (y < mazeSideLen - 1) neighbors.push(x * mazeSideLen + y + 1);
  return neighbors[Math.floor(Math.random() * neighbors.length)];
}

const findRoot = (index) => {
  const x = Math.floor(index / mazeSideLen);
  const y = index % mazeSideLen;
  if (tree[x][y] >= 0) {
    return findRoot(tree[x][y]);
  }
  return index;
}

const unionSets = (a, b) => {
  const rootA = findRoot(a);
  const rootB = findRoot(b);

  if (rootA !== rootB) {
    const [xA, yA] = [Math.floor(rootA / mazeSideLen), rootA % mazeSideLen];
    const [xB, yB] = [Math.floor(rootB / mazeSideLen), rootB % mazeSideLen];

    if (tree[xA][yA] < tree[xB][yB]) {
      tree[xA][yA] += tree[xB][yB];
      tree[xB][yB] = rootA;
    } else {
      tree[xB][yB] += tree[xA][yA];
      tree[xA][yA] = rootB;
    }
  }
}

const drawLine = (a, b) => {
  const [x1, y1] = [Math.floor(a / mazeSideLen), a % mazeSideLen];
  const [x2, y2] = [Math.floor(b / mazeSideLen), b % mazeSideLen];

  if (x1 !== x2) {
    ctx.clearRect(29 + (x1 + x2) / 2 * 30, (y1 + y2) / 2 * 30 + 16, 2, 28);
  } else {
    ctx.clearRect((x1 + x2) / 2 * 30 + 16, 29 + (y1 + y2) / 2 * 30, 28, 2);
  }
}

const setMaze = () => {
  while (findRoot(0) !== findRoot(mazeSideLen * mazeSideLen - 1)) {
    const randomIndex = Math.floor(Math.random() * mazeSideLen * mazeSideLen);
    const neighbor = getNeighbors(randomIndex);

    if (findRoot(randomIndex) !== findRoot(neighbor)) {
      isConnected[randomIndex][neighbor] = isConnected[neighbor][randomIndex] = 1;
      drawLine(randomIndex, neighbor);
      unionSets(randomIndex, neighbor);
    }
  }
}

let playerX, playerY;
const goalX = mazeSideLen * 30 - 10, goalY = mazeSideLen * 30 - 10;

const drawPlayerAndGoal = () => {
  ctx.fillStyle = "red";
  ctx.fillRect(goalX, goalY, 20, 20);
  ctx.fillStyle = "blue";
  ctx.fillRect(playerX, playerY, 20, 20);
}


const controls = document.querySelector('.controls');
const controlBtns = controls.querySelectorAll('button');

controlBtns.forEach(btn => {
  btn.addEventListener("click", handleMove)
})
window.addEventListener("keydown", handleMove, true);

const handleMove = (event) => {
  if(!gameStart) {
    return;
  }
  let key;
  if (event.type === "keydown") {
    key = event.keyCode
  } else if (event.type === "click") {
    key = event.target.value;
  }
  const currentX = (playerX - 20) / 30; // Convert pixel position to grid position
  const currentY = (playerY - 20) / 30;
  const currentPos = currentX * mazeSideLen + currentY;

  switch (key) {
    case 38: // Up arrow key
    case "↑": // Up arrow button
      event.preventDefault();
      if (currentY > 0 && isConnected[currentPos][currentPos - 1] === 1) {
        movePlayer(0, -30);
      } else {
        handleGameOver();
      }
      break;
    case 39: // Right arrow key
    case "→": // Right arrow button
      event.preventDefault();
      if (currentX < mazeSideLen - 1 && isConnected[currentPos][currentPos + mazeSideLen] === 1) {
        movePlayer(30, 0);
      } else {
        handleGameOver();
      }
      break;
    case 40: // Down arrow key
    case "↓": // Down arrow button
      event.preventDefault();
      if (currentY < mazeSideLen - 1 && isConnected[currentPos][currentPos + 1] === 1) {
        movePlayer(0, 30);
      } else {
        handleGameOver();
      }
      break;
    case 37: // Left arrow key
    case "←": // Left arrow button
      event.preventDefault();
      if (currentX > 0 && isConnected[currentPos][currentPos - mazeSideLen] === 1) {
        movePlayer(-30, 0);
      } else {
        handleGameOver();
      }
      break;
    default:
      break;
  }
}

const movePlayer = (deltaX, deltaY) => {
  moveCount += 1;
  ctx.clearRect(playerX - 2, playerY - 2, 25, 25);
  playerX += deltaX;
  playerY += deltaY;
  ctx.fillRect(playerX, playerY, 20, 20);
  if (playerX >= goalX && playerY >= goalY) {
    handleGameOver(true);
  }
}

const sendRequest = (pass) => {
  return new Promise((rs, rj) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
  
    const raw = JSON.stringify({
      pass,
      noteClicked,
      moveCount,
      mazeSideLen,
    });
  
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };
  
    fetch("/api/game/maze", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result["status"] === 200) {
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

const handleGameOver = async (pass = false) => {
  gameStart = false;
  realPass = false;
  if (pass) {
    realPass = await sendRequest(pass);
  }
  if(realPass) {
    myModal.show();
    document.querySelector("h2").innerHTML = "You Win";
  } else {
    document.querySelector("h2").innerHTML = "Game Over";
  }
  document.querySelector("#start-btn").innerHTML = "RETRY";
  document.querySelectorAll(".gameAreaElement").forEach(e => {
    e.classList.toggle("hide")
  })
}

const start = () => {
  document.querySelectorAll(".gameAreaElement").forEach(e => {
    e.classList.toggle("hide");
  })
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  tree = Array.from({ length: mazeSideLen }, () => Array(mazeSideLen).fill(-1));
  isConnected = Array.from({ length: mazeSideLen * mazeSideLen }, () => Array(mazeSideLen * mazeSideLen).fill(-1));
  drawMazeBoard();
  setMaze()
  moveCount = 0;
  playerX = 20;
  playerY = 20;
  drawPlayerAndGoal();
  gameStart = true;
}

const retry = () => {
  start();
}