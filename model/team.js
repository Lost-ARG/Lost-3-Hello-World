const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameProgressSchema = new Schema({
  level: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now }
});

// 定義成員 Schema
const memberSchema = new Schema({
  name: { type: String, required: true },
  id: { type: String, required: true },
  email: { type: String, required: true },
  email_verify: { type: Boolean, default: false }
});

// 定義團隊 Schema
const teamSchema = new Schema({
  code: { type: String, default: undefined },
  name: { type: String, required: true },
  password: { type: String, required: true }, // 注意：實際應用中應考慮使用加密處理密碼
  game_progress: [gameProgressSchema],
  members: {
    member_1: { type: memberSchema, default: {} },
    member_2: { type: memberSchema, default: {} },
    member_3: { type: memberSchema, default: {} }
  },
  paid: { type: Boolean, default: false }
});

// 使用 "pre" middleware，在保存之前生成流水號
teamSchema.pre('save', async function (next) {
  const doc = this;

  // 查找最新一條紀錄，依照 serialNumber 降序排序
  const lastDoc = await mongoose.model('Team').findOne().sort({ code: -1 });

  let newSerialNumber;

  if (lastDoc) {
    // 提取當前最大的數字部分加 1
    const lastNumber = parseInt(lastDoc.code.slice(1)); // 提取數字部分
    const nextNumber = lastNumber + 1;

    // 生成流水號
    newSerialNumber = `T${nextNumber.toString().padStart(3, '0')}`;
  } else {
    // 初始值 is T001
    newSerialNumber = 'T001';
  }

  doc.code = newSerialNumber;

  next();
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
