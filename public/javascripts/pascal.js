const myModal = new bootstrap.Modal(document.getElementById('result'));
const btns = document.querySelectorAll(".inputBtn");
const inputArea = document.getElementById("clickInput");


const checkInput = (inputs) => {
  return new Promise((rs, rj) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "answer": inputs
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch("/api/game/pascal", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if(result["status"] === 200) {
          document.querySelector(".modal-body").innerHTML = `
            <span>Welll Done.</span><br>
            <span>Here is the code, keep it secret.</span><br>
            <span>${result["storyCode"]}</span><br>
            <a href="/story">Use The Code</a>
          `;
          myModal.show();
        }
      })
      .catch((error) => console.error(error));
  })
}

for (let i = 0; i < btns.length; i += 1) {
  btns[i].addEventListener("click", (e) => {
    inputArea.innerHTML += `
    <div class="col text-center">
      ${e.target.innerText}
    </div>`;
    const inputs = inputArea.innerText.replaceAll('\n', '');
    checkInput(inputs);
  })
}
