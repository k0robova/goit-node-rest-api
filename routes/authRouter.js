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
  updateSubscription,
} from "../controllers/authControllers.js";

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
export default usersRouter;
