const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get('team');

const getTeamData = () => {
  return new Promise((rs, rj) => {
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };

    fetch(`/api/backstage/team?team=${myParam}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        const { data } = result;
        rs(data)
      })
      .catch((error) => {
        console.error(error)
        rj(error)
      });
  })
}

const fillTeamName = (code, name) => {
  const teamNameElement = document.getElementById("team-name");
  teamNameElement.innerHTML = `${code} ${name}`;
}

const fillMembers = (data) => {
  const keyName = {
    "member_1": "隊員一",
    "member_2": "隊員二",
    "member_3": "隊員三",
    "name": "姓名",
    "id": "學號",
    "email": "Email",
    "email_verify": "Email 驗證",
  }
  const membersElement = document.getElementById("members");
  let html = "";
  // 放入全部隊員的資料
  for (const key in data) {
    if(key === "member_2" || key === "member_3") {
      const name = data[key]["name"];
      const id = data[key]["id"];
      const email = data[key]["email"];
      if(!(name || id || email)) {
        continue;
      }
    }
    const element = data[key];
    html += `<div class="row m-auto mb-5">`;
    html += `<div class="col-2 p-0 d-flex align-items-center justify-content-center">${keyName[key]}</div>`;
    html += `<div class="col-10 p-0">`
    // 放入單一隊員的資料
    for (const subkey in element) {
      if (subkey === "_id") {
        continue
      }
      html += `<div class="row m-auto border-bottom">`;
      html += `<div class="col-3 d-flex align-items-center justify-content-center">${keyName[subkey]}</div>`;
      html += `<div class="col-9 d-flex align-items-center justify-content-center text-break">${element[subkey]}</div>`;
      html += `</div>`;
    }
    html += `</div>`
    html += `</div>`
  }

  membersElement.innerHTML = html;
}

const fillProgress = (data) => {
  const progressElement = document.getElementById("progress");
  let html = "";
  for (let i = data.length - 1; i >= 0; i -= 1) {
    html += `<div class="row m-auto mb-5 border-bottom">`;
    html += `<div class="col-lg-4 col-12  d-flex align-items-center justify-content-center">第 ${data[i]["level"]} 關</div>`;
    html += `<div class="col-lg-8 col-12">`
    html += `<div class="row">`;
    html += `<div class="col-12">開始時間</div>`;
    html += `<div class="col-12">${data[i]["timestamp"]}</div>`;
    html += `</div>`;
    html += `</div>`;
    html += `</div>`;
  }
  progressElement.innerHTML = html;

}

const fillData = (data) => {
  fillTeamName(data["code"], data["name"]);
  fillMembers(data["members"]);
  fillProgress(data["game_progress"]);
}


const init = async () => {
  try {
    const teamData = await getTeamData();
    fillData(teamData)
  } catch (error) {
    console.error(error);
  }
}

init();
