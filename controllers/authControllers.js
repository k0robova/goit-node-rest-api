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

const avatarsDir = path.resolve("public", "avatars");

export const register = catchAsync(async (req, res) => {
  const user = await registerUserDB(req.body);
  console.log(user);
  res.status(201).json({
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
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
  if (!id) {
    throw HttpError(401, "Not authorized");
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
