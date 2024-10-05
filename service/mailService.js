const ejs = require('ejs');
const path = require('path');
const nodemailer = require('nodemailer');
const smtpConfig = require('../config/email');

const transporter = nodemailer.createTransport(smtpConfig);

const mailSender = async (toMail, subject, template, templateData) => {

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

  transporter.sendMail(mailOptions, (error, response) => {
    if (error) {
      console.log(error);
      return false;
    } else {
      console.log("Message sent to " + toMail + " success");
    }
  });

  return true;
}

const sendTeamMail = (teamEmails, subject, mailType, templateData) => {
  for(let i = 0; i < teamEmails.length; i += 1) {
    mailSender(teamEmails[i], subject, mailType, templateData[i]);
  }
}

module.exports = {
  mailSender,
  sendTeamMail
}
