const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 定義成員 Schema
const adminSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, default: true }
});


const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
