import express from "express";
import {
  authenticate,
  checkLodinData,
  checkRegisterData,
} from "../midldlewars/authMiddlewars.js";
import {
  current,
  login,
  logout,
  register,
} from "../controllers/authControllers.js";

const usersRouter = express.Router();

usersRouter.post("/register", checkRegisterData, register);
usersRouter.post("/login", checkLodinData, login);
usersRouter.post("/logout", authenticate, logout);

usersRouter.get("/current", authenticate, current);
export default usersRouter;

// localhost:3000/api/users/register
