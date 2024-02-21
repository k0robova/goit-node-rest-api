import dotenv from "dotenv";
dotenv.config();
import sendgrid from "@sendgrid/mail";

const { SENDGRID_API_KEY } = process.env;

sendgrid.setApiKey(SENDGRID_API_KEY);

export const sendEmail = async (data) => {
  const email = { ...data, from: "dimatester34@gmail.com" };
  await sendgrid.send(email);
  return true;
};
