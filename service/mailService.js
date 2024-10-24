const ejs = require('ejs');
const path = require('path');
const nodemailer = require('nodemailer');
const smtpConfig = require('../config/email');

const sleep = ms => new Promise(rs => setTimeout(rs, ms))

const retry = 5;
const retryDelay = 500;
const transporter = nodemailer.createTransport(smtpConfig);

const sendMail = (mailOptions) => {
  return new Promise((rs, rj) => {
    transporter.sendMail(mailOptions, (error, response) => {
      if (error) {
        console.error(error);
        rj();
      } else {
        rs();
      }
    });
  })
}

const mailSender = async (toMail, subject, template, templateData) => {
  try {
    const html = await ejs.renderFile(
      path.join(__dirname, '../views/templates/email', `${template}.ejs`),
      templateData
    );
    let mailOptions = {
      from: `Lost 3 Team <${smtpConfig.auth.user}>`,
      to: toMail,
      subject,
      html,
    };

    const result = {};
    result["error"] = false;
    for (let i = 0; i < retry; i += 1) {
      try {
        await sendMail(mailOptions);
        break;
      } catch (error) {
        result["error"] = true;
      }
      await sleep(retryDelay);
    }
    result["message"] = result["error"] ? `Message sent to ${toMail} failed` : `Message sent to ${toMail} success`;
    return result
  } catch (error) {
    console.error(error);
  }
}

const sendTeamMail = async (teamEmails, subject, mailType, templateData) => {
  for (let i = 0; i < teamEmails.length; i += 1) {
    const result = await mailSender(teamEmails[i], subject, mailType, templateData[i]);
    console.log(result["message"]);
  }
}

module.exports = {
  mailSender,
  sendTeamMail
}
