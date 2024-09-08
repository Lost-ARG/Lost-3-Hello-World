const { findAdmin } = require('../service/database/backstage');
const { findTeam } = require('../service/database/teamService');

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

module.exports = {
  login,
  teamList
}