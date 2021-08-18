import { Image } from "../models/Image";
import fs from "fs";
import mongoose from "mongoose";
import { s3, getSignedUrl } from "../aws";
import mime from "mime-types";

const { promisify } = require("util");
const { v4: uuid } = require("uuid");
// const fileUnlink = promisify(fs.unlink);

export const getImages = async (req, res, next) => {
  // offset vs cursor => cursor 방식으로 pagenation 구현
  // https://velog.io/@minsangk/%EC%BB%A4%EC%84%9C-%EA%B8%B0%EB%B0%98-%ED%8E%98%EC%9D%B4%EC%A7%80%EB%84%A4%EC%9D%B4%EC%85%98-Cursor-based-Pagination-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0
  try {
    const { imageId } = req.query;
    if (imageId && !mongoose.isValidObjectId(imageId))
      throw new Error("invalid imageId");

    // 첫 페이지의 경우 imageId 존재하지 않기 때문
    const images = await Image.find(
      imageId
        ? {
            public: true,
            _id: { $lt: imageId },
          }
        : {
            public: true,
          }
    )
      .sort({ _id: -1 })
      .limit(20);

    return res.status(200).json({ images });
  } catch (error) {
    next(error);
  }
};

export const getImage = async (req, res, next) => {
  try {
    const { imageId } = req.params;
    if (!mongoose.isValidObjectId(imageId)) throw new Error("invalid imageId");

    const image = await Image.findById(imageId);
    if (!image) throw new Error("해당 이미지가 존재하지 않습니다.");

    // _id끼리 비교하면 같아도 다르다고 해준다
    // _id로 비교할꺼면 req.user._id.toString()
    // https://medium.com/@mzndako/comparing-mongoose-object-id-often-fail-a7374a779f6d
    if (!image.public && (!req.user || req.user.id !== image.user.id))
      throw new Error("권한이 없습니다.");

    return res.status(200).json(image);
  } catch (error) {
    next(error);
  }
};

export const postPresigned = async (req, res, next) => {
  try {
    if (!req.user) throw new Error("권한이 없습니다.");

    const { contentTypes } = req.body;
    if (!Array.isArray(contentTypes)) throw new Error("invalid contentTypes");

    const presignedData = await Promise.all(
      contentTypes.map(async (contentType) => {
        const imageKey = `${uuid()}.${mime.extension(contentType)}`;
        const key = `raw/${imageKey}`;
        const presigned = await getSignedUrl({ key });
        return { imageKey, presigned };
      })
    );

    return res.status(200).json(presignedData);
  } catch (error) {
    next(error);
  }
};

export const postImage = async (req, res, next) => {
  // 유저정보, public 유무 확인
  try {
    if (!req.user) throw new Error("권한이 없습니다.");
    const { images, isPublic } = req.body;

    const imageDocs = await Promise.all(
      images.map(async (image) => {
        const img = await new Image({
          user: {
            _id: req.user._id,
            name: req.user.name,
            username: req.user.username,
          },
          public: isPublic,
          key: image.imageKey,
          originalFileName: image.originalname,
        }).save();

        return img;
      })
    );

    return res.status(200).json(imageDocs);
  } catch (error) {
    next(error);
  }
};

// export const postImage = async (req, res, next) => {
//   // 유저정보, public 유무 확인
//   try {
//     if (!req.user) throw new Error("권한이 없습니다.");

//     const images = await Promise.all(
//       req.files.map(async (file) => {
//         const image = await new Image({
//           user: {
//             _id: req.user._id,
//             name: req.user.name,
//             username: req.user.username,
//           },
//           public: req.body.public,
//           key: file.key.replace("raw/", ""),
//           originalFileName: file.originalname,
//         }).save();
//         return image;
//       })
//     );

//     return res.status(200).json(images);
//   } catch (error) {
//     next(error);
//   }
// };

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
    // await fileUnlink(`./uploads/${image.key}`);

    s3.deleteObject(
      {
        Bucket: "imagefullstack",
        Key: `raw/${image.key}`,
      },
      (err, data) => {
        if (err) throw err;
      }
    );
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
