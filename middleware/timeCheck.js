const dayjs = require('dayjs');
require('dotenv/config');

const isActTime = (now) => {
  const startTime = dayjs(process.env.ACT_BEGIN_TIME, 'YYYY-MM-DD HH:mm');
  const endTime = dayjs(process.env.ACT_END_TIME, 'YYYY-MM-DD HH:mm');

  if (!startTime.isValid() || !endTime.isValid()) {
    console.error('Invalid start or end time. Check environment variables.');
    return false;
  }

  const isInDate = (now.isSame(startTime) || now.isAfter(startTime)) && now.isBefore(endTime);

  return isInDate;
};


const actTimeCheck = (req, res, next) => {
  const now = dayjs();

  if (!isActTime(now)) {
    res.redirect("/");
    return;
  }
  next();
}

module.exports = {
  actTimeCheck,
}
