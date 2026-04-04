import { Chat } from "@/models/chat.schema";
import connectDB from "@/lib/connectdb";
import { NextResponse } from "next/server";

export async function DELETE(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { chatID } = body;

    if (!chatID) {
      return NextResponse.json(
        { error: "chatID is required" },
        { status: 400 },
      );
    }

    const deletedChat = await Chat.findByIdAndDelete(chatID);

    if (!deletedChat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Chat deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting chat:", error);
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
