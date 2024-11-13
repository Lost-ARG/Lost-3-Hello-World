const sendRequest = () => {

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = {
    "title": document.querySelector("[name='title']").value,
    "isVisible": document.querySelector("[name='isVisible']").value,
    "content": document.querySelector("[name='content']").value
  };

  if(!raw["title"] || !raw["content"]) {
    return;
  }

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(raw),
    redirect: "follow"
  };

  fetch("/api/backstage/create-notice", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      console.log(result)
      document.querySelector("[name='title']").value = ""
      document.querySelector("[name='isVisible']").selectedIndex = 0
      document.querySelector("[name='content']").value = ""
    })
    .catch((error) => console.error(error));
}