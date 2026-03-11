import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    chatName: {
      type: String,
    },
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
  },
  { timestamps: true },
);


export const Chat = mongoose.models.Chat || mongoose.model("Chat", ChatSchema);
