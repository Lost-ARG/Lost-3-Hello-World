const main = document.getElementById('main');
const signForm = document.getElementById('signUp');
let powerSwitched = false;

// Get the modal element 
const myModal = new bootstrap.Modal(document.getElementById('signUp-result'));

const renderBGBlock = () => {
  let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
  let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

  const sideLength = (vw / 100) * 6.25 - 2;
  const rowCount = Math.ceil(vw / sideLength);
  const colCount = Math.ceil(vh / sideLength);
  const total = rowCount * colCount;

  for (let i = 0; i < total; i += 1) {
    main.insertBefore(document.createElement('span'), signForm)
  }
}

// 發送註冊表單
const submitForm = () => {

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
  const regexp = {
    // Ex: 1(04213083) 必須為 1 開頭且有後八碼數字
    idCheck: new RegExp(/^1\d{8}$/),
    // 中英文可含空白、-, 並且至少要2位元
    nameCheck: new RegExp(/^[-a-zA-Z_\s\u4e00-\u9fa5]{2,}$/),
    emailCheck: new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
    // 密碼最少四個字且要有一碼為英文
    passwordCheck : new RegExp(/^(?=.*[a-zA-Z])[0-9a-zA-Z]{4,}$/)
  }

  const dataEnum = {
    team: {
      name: "隊伍名稱",
      password: "隊伍密碼",
    },
    member_1: {
      name: "成員一姓名",
      id: "成員一學號",
      email: "成員一 Email"
    },
    member_2: {
      name: "成員二姓名",
      id: "成員二學號",
      email: "成員二 Email"
    },
    member_3: {
      name: "成員三姓名",
      id: "成員三學號",
      email: "成員三 Email"
    }
  }

  const form = document.getElementById('form');
  const raw = new FormData(form);

  // 沒有填寫的欄位
  const invalid = [];
  // 製作成需要的格式
  const data = {
    team: {
      name: "",
      password: ""
    },
    member_1: {
      name: "",
      id: "",
      email: ""
    },
    member_2: {
      name: "",
      id: "",
      email: ""
    },
    member_3: {
      name: "",
      id: "",
      email: ""
    }
  }

  for (const key in data) {
    for (let subKey in data[key]) {
      const val = raw.get(`${key}_${subKey}`);
      if (val === null || !(regexp[`${subKey}Check`].test(val))) {
        invalid.push("無效的" + dataEnum[key][subKey]);
      } else {
        data[key][subKey] = val;
      }
    }
  }

  if (invalid.length !== 0) {
    document.getElementById("modal-body").innerHTML = invalid.join('<br>');
    document.getElementById("modal-body").classList.add('text-danger')
    myModal.show()
    return
  }

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(data),
    redirect: "follow"
  };

  fetch("/api/signUp", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      let html;
      if(result['status'] === 200) {
        form.reset()
      } else {
        html = '報名失敗<br>';
      }
      html += result['message']
      document.getElementById("modal-body").innerHTML = html;
      document.getElementById("modal-body").classList.remove('text-danger')
      document.getElementById("modal-body").classList.add('text-center')

      myModal.show()
    })
    .catch((error) => console.error(error));
}

const init = () => {
  window.addEventListener('resize', () => {
    renderBGBlock()
  });

  renderBGBlock()

  document.getElementById('submit').addEventListener('click', submitForm);
}

init()

const powerSwitch = () => {
  const powerBtn = document.querySelector(".power-btn");
  const fieldset = document.querySelector("#fieldset");
  powerBtn.classList.toggle("not-clicked");
  if(!powerSwitched) {
    main.style.setProperty("--main-background", "linear-gradient(#000000, #FF44FF, #30ffff)");
    main.style.setProperty("--main-animation", "animate 5s linear infinite");
    signForm.style.boxShadow = "-45px -45px 35px #30ffff, 45px 45px 35px #FF44FF";
    signForm.style.animation = "shadow 20s linear infinite";
    const disabledElements = document.querySelectorAll(".disabled");
    disabledElements.forEach(element => {
      element.classList.replace("disabled", "powered")
    })
    fieldset.disabled = false;
  } else {
    main.style.setProperty("--main-background", "none")
    main.style.setProperty("--main-animation", "none")
    signForm.style.boxShadow = "none";
    signForm.style.animation = "none";
    const poweredElements = document.querySelectorAll(".powered");
    poweredElements.forEach(element => {
      element.classList.replace("powered", "disabled")
    })
    fieldset.disabled = true;
  }
  powerSwitched = !powerSwitched;
}
