const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 定義成員 Schema
const memberSchema = new Schema({
  name: { type: String, required: true },
  id: { type: String, required: true },
  email: { type: String, required: true },
  email_verify: { type: Boolean, default: false }
});

// 定義團隊 Schema
const teamSchema = new Schema({
  name: { type: String, required: true },
  password: { type: String, required: true }, // 注意：實際應用中應考慮使用加密處理密碼
  game_progress: { type: Number, default: 0 },
  members: {
    member_1: { type: memberSchema, default: {} },
    member_2: { type: memberSchema, default: {} },
    member_3: { type: memberSchema, default: {} }
  }
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
