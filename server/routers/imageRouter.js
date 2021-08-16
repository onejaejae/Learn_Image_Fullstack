import express from "express";
import {
  getImages,
  getImage,
  postImage,
  deleteImage,
  patchLike,
  patchUnlike,
} from "../controllers/ImageController";
import { upload } from "../middlewares/imageUpload";

const ImageRouter = express.Router();

ImageRouter.get("/", getImages);
ImageRouter.get("/:imageId", getImage);
ImageRouter.post("/", upload.array("image", 5), postImage);
ImageRouter.patch("/:imageId/like", patchLike);
ImageRouter.patch("/:imageId/unlike", patchUnlike);
ImageRouter.delete("/:imageId", deleteImage);

export default ImageRouter;
