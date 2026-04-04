import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { Chat } from "@/models/chat.schema";
import connectDB from "@/lib/connectdb";
import mongoose from "mongoose";

export async function GET(request) {
  try {
    await connectDB();

    const session = await auth();

    if (!session) {
      return NextResponse.redirect(
        new URL("/login", request.url),
      );
    }

    const userId = new mongoose.Types.ObjectId(session.user.id);

    const existingnewChat = await Chat.findOne({
      $and: [{ userId: userId }, { chatName: "New Chat" }],
    });

    if (existingnewChat && existingnewChat.messages.length === 0) {
      await Chat.deleteOne({ _id: existingnewChat._id });
    }

    if (existingnewChat?.messages.length > 0) {
      return NextResponse.json({ chatId: existingnewChat._id });
    }

    const newCaht = await Chat.create({
      userId: userId,
      chatName: "New Chat",
      messages: [],
    });

    return NextResponse.json({ chatId: newCaht._id });
  } catch (error) {
    console.error("Error creating new chat:", error);
    return NextResponse.json(
      { error: "Failed to create new chat" },
      { status: 500 },
    );
  }
}
