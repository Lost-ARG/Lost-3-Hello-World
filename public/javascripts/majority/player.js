const myModal = new bootstrap.Modal(document.getElementById('player-input'));
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const token = urlParams.get('token');
let playerName;

const socket = io();
// show modal let player input their name
const readInput = () => {
  playerName = document.querySelector('#player-name').value;
  myModal.hide();
}

const reset = () => {
  socket.emit("vote/reset", { token });
}

const vote = (val) => {
  if (!playerName) {
    myModal.show();
    return;
  }
  socket.emit("vote", {
    token,
    playerName,
    choice: val
  })
  document.querySelectorAll('.choice').forEach(element => {
    element.disabled = true;
  })
  document.querySelector('#reset').disabled = false;
}

socket.on("vote/reset", () => {
  document.querySelectorAll('.choice').forEach(element => {
    element.disabled = false;
  })
  document.querySelector('#reset').disabled = true;
})


const init = () => {
  reset();
}

init()
