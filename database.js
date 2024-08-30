const mongoose = require('mongoose');
const config = require('./config/database');

const connectDB = async () => {
  try {
    await mongoose.connect(config.url, {});
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

// 監聽 Mongoose 錯誤事件
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// 監聽 Mongoose 斷線事件
mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});

// 監聽 Mongoose 重新連線後事件
mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected');
});

module.exports = connectDB;
