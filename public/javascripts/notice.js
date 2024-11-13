const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const _id = urlParams.get('_id');


const getNotice = () => {
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };

  fetch(`/api/notice?_id=${_id}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {

      if (result["status"] === 200) {
        document.querySelector("#title").innerHTML = result["data"]["title"];
        document.querySelector("#content").innerHTML = result["data"]["content"];
        document.querySelector("#updatedAt").innerHTML = `最後更新於: ${result["data"]["updatedAt"]}`
      }
    })
    .catch((error) => console.error(error));
}


const init = () => {
  getNotice()
}

init();
