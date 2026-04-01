import { NextResponse } from "next/server";
import OpenAI from "openai";
import { Chat } from "@/models/chat.schema";
import connectDB from "@/lib/connectdb";
import {
  Agent,
  run,
  setDefaultOpenAIClient,
  setTracingDisabled,
} from "@openai/agents";

// Disable tracing
setTracingDisabled(true);

// Initialize Groq client
const groqClient = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

setDefaultOpenAIClient(groqClient);

// Create agent
const agent = new Agent({
  name: "AI Assistant",
  instructions:
    "You are a helpful assistant. Answer user questions accurately and concisely.",
  model: "llama-3.1-8b-instant",
});

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { userMessage, chatId } = body;

    if (!userMessage || !chatId) {
      return NextResponse.json(
        { error: "User message and chatId are required" },
        { status: 400 },
      );
    }

    // Fetch existing chat
    const DbChat = await Chat.findById(chatId);

    if (!DbChat) {
      return NextResponse.json(
        { error: "Chat session not found" },
        { status: 404 },
      );
    }

    // Build thread from chat history in Responses-style input format.
    // For replayed history, user items should use input_text and assistant items output_text.
    let thread = [];
    if (DbChat.messages && DbChat.messages.length > 0) {
      thread = DbChat.messages.map((msg) => ({
        type: "message",
        role: msg.role,
        content: [
          {
            type: msg.role === "assistant" ? "output_text" : "input_text",
            text: String(msg.content ?? ""),
          },
        ],
      }));
    }

    // Get user content
    const userContent = userMessage.content;

    // Add current user turn as an input message item.
    const inputThread = thread.concat({
      type: "message",
      role: "user",
      content: [{ type: "input_text", text: userContent }],
    });

    // Run agent with thread
    const result = await run(agent, inputThread);

    // Get the final output
    const assistantMessage = result.finalOutput;

    if (!assistantMessage) {
      throw new Error("No response content received from agent");
    }

    // Save both messages to DB
    DbChat.messages.push({
      role: "user",
      content: userContent,
    });

    DbChat.messages.push({
      role: "assistant",
      content: assistantMessage,
    });
    await DbChat.save();

    return NextResponse.json(
      {
        role: "assistant",
        content: assistantMessage,
        chatId,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in AIResponse:", error.message);
    return NextResponse.json(
      {
        error:
          error.message || "An error occurred while processing the request",
      },
      { status: 500 },
    );
  }
}