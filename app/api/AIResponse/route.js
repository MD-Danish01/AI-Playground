import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const sessionHistories = new Map();
const MAX_HISTORY = 10;

export async function POST(request) {
  try {
    const body = await request.json();
    const { messages, sessionId = "default" } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required and must not be empty" },
        { status: 400 }
      );
    }

    // Get or initialize session history
    let history = sessionHistories.get(sessionId) || [];

    // Add incoming messages to history
    history = [...history, ...messages];

    // Trim history to max size
    if (history.length > MAX_HISTORY) {
      history = history.slice(history.length - MAX_HISTORY);
    }

    // Call Groq API
    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: history,
      max_tokens: 1000,
    });

    // Extract assistant response
    const assistantMessage = completion.choices[0].message.content;

    // Add assistant response to history
    history.push({
      role: "assistant",
      content: assistantMessage,
    });

    // Save updated history
    sessionHistories.set(sessionId, history);

    return NextResponse.json(
      {
        role: "assistant",
        content: assistantMessage,
        sessionId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error.message);
    return NextResponse.json(
      { error: error.message || "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}


