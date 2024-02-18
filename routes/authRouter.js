import express from "express";
import {
  authenticate,
  checkLodinData,
  checkRegisterData,
  updateSucSchemaMid,
} from "../midldlewars/authMiddlewars.js";
import {
  current,
  login,
  logout,
  register,
  updateAvatar,
  updateSubscription,
} from "../controllers/authControllers.js";
import { upload } from "../midldlewars/uploadAvatar.js";

const usersRouter = express.Router();

usersRouter.post("/register", checkRegisterData, register);
usersRouter.post("/login", checkLodinData, login);
usersRouter.post("/logout", authenticate, logout);

usersRouter.get("/current", authenticate, current);
usersRouter.patch(
  "/subscription",
  authenticate,
  updateSucSchemaMid,
  updateSubscription
);

usersRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  updateAvatar
);

export default usersRouter;
