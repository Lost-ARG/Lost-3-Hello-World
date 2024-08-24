const sleep = (ms) => new Promise(rs => setTimeout(() => rs(), ms));

const openGate = async () => {
  const gate = document.getElementById('gate');
  await sleep(800)
  gate.classList.add('opened');
  await sleep(1000)
  gate.classList.add('d-none');

}

const init = () => {
  setTimeout(function () { openGate(); }, 1000);
}

init();
