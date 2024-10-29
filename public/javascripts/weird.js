const texts = [
  "再找找",
  "不是我",
  "哥你認錯人了",
  "我又進來了",
  "我又出去了",
  "你打我呀",
  "我全都要",
  "敢問高人尊姓大名",
  "敝人，張麻子",
  "吃著火鍋唱著歌",
  "看清楚點",
  "我快大出來了",
  "我要開始加速了",
  "對不起",
  "謝謝學姐",
  "謝謝學長",
  "那個也是",
  "這個也是",
  "只有這個",
  "還有這個",
]

// 生成隨機數量的元素並分布在頁面上
const createRandomElements = (count) => {
  for (let i = 0; i < count; i++) {
    // 建立新的元素
    const element = document.createElement('div');
    element.classList.add('random-element');
    element.innerHTML = `<a class="text-white" href="">${texts[Math.floor(Math.random() * texts.length)]}</a>`;

    // 獲取元素寬高
    document.body.appendChild(element); // 先加入元素以測量大小
    const elementWidth = element.offsetWidth;
    const elementHeight = element.offsetHeight;

    // 設定隨機位置，確保不超出螢幕範圍
    const maxX = window.innerWidth - elementWidth;
    const maxY = window.innerHeight - elementHeight;
    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;
    element.style.left = `${randomX}px`;
    element.style.top = `${randomY}px`;
    element.style.zIndex = `-1`;
  }
};

createRandomElements(300);

const createElement = (url) => {
  const element = document.createElement('div');
  element.classList.add('random-element');
  element.classList.add('source');
  element.innerHTML = `<a class="text-white" href="${url}">Source</a>`;

  // 獲取元素寬高
  document.body.appendChild(element); // 先加入元素以測量大小
  const elementWidth = element.offsetWidth;
  const elementHeight = element.offsetHeight;

  // 設定隨機位置，確保不超出螢幕範圍
  const maxX = window.innerWidth - elementWidth;
  const maxY = window.innerHeight - elementHeight;
  const randomX = Math.random() * maxX;
  const randomY = Math.random() * maxY;
  element.style.left = `${randomX}px`;
  element.style.top = `${randomY}px`;
  element.style.zIndex = `99`;
}