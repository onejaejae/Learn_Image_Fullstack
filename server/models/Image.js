import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema(
  {
    user: {
      _id: { type: mongoose.Types.ObjectId, required: true, index: true },
      name: { type: String, required: true },
      username: { type: String, required: true },
    },
    // 프론트에서 좋아요 숫자만 보여줄 것이기 떄문에
    // 내장형으로 하였다
    likes: [{ type: mongoose.Types.ObjectId }],
    public: { type: Boolean, required: true, default: false },
    key: { type: String, required: true },
    originalFileName: { type: String, required: true },
  },
  { timestamps: true }
);

export const Image = mongoose.model("image", ImageSchema);
