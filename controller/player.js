const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const { findTeam } = require('../service/database/teamService');


const login = async (req, res) => {
  try {
    const formData = req.body;
    if (!(formData["teamcode"] && formData["password"])) {
      res.redirect('/player/login');
      return;
    }
    // 撈資料
    const team = await findTeam({
      code: formData['teamcode'],
      password: formData['password'],
    });

    if (team.length === 0) {
      res.redirect('/player/login');
      return;
    }
    req.session.team = formData['teamcode']
    res.redirect(`/player?team=${formData["teamcode"]}`)
  } catch (error) {
    res.redirect('/player/login');
  }
}

const team = async (req, res) => {
  try {
    const teamCode = req.query["team"];

    const team = (await findTeam({ code: teamCode }))[0].toObject();
    for (let i = 0; i < team["game_progress"].length; i += 1) {
      const time = team["game_progress"][i]["timestamp"];
      team["game_progress"][i]["timestamp"] = dayjs(time).utc("Z").tz("Asia/Taipei").format('YYYY-MM-DD HH:mm:ss');
    }
    res.send({ status: 200, data: team })
  } catch (error) {
    res.send({ status: 500 })
    console.error(error);
  }
}

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
  })
  res.redirect("/player/login")
}

module.exports = {
  login,
  team,
  logout,
}