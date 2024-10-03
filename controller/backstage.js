const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const { findAdmin } = require('../service/database/adminService');
const { findTeam } = require('../service/database/teamService');
const { creatRFIDCard, findRFIDCard } = require('../service/database/RFIDCardService');


const login = async (req, res) => {
  try {
    const formData = req.body;
    if (!(formData["username"] && formData["password"])) {
      res.redirect('/backstage/login');
      return;
    }
    // 撈資料
    const admin = await findAdmin({
      username: formData['username'],
      password: formData['password'],
    });

    if (admin.length === 0) {
      res.redirect('/backstage/login');
      return;
    }
    res.redirect('/backstage')
  } catch (error) {
    res.redirect('/backstage/login');
  }
}

const teamList = async (req, res) => {
  try {
    const teams = await findTeam();
    res.send({ status: 200, data: teams })
  } catch (error) {
    res.send({ status: 500 })
    console.error(error);
  }
}

const team = async (req, res) => {
  try {
    const { team } = req.query;

    const teams = await findTeam({ name: team });
    for (let i = 0; i < teams[0]["game_progress"].length; i += 1) {
      const time = teams[0]["game_progress"][i]["timestamp"];
      teams[0]["game_progress"][i]["timestamp"] = dayjs(time).utc("Z").tz("Asia/Taipei").format();
    }
    res.send({ status: 200, data: teams[0] })
  } catch (error) {
    res.send({ status: 500 })
    console.error(error);
  }
}

const registerRFID = async (req, res) => {
  try {
    const formData = req.body;
    await creatRFIDCard({
      card_id: formData["card_id"],
      type: formData["type"]
    })
    res.send({ status: 200 })
  } catch (error) {
    console.error(error);
    res.send({ status: 500 });
  }
}

const RFIDList = async (req, res) => {
  try {
    const cards = await findRFIDCard();
    res.send({ status: 200, cards });
  } catch (error) {
    console.error(error);
    res.send({ status: 500 });
  }
}

module.exports = {
  login,
  teamList,
  team,
  registerRFID,
  RFIDList
}