import express from "express";
import {
  postRegister,
  patchLogin,
  patchLogout,
  getMe,
} from "../controllers/UserController";

const userRouter = express.Router();

userRouter.get("/me", getMe);
userRouter.post("/register", postRegister);
userRouter.patch("/login", patchLogin);
userRouter.patch("/logout", patchLogout);

export default userRouter;
