const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RFIDSchema = new Schema({
  uid: { type: String, required: true },
  type: { type: String, required: true }
});


const RFID = mongoose.model('RFID', RFIDSchema);

module.exports = RFID;
