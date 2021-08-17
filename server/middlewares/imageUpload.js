import multer from "multer";
import mime from "mime-types";
import multerS3 from "multer-s3";
import { s3 } from "../aws";

const { v4: uuid } = require("uuid");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "./uploads"),
//   filename: (req, file, cb) =>
//     cb(null, `${uuid()}.${mime.extension(file.mimetype)}`),
// });

const storage = multerS3({
  s3,
  bucket: "imagefullstack",
  key: (req, file, cb) =>
    cb(null, `raw/${uuid()}.${mime.extension(file.mimetype)}`),
});

// 필터를 걸어주어 변수를 최소화하는 것이 중요하다!
export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (["image/jpeg", "image/png"].includes(file.mimetype)) cb(null, true);
    else cb(new Error("invalid file type."), false);
  },
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB,
  },
});
