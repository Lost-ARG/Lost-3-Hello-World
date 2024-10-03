const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RFIDCardSchema = new Schema({
  card_id: { type: String, required: true },
  type: { type: String, required: true }
});


const RFIDCard = mongoose.model('RFIDCard', RFIDCardSchema);

module.exports = RFIDCard;
