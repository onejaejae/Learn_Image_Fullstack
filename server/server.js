import express from "express";
import multer from "multer";
import mime from "mime-types";
import cors from "cors";

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

// localhsot://5000/uploads/파일명으로 접근 가능해짐
// "/uploads"를 빼면 localhsot://5000/파일명으로 접근 가능
app.use("/uploads", express.static("uploads"));
app.use(cors());

app.post("/upload", upload.single("image"), (req, res) => {
  console.log(req.file);
  res.json(req.file);
});

app.listen(5000, () => {
  console.log(`Express server listening on ${PORT}`);
});
