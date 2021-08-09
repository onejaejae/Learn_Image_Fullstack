import express from "express";
import {
  getImages,
  postImage,
  deleteImage,
  patchLike,
  patchUnlike,
} from "../controllers/ImageController";
import { upload } from "../middlewares/imageUpload";

const ImageRouter = express.Router();

ImageRouter.get("/", getImages);
ImageRouter.post("/", upload.single("image"), postImage);
ImageRouter.patch("/:imageId/like", patchLike);
ImageRouter.patch("/:imageId/unlike", patchUnlike);
ImageRouter.delete("/:imageId", deleteImage);

export default ImageRouter;
