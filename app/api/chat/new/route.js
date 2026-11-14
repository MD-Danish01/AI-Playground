import { auth } from "@/auth";
import { Chat } from "@/models/chat.schema";
import connectDB from "@/lib/connectdb";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.redirect(
        new URL("/login", request.url),
      );
    }

    await connectDB();

    // Convert session.user.id to ObjectId for consistent querying
    const userId = new mongoose.Types.ObjectId(session.user.id);

    const existingChatNewChat = await Chat.findOne({
      $and: [{ userId: userId }, { chatName: "New Chat" }],
    });

    if (existingChatNewChat) {
      return NextResponse.redirect(
        new URL(`/chat/${existingChatNewChat._id}`, request.url),
      );
    }

    // Create new chat session

    const newChat = await Chat.create({
      userId: userId,
      chatName: "New Chat",
      messages: [],
    });

    return NextResponse.redirect(
      new URL(`/chat/${newChat._id}`, request.url),
    );
  } catch (error) {
    console.error("Error creating chat:", error);
    return NextResponse.json(
      { error: "Failed to create chat" },
      { status: 500 },
    );
  }
}
