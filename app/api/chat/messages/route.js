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

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }


    //format messages
    let formatedMessages = [];
    formatedMessages = chat.messages.map((msg) => {
      return { "role": msg.role, "content": msg.content };
    });

    return NextResponse.json({ messages: formatedMessages }, { status: 200 });
  } catch (error) {
    console.error("❌ Error in chatData:", error.message);
    return NextResponse.json(
      {
        error:
          error.message || "An error occurred while processing the request",
      },
      { status: 500 },
    );
  }
}
