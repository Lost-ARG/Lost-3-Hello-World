// 圖片資源，可以替換為你想要的圖片 URL 列表
const images = [
  '/images/nums/0.gif',
  '/images/nums/1.gif',
  '/images/nums/2.gif',
  '/images/nums/3.gif',
  '/images/nums/4.gif',
  '/images/nums/5.gif',
  '/images/nums/6.gif',
  '/images/nums/7.gif',
  '/images/nums/8.gif',
  '/images/nums/9.gif',
];

let currentImageCount = 0; // 當前圖片數量
let currentImageID;
const maxImages = 10; // 最大圖片數量


function addKeyframesToDocument(keyframes) {
  const styleSheet = document.createElement('style');
  styleSheet.appendChild(document.createTextNode(keyframes));
  document.head.appendChild(styleSheet);
  return styleSheet;
}

function makeDraggable(element) {
  let isDragging = false;
  let startX, startY, initialX, initialY;
  let styleElement;

  function onGrabbing(event) {
    isDragging = true;
    event.preventDefault();

    if (event.type === "mousedown") {
      startX = event.clientX;
      startY = event.clientY;
    } else if (event.type === "touchstart") {
      const touch = event.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
    }
    initialX = element.offsetLeft;
    initialY = element.offsetTop;
    element.style.cursor = 'grabbing';
    // 停止上飄動畫
    element.style.animationPlayState = 'paused';
  }

  function onMove(event) {
    if (isDragging) {
      event.preventDefault();
      let deltaX, deltaY;
      if (event.type === "mousemove") {
        deltaX = event.clientX - startX;
        deltaY = event.clientY - startY;
      } else if (event.type === "touchmove") {
        const touch = event.touches[0];
        deltaX = touch.clientX - startX;
        deltaY = touch.clientY - startY;
      }

      element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    }
  }

  function onRelease(event) {
    if (isDragging) {
      isDragging = false;
      element.style.cursor = 'grab';
      element.style.transform = '';
      element.style.animationPlayState = 'running';
    }
  }
  element.addEventListener('mousedown', onGrabbing);

  document.addEventListener('mousemove', onMove);

  document.addEventListener('mouseup', onRelease);

  // 添加觸控事件支持
  element.addEventListener('touchstart', onGrabbing);

  document.addEventListener('touchmove', onMove);

  document.addEventListener('touchend', onRelease);
  // 當圖片漂出視窗或動畫結束時，刪除對應的 style 元素
  element.addEventListener('animationend', () => {
    if (styleElement) {
      styleElement.remove();
      styleElement = null;
    }
    element.remove();
    currentImageCount--; // 減少圖片數量
  });
}

function createFloatingImage() {
  // 檢查是否達到最大圖片數量
  if (currentImageCount >= maxImages) return;

  const img = document.createElement('img');
  img.src = images[Math.floor(Math.random() * images.length)];
  img.className = 'floating-image draggable';

  // 隨機設置圖片的起始位置
  img.style.left = Math.random() * (window.innerWidth - 100) + 'px';
  img.style.bottom = '-100px'; // 從視窗底部以下開始

  document.body.appendChild(img);
  currentImageCount++; // 增加圖片數量
  currentImageID = Math.floor(Math.random() * 1000);
  // 讓圖片可拖曳
  makeDraggable(img);
}

// 每隔一段時間創建一個新的漂浮圖片
setInterval(createFloatingImage, 1000); // 每秒創建一張新圖片

function sendAns(ans) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({answer: ans}),
    redirect: "follow"

  };

  fetch("/api/game/helloworld", requestOptions)
    .then((response) => {
      if(response.redirected) {
        alert("Well Done")
        location.href = response.url
      }
    })
    .catch((error) => console.error(error));
}

function checkInput() {
  const inputs = document.querySelectorAll("input")
  const ans = [];
  for (let i = 0; i < inputs.length; i += 1) {
    if (inputs[i].value === '') {
      return;
    }
    ans.push(inputs[i].value);
  }

  sendAns(ans)
}
