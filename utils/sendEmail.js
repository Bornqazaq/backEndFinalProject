const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

module.exports = async (to, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: `TaskManager <${process.env.SMTP_USER}>`,
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