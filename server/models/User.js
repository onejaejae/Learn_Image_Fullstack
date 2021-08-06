import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    sessions: [
      {
        createAt: { type: Date, required: true },
      },
    ],
  },
  { timestamps: true }
);

export const User = mongoose.model("User", UserSchema);
