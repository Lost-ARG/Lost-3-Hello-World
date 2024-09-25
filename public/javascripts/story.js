const myModal = new bootstrap.Modal(document.getElementById('player-input'));
const coverFront = document.querySelector('.cover-front');
let inputed = false;
// check if player clicked "No" when asked
let rechoice = false;


const sleep = (ms) => new Promise(rs => setTimeout(rs, ms))

const closeBook = async () => {
  const pages = document.querySelectorAll(".page");
  for (let i = pages.length - 1; i > -1; i -= 1) {
    pages[i].click();
    await sleep(100);
  }
  coverFront.click();
  inputed = false;
  myModal.show();
}

const parentChangeRoute = () => {
  closeBook()
}

const changeRoute = (isRechoice) => {
  rechoice = isRechoice;
  closeBook()
}

const generatePages = (story) => {
  const pagesElement = document.querySelector('.pages');

  let html = "";
  // 先放一頁章節標題
  html += `<div class="page d-flex flex-column align-items-center justify-content-center">`;
  html += `<p class="paragraph">${story["name"]}</p>`
  html += `</div>`;
  // 放故事內容
  for (let i = 0; i < story["story"].length; i += 1) {
    const paragraph = story["story"][i];
    html += `<div class="page">`;
    html += `<p class="paragraph">${paragraph}</p>`
    html += `</div>`;
  }
  // 如果有結局就放入結局
  if (story["ending"]) {
    const ending = story["ending"].split(" - ")
    html += `<div class="page d-flex flex-column align-items-center justify-content-center">`;
    html += `<p class="d-block paragraph">${ending[0]}</p>`
    html += `<p class="d-block paragraph ending">${ending[1]}</p>`
    html += `</div>`;
  }
  // 放入 Next
  if (story["divergent"]) {
    if (story['next'].length > 1) {
      html += `<h1><p class="next-lv">${story['next'][rechoice ? 1 : 0]}</p></h1>`
      html += `<h1><a class="next-lv" href="#" onclick="parentChangeRoute()">${story['nextName'][rechoice ? 1 : 0]}</a></h1>`
    } else {
      html += `<h3><p class="next-lv ms-3">如果 <span class="emphasis">重來一次</span>，你是否會做出同樣的選擇?</p></h3>`
      html += `<h1><a class="next-lv" href="#" onclick="changeRoute(${false})">Yes</a></h1>`
      html += `<h1><a class="next-lv" href="#" onclick="changeRoute(${true})">No</a></h1>`
    }
  } else {
    html += `<h1><a class="next-lv" href="${story['next']}">Next</a></h1>`
  }
  pagesElement.innerHTML = html;

  const pages = document.querySelectorAll('.page');

  // 動態調整頁面的 z-index
  let zIndex = pages.length;

  pages.forEach((page, index) => {
    page.style.zIndex = zIndex--;
    page.addEventListener('click', function () {
      page.classList.toggle('flipped');
      setTimeout(() => {
        page.style.zIndex = pages.length - page.style.zIndex;
      }, 200)
    });
  });
}

const getStory = (storyCode) => {
  return new Promise((rs, rj) => {
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };

    fetch(`/api/story?storyCode=${storyCode}`, requestOptions)
      .then((response) => response.json())
      .then((result) => rs(result))
      .catch((error) => rj(error));
  })
}

const updateTeamProgress = (teamCode, storyCode) => {
  return new Promise((rs, rj) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "teamCode": teamCode,
      "storyCode": storyCode
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch("/api/team/updateProgress", requestOptions)
      .then((response) => response.json())
      .then((result) =>{
        console.log(result);
        
        rs(result)}
      )
      .catch((error) => rj(error));
  })
}

const renderPages = async (teamCode, storyCode) => {
  try {
    const result = await updateTeamProgress(teamCode, storyCode);
    if (result["status"] !== 200) {
      // 顯示輸入錯誤
      document.getElementById("error-msg").innerHTML = 
      `<span class="error">${result["result"].toString()}</span>`;
      return;
    }
    const story = await getStory(storyCode);
    inputed = true;
    myModal.hide();
    document.getElementById("story-code").value = "";
    generatePages(story);
  } catch (error) {
    console.error(error);
  }
}

const readInput = () => {
  const teamCode = document.getElementById("team-code").value;
  const storyCode = document.getElementById("story-code").value;
  renderPages(teamCode, storyCode);
}

const bindCoverFrontEvent = () => {
  coverFront.addEventListener('click', function (e) {
    if (!inputed) {
      myModal.show();
      return;
    }
    // 避免有內頁翻開，但卻可以闔上封面
    const flipped = document.querySelectorAll('.flipped');
    if (flipped.length > 0) {
      return
    }
    const toggled = document.querySelector('.notebook').classList.toggle('open');
    if (toggled) {
      setTimeout(() => {
        coverFront.classList.add('open-z');
      }, 200);
    } else {
      setTimeout(() => {
        coverFront.classList.remove('open-z');
      }, 100);
    }
  });
}

const init = () => {
  bindCoverFrontEvent()
}

init();
