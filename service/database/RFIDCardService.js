const RFIDCard = require('../../model/RFIDCard');

const creatRFIDCard = async (data) => {
  try {
    const card = new RFIDCard(data);
    await card.save();
  } catch (error) {
    throw new Error(`Create RFIDCard Failed, Error: ${error.toString()}`)
  }
}

const findRFIDCard = async (condition = {}) => {
  try {
    const card = await RFIDCard.find(condition);
    return card;
  } catch (error) {
    throw new Error(`Find RFIDCard Failed, Error: ${error.toString()}`)
  }
}


module.exports = {
  creatRFIDCard,
  findRFIDCard,
}
