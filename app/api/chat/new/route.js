import { auth } from "@/auth";
import { Chat } from "@/models/chat.schema";
import connectDB from "@/lib/connectdb";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.redirect(
        new URL("/login", process.env.NEXTAUTH_URL || "http://localhost:3000"),
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
        new URL(
          `/chat/${existingChatNewChat._id}`,
          process.env.NEXTAUTH_URL || "http://localhost:3000",
        ),
      );
    }

    // Create new chat session

    const newChat = await Chat.create({
      userId: userId,
      chatName: "New Chat",
      messages: [],
    });

    return NextResponse.redirect(
      new URL(
        `/chat/${newChat._id}`,
        process.env.NEXTAUTH_URL || "http://localhost:3000",
      ),
    );
  } catch (error) {
    console.error("Error creating chat:", error);
    return NextResponse.json(
      { error: "Failed to create chat" },
      { status: 500 },
    );
  }
}
