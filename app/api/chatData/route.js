import { Chat } from "@/models/chat.schema";
import connectDB from "@/lib/connectdb";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    console.log("📨 Fetching chat for sessionId:", sessionId);

    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId is required" },
        { status: 400 }
      );
    }

    const chat = await Chat.findById(sessionId);

    if (!chat) {
      console.log("❌ Chat not found for sessionId:", sessionId);
      return NextResponse.json(
        { error: "Chat not found" },
        { status: 404 }
      );
    }

    console.log("✅ Chat found with", chat.messages.length, "messages");
    
    return NextResponse.json({ chat }, { status: 200 });
  } catch (error) {
    console.error("❌ Error in chatData:", error.message);
    return NextResponse.json(
      {
        error: error.message || "An error occurred while processing the request",
      },
      { status: 500 }
    );
  }
}
