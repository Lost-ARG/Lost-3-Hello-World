const sendRequest = () => {

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = {
    "uid": document.querySelector("[name='uid']").value,
    "type": document.querySelector("[name='type']").value
  };

  if(raw["type"] !== "tag" && raw["type"] !== "card") {
    return;
  }

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(raw),
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