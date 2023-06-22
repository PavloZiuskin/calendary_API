const sgMail = require("@sendgrid/mail");
const { SENDGRID_API_KEY, SENDGRID_MAIL_FROM } = process.env;
sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (data) => {
  try {
    const msg = {
      to: data.email,
      from: SENDGRID_MAIL_FROM,
      subject: data.subject,
      html: data.html,
    };
    await sgMail.send(msg);
  } catch (error) {
    console.error(error);
    if (error.response) {
      console.error(error.response.body);
    }
  }
};

module.exports = sendEmail;
