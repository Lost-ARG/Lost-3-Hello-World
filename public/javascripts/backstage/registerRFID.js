const sendRequest = () => {

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    "uid": document.querySelector("[name='uid']").value,
    "type": document.querySelector("[name='type']").value
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  fetch("/api/backstage/register-rfid", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      console.log(result)
      document.querySelector("[name='uid']").value = '';
      document.querySelector("[name='type']").selectedIndex = 0;
    })
    .catch((error) => console.error(error));
}