import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { catchAsync } from "../helpers/catchAsync.js";
import {
  loginUserSchema,
  registerUserSchema,
} from "../schemas/contactsSchemas.js";
import HttpError from "../helpers/HttpError.js";
import { User } from "../models/userModel.js";

dotenv.config({
  path: "./envs/development.env",
});

const SECRET_KEY = process.env.JWT_SECRET;

export const checkRegisterData = catchAsync(async (req, res, next) => {
  const { value, error } = registerUserSchema(req.body);

  if (error)
    return res.status(400).json({
      message: error.message,
    });

  const userExists = await User.exists({ email: value.email });

  if (userExists) throw HttpError(409, "User with this email already exists");

  req.body = value;

  next();
});

export const checkLodinData = catchAsync(async (req, res, next) => {
  const { value, error } = loginUserSchema(req.body);

  //   if (error)
  //     return res.status(400).json({
  //       message: error.message,
  //     });
  if (error) throw HttpError(401, "Not autorized. Email or password is wrong");

  req.body = value;

  next();
});

export const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    // next(HttpError(401, "You don't have a world BEARER"));
    next(HttpError(401, "Not authorized"));
  }

  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);
    if (!user || !user.token || user.token !== token) {
      // next(HttpError(401, "User not exist in DB"));
      next(HttpError(401, "Not authorized"));
    }
    req.user = user;
    next();
  } catch {
    // next(HttpError(401, "Your token is not valid!!!"));
    next(HttpError(401, "Not authorized"));
  }
};
