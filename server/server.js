import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { routes } from "./routes";
import ImageRouter from "./routers/imageRouter";
import userRouter from "./routers/userRouter";
import { authenticate } from "./middlewares/authentication";

dotenv.config();

const app = express();
const { PORT, MONGO_URI } = process.env;

mongoose
  .connect(MONGO_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("mongoDB connected!!");

    // localhsot://5000/uploads/파일명으로 접근 가능해짐
    // "/uploads"를 빼면 localhsot://5000/파일명으로 접근 가능
    app.use("/uploads", express.static("uploads"));
    app.use(cors());
    app.use(express.json());
    app.use(authenticate);

    // routers
    app.use(routes.image, ImageRouter);
    app.use(routes.user, userRouter);

    app.use((err, req, res, next) => {
      console.log(err);
      res.status(500).json({ message: err.message });
    });

    app.listen(PORT, () => {
      console.log(`Express server listening on ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
