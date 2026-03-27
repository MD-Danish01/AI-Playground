import { NextResponse } from "next/server";
import OpenAI from "openai";
import { Chat } from "@/models/chat.schema";
import connectDB from "@/lib/connectdb";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const MAX_HISTORY = 10;

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { userMessage, sessionId } = body;

    if (!userMessage || typeof userMessage !== "object") {
      return NextResponse.json(
        { error: "User message is required and must be an object" },
        { status: 400 }
      );
    }

    // Fetch existing chat
    const DbChat = await Chat.findById(sessionId);
    
    if (!DbChat) {
      return NextResponse.json(
        { error: "Chat session not found" },
        { status: 404 }
      );
    }

    let content = [];

    // Load message history
    if (DbChat.messages && DbChat.messages.length > 0) {
      const historyMessages = DbChat.messages.slice(-10).map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));
      content = [...historyMessages, userMessage];
    } else {
      content = [userMessage];
    }

    // Save user message to DB
    DbChat.messages.push({
      role: userMessage.role,
      content: userMessage.content,
    });
    await DbChat.save();

    // Call Groq API
    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: content,
      max_tokens: 1000,
    });

    // Extract assistant response
    const assistantMessage = completion.choices[0].message.content;

    // Save assistant response to DB
    DbChat.messages.push({
      role: "assistant",
      content: assistantMessage,
    });
    await DbChat.save();

    return NextResponse.json(
      {
        role: "assistant",
        content: assistantMessage,
        sessionId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in AIResponse:", error.message);
    return NextResponse.json(
      { error: error.message || "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}


