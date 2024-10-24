const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 定義 scheduleJob 的 Schema
const scheduleJobSchema = new Schema({
  uuid: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true
  },
  execute_time: {
    type: Date,
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed, // data 可以是任何類型
    required: true
  },
  result: {
    type: String,
  },
  deleted_at: {
    type: Date,
    default: null
  }
});

const scheduleJob = mongoose.model('ScheduleJob', scheduleJobSchema);

// 匯出模型
module.exports = scheduleJob;
