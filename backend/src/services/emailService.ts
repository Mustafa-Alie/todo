import nodemailer from "nodemailer";

import "dotenv/config";

const smtpOptions: any = {
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
};

// helper function to send emails
export const sendEmail = async (to: string, subject: string, html: string) => {
  const info = await transporter.sendMail({
    from: `"TODO" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
  return info;
};

export const transporter = nodemailer.createTransport(smtpOptions);
