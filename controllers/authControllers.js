import { catchAsync } from "../helpers/catchAsync.js";
import { User } from "../models/userModel.js";
import {
  loginUserDB,
  logoutUserDB,
  registerUserDB,
  updateSubscriptionDB,
} from "../services/userService.js";

export const register = catchAsync(async (req, res) => {
  const newUser = await registerUserDB(req.body);
  console.log(newUser);
  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
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
