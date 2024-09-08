const requestOptions = {
  method: "GET",
  redirect: "follow"
};

fetch("/api/backstage/team-list", requestOptions)
  .then((response) => response.json())
  .then((result) => {
    const { data } = result;
    const teamListElement = document.getElementById("team-list");
    let html = '';
    for (let i = 0; i < data.length; i += 1) {
      html += `<div class="col-lg-4 col-12 mt-3">`
      html += `<a class="btn btn-secondary btl-lg w-100" href="/backstage/team?team=${data[i]["name"]}">${data[i]["name"]}</a>`
      html += `</div>`
    }
    teamListElement.innerHTML = html;
  })
  .catch((error) => console.error(error));