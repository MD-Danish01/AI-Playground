import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, unique: true, required: true },
    image: { type: String },
    emailVerified: { type: Date, default: null },
  },
  { timestamps: true },
);

export default mongoose.model.User || mongoose.model("User", UserSchema);