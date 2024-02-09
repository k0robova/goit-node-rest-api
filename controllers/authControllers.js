import { catchAsync } from "../helpers/catchAsync.js";
import {
  loginUserDB,
  logoutUserDB,
  registerUserDB,
} from "../services/userService.js";

export const register = catchAsync(async (req, res) => {
  const user = await registerUserDB(req.body);
  res.status(201).json(user);
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
