import { Chat } from "@/models/chat.schema";
import connectDB from "@/lib/connectdb";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get("chatId");

    if (!chatId) {
      return NextResponse.json(
        { error: "chatId is required" },
        { status: 400 },
      );
    }

    // Find the current chat to get userId
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return NextResponse.json(
        { error: "Chat not found" },
        { status: 404 },
      );
    }

    if (!chat.userId) {
      return NextResponse.json(
        { error: "UserId not found in chat" },
        { status: 400 },
      );
    }

    // Find all chats for this user, sorted by most recent first
    const chatHistory = await Chat.find({ userId: chat.userId })
      .sort({ createdAt: -1 })
      .select("_id chatName createdAt");

    return NextResponse.json({ resent: chatHistory }, { status: 200 });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
