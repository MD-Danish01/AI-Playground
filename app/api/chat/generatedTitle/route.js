import { NextResponse } from "next/server";
import { Chat } from "@/models/chat.schema";
import connectDB from "@/lib/connectdb";
import { setDefaultOpenAIClient, setTracingDisabled } from "@openai/agents";
import OpenAI from "openai";
import { Content } from "next/font/google";

setTracingDisabled(true);

const groqClient = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

setDefaultOpenAIClient(groqClient);

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { messages, chatId } = body;

    if (!messages || !chatId) {
      return NextResponse.json(
        { error: "messages and chatId is required" },
        { status: 400 },
      );
    }

    const DBchat = await Chat.findById(chatId);
    if (!DBchat) {
      return NextResponse.json(
        { error: "chat is not found." },
        { status: 404 },
      );
    }

    //formated message for only user question
    let formatedMessages = [];
    formatedMessages = await messages.filter((msg) => msg.role === "user");

    const response = await groqClient.responses.create({
      model: process.env.GROQ_MODEL || "qwen/qwen3.8-27b",
      instructions:
        "You generate chat titles from user messages; return exactly one professional, topic-specific title in plain text only, with no labels, no quotes, no markdown, no emojis, and no extra explanation; the title must be strictly 2 to 4 words, use only clear English words, avoid punctuation except a hyphen only if absolutely necessary, do not start with phrases like Title, The title, or Here is, and if the topic is unclear return exactly General Discussion.",
      input: formatedMessages,
    });

    const title = response.output_text;
    if (title !== "") {
      DBchat.chatName = response.output_text;
      await DBchat.save();
    }

    return NextResponse.json(
      { generatedTitle: response.output_text },
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
