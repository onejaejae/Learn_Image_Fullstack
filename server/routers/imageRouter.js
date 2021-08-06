import express from "express";
import { getImages, postImage } from "../controllers/ImageController";
import { upload } from "../middlewares/imageUpload";

const ImageRouter = express.Router();

ImageRouter.get("/", getImages);
ImageRouter.post("/", upload.single("image"), postImage);

export default ImageRouter;
