const RFID = require('../../model/RFID');

const creatRFID = async (data) => {
  try {
    const rfid = new RFID(data);
    await rfid.save();
  } catch (error) {
    throw new Error(`Create RFID Failed, Error: ${error.toString()}`)
  }
}

const findRFID = async (condition = {}) => {
  try {
    const rfid = await RFID.find(condition);
    return rfid;
  } catch (error) {
    throw new Error(`Find RFID Failed, Error: ${error.toString()}`)
  }
}


module.exports = {
  creatRFID,
  findRFID,
}
