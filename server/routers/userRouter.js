import express from "express";
import {
  postRegister,
  patchLogin,
  patchLogout,
} from "../controllers/UserController";

const userRouter = express.Router();

userRouter.post("/register", postRegister);
userRouter.patch("/login", patchLogin);
userRouter.patch("/logout", patchLogout);

export default userRouter;
