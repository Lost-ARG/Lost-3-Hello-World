const ScheduleJob = require('../../model/scheduleJob');

// 創建 ScheduleJob
const createScheduleJob = async (data) => {
  try {
    const scheduleJob = new ScheduleJob(data);
    await scheduleJob.save();
  } catch (error) {
    throw new Error(`Create ScheduleJob Failed, Error: ${error.toString()}`);
  }
};

// 獲取 ScheduleJob
const getScheduleJob = async (condition = {}) => {
  try {
    const scheduleJob = await ScheduleJob.find(condition);
    return scheduleJob;
  } catch (error) {
    throw new Error(`Find ScheduleJob Failed, Error: ${error.toString()}`);
  }
};

// 更新 ScheduleJob
const updateScheduleJob = async (condition = {}, updateData = {}) => {
  try {
    const updatedScheduleJob = await ScheduleJob.findOneAndUpdate(condition, updateData, { new: true });
    if (!updatedScheduleJob) {
      throw new Error('No ScheduleJob found to update');
    }
    return updatedScheduleJob;
  } catch (error) {
    throw new Error(`Update ScheduleJob Failed, Error: ${error.toString()}`);
  }
};

// 刪除 ScheduleJob
const deleteScheduleJob = async (condition = {}) => {
  try {
    const deletedScheduleJob = await ScheduleJob.findOneAndDelete(condition);
    if (!deletedScheduleJob) {
      throw new Error('No ScheduleJob found to delete');
    }
    return deletedScheduleJob;
  } catch (error) {
    throw new Error(`Delete ScheduleJob Failed, Error: ${error.toString()}`);
  }
};

module.exports = {
  createScheduleJob,
  getScheduleJob,
  updateScheduleJob,
  deleteScheduleJob,
};
