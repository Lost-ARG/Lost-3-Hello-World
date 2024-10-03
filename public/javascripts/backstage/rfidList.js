const requestOptions = {
  method: "GET",
  redirect: "follow"
};

fetch("/api/backstage/rfid-list", requestOptions)
  .then((response) => response.json())
  .then((result) => {
    const { cards } = result;
    const rfidListElement = document.getElementById("rfid-list");
    let html = '';
    for (let i = 0; i < cards.length; i += 1) {
      html += `
        <tr>
          <th scope="row">${i}</th>
          <td>${cards[i]["card_id"]}</td>
          <td>${cards[i]["type"]}</td>
        </tr>`
    }
    rfidListElement.innerHTML = html;
  })
  .catch((error) => console.error(error));