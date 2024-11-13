const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const _id = urlParams.get('_id');
const myModal = new bootstrap.Modal(document.getElementById('result'));
const sendRequest = () => {

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = {
    _id,
    "title": document.querySelector("[name='title']").value,
    "isVisible": document.querySelector("[name='isVisible']").value,
    "content": document.querySelector("[name='content']").value
  };

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(raw),
    redirect: "follow"
  };

  fetch("/api/backstage/update-notice", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      document.querySelector(".modal-body").innerHTML = (
        result["status"] === 200 ? "更新成功" : "更新失敗"
      )
      myModal.show();
    })
    .catch((error) => console.error(error));
}

const getNotice = () => {
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };

  fetch(`/api/backstage/notice?_id=${_id}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      
      if (result["status"] === 200) {
        document.querySelector("[name='title']").value = result["data"]["title"];
        document.querySelector("[name='isVisible']").selectedIndex = result["data"]["isVisible"] ? 0 : 1;
        document.querySelector("[name='content']").value = result["data"]["content"];
      }
    })
    .catch((error) => console.error(error));
}


const init = () => {
  getNotice()
}

init();
