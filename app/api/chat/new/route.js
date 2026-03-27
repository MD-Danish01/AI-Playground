import { auth } from "@/auth";
import { Chat } from "@/models/chat.schema";
import connectDB from "@/lib/connectdb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.redirect(
        new URL("/login", process.env.NEXTAUTH_URL || "http://localhost:3000"),
      );
    }

    await connectDB();

    const existingChatNewChat = await Chat.findOne({
      $and: [{ userId: session.user.id }, { chatName: "New Chat" }],
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
      userId: session.user.id,
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
