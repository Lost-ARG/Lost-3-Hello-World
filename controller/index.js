const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const { findNotice } = require('../service/database/noticeService');

const noticeList = async (req, res) => {
  try {
    const raw = await findNotice({ isVisible: true });
    const notices = [];
    for (let i = 0; i < raw.length; i += 1) {
      notices.push(raw[i].toObject());
      notices[i]["createdAt"] = dayjs(notices[i]["createdAt"]).utc("Z").format('YYYY-MM-DD HH:mm');
      notices[i]["updatedAt"] = dayjs(notices[i]["updatedAt"]).utc("Z").format('YYYY-MM-DD HH:mm');
    }
    res.send({ status: 200, notices });
  } catch (error) {
    console.error(error);
    res.send({ status: 500 });
  }
}

const notice = async (req, res) => {
  try {
    const { _id } = req.query;

    const notice = (await findNotice({ _id }))[0].toObject();
    notice["createdAt"] = dayjs(notice["createdAt"]).utc("Z").format('YYYY-MM-DD HH:mm');
    notice["updatedAt"] = dayjs(notice["updatedAt"]).utc("Z").format('YYYY-MM-DD HH:mm');
    res.send({ status: 200, data: notice })
  } catch (error) {
    res.send({ status: 500 })
    console.error(error);
  }
}


module.exports = {
  noticeList,
  notice,
}