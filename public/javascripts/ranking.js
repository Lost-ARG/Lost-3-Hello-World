const getTeamRank = () => {
  return new Promise((rs, rj) => {
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
    
    fetch("/api/team/ranking", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if(result["status"] === 200) {
          rs(result["data"]);
        }
        rj();
      })
      .catch((error) => console.error(error));
  })
}


document.addEventListener("DOMContentLoaded", async () => {
  let currentData = await getTeamRank();

  const list = document.getElementById("ranking-list");

  // 初始化排行榜
  function renderLeaderboard(data) {
    list.innerHTML = "";
    data.forEach((item, index) => {
      const listItem = document.createElement("li");
      listItem.setAttribute("data-name", item.name);
      listItem.style.transform = `translateY(${index * 100}%)`; // 初始位置
      listItem.innerHTML = `
        <span class="rank col-1">${index + 1}</span>
        <span class="code col-2">${item.code}</span>
        <span class="name col-8 text-truncate">${item.name}</span>
        <span class="score col-1">${item.score}</span>
      `;
      list.appendChild(listItem);
    });
  }

  // 更新排行榜
  function updateLeaderboard(newData) {
    // 排序新的數據
    newData.sort((a, b) => b.score - a.score);

    // 建立映射，計算新舊位置
    const itemElements = Array.from(list.children);
    const nameToElement = new Map(itemElements.map((el) => [el.dataset.name, el]));

    newData.forEach((item, newIndex) => {
      const element = nameToElement.get(item.name);
      if (element) {
        // 更新分數
        element.querySelector(".rank").textContent = newIndex+1;
        element.querySelector(".score").textContent = item.score;

        // 更新位置
        const oldPosition = parseFloat(element.style.transform.match(/-?\d+/)?.[0] || 0);
        const newPosition = newIndex * 100;

        if (oldPosition !== newPosition) {
          element.style.transform = `translateY(${newPosition}%)`;
        }
      }
    });
  }

  // 初次渲染
  renderLeaderboard(currentData);

  // 數據更新
  setInterval(async () => {
    currentData = await getTeamRank();
    updateLeaderboard(currentData);
  }, 3000);
});
