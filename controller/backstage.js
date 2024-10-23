const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const { findAdmin } = require('../service/database/adminService');
const { findTeam, updateTeam } = require('../service/database/teamService');
const { creatRFID, findRFID } = require('../service/database/RFIDService');


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
    req.session.admin = formData["username"];
    res.redirect('/backstage')
  } catch (error) {
    res.redirect('/backstage/login');
  }
}

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
  })
  res.redirect('/backstage/login');
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
    const { uid, type } = req.body;
    await creatRFID({ uid, type })
    res.send({ status: 200 })
  } catch (error) {
    console.error(error);
    res.send({ status: 500 });
  }
}

const RFIDList = async (req, res) => {
  try {
    const cards = await findRFID();
    res.send({ status: 200, cards });
  } catch (error) {
    console.error(error);
    res.send({ status: 500 });
  }
}

const paymentSearch = async (req, res) => {
  try {
    const { searchKey } = req.query;
    const dbQuery = searchKey !== undefined ? {
      $or: [
        { code: new RegExp(`.*${searchKey}.*`) },
        { name: new RegExp(`.*${searchKey}.*`) }
      ]
    } : {}

    const teams = await findTeam(
      dbQuery,
      { code: 1, name: 1, paid: 1, _id: 1 }
    );

    res.send({ status: 200, data: teams })
  } catch (error) {
    res.send({ status: 500 })
    console.error(error);
  }
}

const changePaidStat = async (req, res) => {
  try {
    const { id, paidStat } = req.body;
    await updateTeam({ _id: id }, { paid: !paidStat });

    res.send({ status: 200 })
  } catch (error) {
    res.send({ status: 500 });
    console.error(error);
  }
}

const searchTeamByPaid = async (req, res) => {
  try {
    const { paid } = req.query;

    const teams = await findTeam({ paid: paid === "true" });
    res.send({ status: 200, data: teams })
  } catch (error) {
    console.error(error);
    res.send({ status: 500 })
  }
}

module.exports = {
  login,
  logout,
  teamList,
  team,
  registerRFID,
  RFIDList,
  paymentSearch,
  changePaidStat,
  searchTeamByPaid,
}