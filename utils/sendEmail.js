const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

module.exports = async (to, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: "TaskManager <nehabarbro@gmail.com>",
      to,
      subject,
      text
    });
    console.log("Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Detailed email error:", error);
    throw error;
  }
};