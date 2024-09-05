const Admin = require('../../model/admin');

const creatAdmin = async (data) => {
  try {
    const admin = new Admin(data);
    await admin.save();
  } catch (error) {
    throw new Error(`Create Admin Failed, Error: ${error.toString()}`)
  }
}

const findAdmin = async (condition = {}) => {
  try {
    const admin = await Admin.find(condition);
    return admin;
  } catch (error) {
    throw new Error(`Find Admin Failed, Error: ${error.toString()}`)
  }
}


module.exports = {
  creatAdmin,
  findAdmin,
}
