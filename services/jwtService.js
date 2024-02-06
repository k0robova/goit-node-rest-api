import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import HttpError from "../helpers/HttpError.js";

dotenv.config({
  path: "./envs/development.env",
});

export const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// ! TODO - дописати мідлаварку
export const checkToken = (token) => {
  if (!token) throw HttpError(401, "Not authorized. Not loged in");

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);

    return id;
  } catch (error) {
    throw HttpError(401, "Not authorized. Not loged in");
  }
};
