import express from "express";
import multer from "multer";
import mime from "mime-types";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Image } from "./models/Image";

dotenv.config();
const { v4: uuid } = require("uuid");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads"),
  filename: (req, file, cb) =>
    cb(null, `${uuid()}.${mime.extension(file.mimetype)}`),
});

// 필터를 걸어주어 변수를 최소화하는 것이 중요하다!
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (["image/jpeg", "image/png"].includes(file.mimetype)) cb(null, true);
    else cb(new Error("invalid file type."), false);
  },
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB,
  },
});

const app = express();
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
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

    app.get("/images", async (req, res) => {
      try {
        const images = await Image.find({});
        return res.status(200).json({ images });
      } catch (error) {
        console.log(error);
      }
    });

    app.post("/images", upload.single("image"), async (req, res) => {
      const image = await new Image({
        key: req.file.filename,
        originalFileName: req.file.originalname,
      }).save();
      res.json(image);
    });

    app.listen(5000, () => {
      console.log(`Express server listening on ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
