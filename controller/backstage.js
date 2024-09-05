const { findAdmin } = require('../service/database/backstage')

const login = async (req, res) => {
  try {
    const formData = req.body;
    if(!(formData["username"] && formData["password"])) {
      res.redirect('/backstage/login');
      return;
    }
    // 撈資料
    const admin = await findAdmin({
      username: formData['username'],
      password: formData['password'],
    });

    if(admin.length === 0) {
      res.redirect('/backstage/login');
      return;
    }
    res.redirect('/backstage')
  } catch (error) {
    res.redirect('/backstage/login');
  }
}

module.exports = {
  login
}