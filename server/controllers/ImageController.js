import { Image } from "../models/Image";

export const getImages = async (req, res, next) => {
  try {
    const images = await Image.find({});
    return res.status(200).json({ images });
  } catch (error) {
    next(error);
  }
};

export const postImage = async (req, res, next) => {
  try {
    const image = await new Image({
      key: req.file.filename,
      originalFileName: req.file.originalname,
    }).save();
    res.json(image);
  } catch (error) {
    next(error);
  }
};
