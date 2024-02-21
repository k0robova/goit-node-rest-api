import dotenv from "dotenv";
dotenv.config();
import fs from "fs/promises";
import path from "path";
import Jimp from "jimp";

import { catchAsync } from "../helpers/catchAsync.js";
import { User } from "../models/userModel.js";
import {
  loginUserDB,
  logoutUserDB,
  registerUserDB,
  updateSubscriptionDB,
} from "../services/userService.js";
import HttpError from "../helpers/HttpError.js";
import { sendEmail } from "../helpers/sendEmail.js";

const { SECRET_KEY, BASE_URL } = process.env;

const avatarsDir = path.resolve("public", "avatars");

export const register = catchAsync(async (req, res) => {
  const user = await registerUserDB(req.body);
  res.status(201).json({
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
});

export const verifyEmail = catchAsync(async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  res.json({ message: "Verification successful" });
});

export const resendVerifyEmail = catchAsync(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) throw HttpError(401, "Email not found");

  if (user.verify) throw HttpError(400, "Verification has already been passed");

  const verifyEmail = {
    to: email,
    subject: "Verify your email",
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">Click here to verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.json({ message: "Verification email sent" });
});

export const login = catchAsync(async (req, res) => {
  const { user, token } = await loginUserDB(req.body);
  res.status(200).json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
});

export const logout = async (req, res) => {
  const { _id } = req.user;
  const user = logoutUserDB(_id, { token: "" });
  res.status(204).json({});
};

export const current = catchAsync(async (req, res) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
});

export const updateSubscription = catchAsync(async (req, res) => {
  const { _id: idOwner } = req.user;
  const { subscription } = req.body;

  const updatedUserSub = await updateSubscriptionDB(idOwner, subscription);

  res.status(200).json(updatedUserSub);
});

export const updateAvatar = catchAsync(async (req, res) => {
  const { _id } = req.user;

  if (!req.file) {
    throw HttpError(400, "Avatar is required");
  }
  const { path: tempUpload, originalname } = req.file;

  const fileName = `${_id}_${originalname}`;
  const resultUpload = path.resolve(avatarsDir, fileName);

  const image = await Jimp.read(tempUpload);
  image.resize(250, 250).write(tempUpload);
  await fs.rename(tempUpload, resultUpload);

  const avatarURL = path.join("avatars", fileName);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({
    avatarURL,
  });
});
