const Notice = require('../../model/Notice');

const creatNotice = async (data) => {
  try {
    const notice = new Notice(data);
    await notice.save();
  } catch (error) {
    throw new Error(`Create Notice Failed, Error: ${error.toString()}`)
  }
}

const findNotice = async (condition = {}) => {
  try {
    const notices = await Notice.find(condition).sort({ updatedAt: -1 });
    return notices;
  } catch (error) {
    throw new Error(`Find Notice Failed, Error: ${error.toString()}`)
  }
}

const updateNotice = async (condition = {}, updateData = {}) => {
  try {
    const updatedNotice = await Notice.findOneAndUpdate(condition, updateData, { new: true });
    if (!updatedNotice) {
      throw new Error('No Notice found to update');
    }
    return updatedNotice;
  } catch (error) {
    throw new Error(`Update Notice Failed, Error: ${error.toString()}`);
  }
};

module.exports = {
  creatNotice,
  findNotice,
  updateNotice
}
