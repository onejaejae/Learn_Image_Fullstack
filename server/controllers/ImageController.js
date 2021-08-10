import { Image } from "../models/Image";
import fs from "fs";
import mongoose from "mongoose";
const { promisify } = require("util");

const fileUnlink = promisify(fs.unlink);

export const getImages = async (req, res, next) => {
  try {
    // public한 이미지들만 제공
    const images = await Image.find({ public: true });
    return res.status(200).json({ images });
  } catch (error) {
    next(error);
  }
};

export const postImage = async (req, res, next) => {
  // 유저정보, public 유무 확인
  try {
    if (!req.user) throw new Error("권한이 없습니다.");
    console.log(req.files);

    const images = await Promise.all(
      req.files.map(async (file) => {
        const image = await new Image({
          user: {
            _id: req.user._id,
            name: req.user.name,
            username: req.user.username,
          },
          public: req.body.public,
          key: file.filename,
          originalFileName: file.originalname,
        }).save();
        return image;
      })
    );

    return res.status(200).json(images);
  } catch (error) {
    next(error);
  }
};

export const deleteImage = async (req, res, next) => {
  // 유저 권한 확인
  // 사진 삭제
  // 1. uploads 폴더에 있는 사진 삭제
  // 2. db에 있는 image 문서 삭제
  try {
    if (!req.user) throw new Error("권한이 없습니다");

    const { imageId } = req.params;
    if (!mongoose.isValidObjectId(imageId))
      throw new Error("imageId not valid");

    const image = await await Image.findByIdAndDelete(imageId);
    if (!image)
      return res.json({ message: "요청하신 사진은 이미 삭제되었습니다." });
    await fileUnlink(`./uploads/${image.key}`);

    return res.json({ message: "요청하신 이미지가 삭제되었습니다." });
  } catch (error) {
    next(error);
  }
};

export const patchLike = async (req, res, next) => {
  // 유저 권한 확인
  // like 중복 안되도록 확인
  try {
    if (!req.user) throw new Error("권한이 없습니다.");

    const { imageId } = req.params;
    if (!mongoose.isValidObjectId(imageId))
      throw new Error("imageId not valid");

    // $addToSet
    // 만약 동일한 아이템을 추가할 때 중복적으로 추가하지 않도록 하기위해
    const image = await Image.findOneAndUpdate(
      { _id: imageId },
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );
    return res.status(200).json(image);
  } catch (error) {
    next(error);
  }
};

export const patchUnlike = async (req, res, next) => {
  // 유저 권한 확인
  // like 중복 취소 안되도록 확인
  try {
    if (!req.user) throw new Error("권한이 없습니다.");

    const { imageId } = req.params;
    if (!mongoose.isValidObjectId(imageId))
      throw new Error("imageId not valid");

    const image = await Image.findOneAndUpdate(
      { _id: imageId },
      { $pull: { likes: req.user._id } },
      { new: true }
    );

    return res.status(200).json(image);
  } catch (error) {
    next(error);
  }
};
