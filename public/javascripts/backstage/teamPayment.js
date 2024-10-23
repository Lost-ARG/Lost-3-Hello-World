const searchResult = document.querySelector("#searchResult");
const input = document.querySelector("input");

input.addEventListener("keypress", function(event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("searchBtn").click();
  }
});

const renderSearchResult = (data) => {
  if(data.length === 0) {
    searchResult.innerHTML = `<div class="row text-center justify-content-center fs-5 border-bottom pb-1 pt-1">No Data</div>`
    return;
  }
  let html = "";
  for (let i = 0; i < data.length; i += 1) {
    html += `<div class="row text-center fs-5 border-bottom pb-1 pt-1">`
    html += `<div class="col-lg-2 d-flex align-items-center">${data[i]["code"]}</div>`
    html += `<div class="col-lg-8 d-flex align-items-center">${data[i]["name"]}</div>`
    html += `<div class="col-lg-2 btn ${data[i]["paid"] ? "btn-secondary" : "btn-danger"}" onclick="changePaidStat('${data[i]["_id"]}', ${data[i]["paid"]})">${data[i]["paid"] ? "已付款" : "尚未付款"}</div>`
    html += `</div>`
  }
  searchResult.innerHTML = html
}


const search = () => {
  const searchKey = input.value;
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };

  fetch(`/api/backstage/payment-search?searchKey=${searchKey}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result["status"] !== 200) {
        alert("Server Error");
        return;
      }
      const { data } = result;
      renderSearchResult(data);
    })
    .catch((error) => console.error(error));
}

const searchByPaid = (paid) => {
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };

  fetch(`/api/backstage/search-team-by-paid?paid=${paid}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result["status"] !== 200) {
        alert("Server Error");
        return;
      }
      const { data } = result;
      renderSearchResult(data);
    })
    .catch((error) => console.error(error));
}

const changePaidStat = (id, paidStat) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    id,
    paidStat
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  fetch("/api/backstage/change-paid-stat", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result["status"] === 200) {
        search();
      }
    })
    .catch((error) => console.error(error));
}

search();
