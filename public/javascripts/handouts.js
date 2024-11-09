const myModal = new bootstrap.Modal(document.getElementById('result'));
const sendRequest = (answer) => {
  return new Promise((rs, rj) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      answer
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch("/api/game/handouts", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if(result["status"] === 200) {
          document.querySelector(".modal-body").innerHTML = `
            <span>Welll Done.</span><br>
            <span>Here is the code, keep it secret.</span><br>
            <span>${result["storyCode"]}</span><br>
            <a href="/story">Use The Code</a>
          `;
          myModal.show()
        }
      })
      .catch((error) => console.error(error));
  })
}

const submitAns = async () => {
  const answer = document.querySelector("#input").value;
  sendRequest(answer)
}
