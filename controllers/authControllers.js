import { catchAsync } from "../helpers/catchAsync.js";
import {
  loginUserDB,
  logoutUserDB,
  registerUserDB,
} from "../services/userService.js";

export const register = catchAsync(async (req, res) => {
  const { user, token } = await registerUserDB(req.body);
  res.status(201).json({ user, token });
});

export const login = catchAsync(async (req, res) => {
  const { user, token } = await loginUserDB(req.body);
  // const { user, token } = await loginUserDB(
  //   req.body,
  //   "-createdAt -updatedAt - token -_id -token"
  // );
  res.status(200).json({ user, token });
});

export const logout = async (req, res) => {
  const { _id } = req.user;
  const user = logoutUserDB(_id, { token: "" });

  res.json({
    message: "Logout success!",
  });
};

export const current = catchAsync(async (req, res) => {
  const { email, subscription } = req.user;

  res.json({ email, subscription });
});
