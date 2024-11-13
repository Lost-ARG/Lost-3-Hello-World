const requestOptions = {
  method: "GET",
  redirect: "follow"
};

fetch("/api/backstage/notice-list", requestOptions)
  .then((response) => response.json())
  .then((result) => {
    const { notices } = result;
    const noticeListElement = document.getElementById("notice-list");
    let html = '';
    for (let i = 0; i < notices.length; i += 1) {
      html += `
        <tr onclick="window.location.href='/backstage/notice?_id=${notices[i]["_id"]}';" style="cursor:pointer;">
          <th scope="row">${i}</th>
          <td>${notices[i]["updatedAt"]}</td>
          <td>${notices[i]["title"]}</td>
        </tr>`
    }
    noticeListElement.innerHTML = html;
  })
  .catch((error) => console.error(error));