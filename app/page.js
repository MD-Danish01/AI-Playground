"use client";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";
import { FiChevronDown, FiHelpCircle, FiMic, FiPlus } from "react-icons/fi";

export default function Home() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [messages, setmessages] = useState([]);
  const [input, setinput] = useState("");

  const handelSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      content: input,
    };

    // Add user message immediately
    const updatedMessages = [...messages, userMessage];
    setmessages(updatedMessages);
    setinput(""); // Clear input

    try {
      //fetch the api with messages params
      const response = await fetch("http://localhost:8000/chat/v1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedMessages),
      });

      const result = await response.json();
      
      const assistantMessage = {
        role: "assistant",
        content: result.content,
      };

      // Add bot response
      setmessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <main className="min-h-screen bg-[#1F2020] text-white">
      <div className="flex min-h-screen">
        <Sidebar
          collapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed((prev) => !prev)}
        />

        <section className="flex-1 px-4 md:px-10 py-4 md:py-6 flex flex-col">
          <header className="flex items-center justify-between">
            <button className="hidden md:flex items-center gap-1 text-xl font-semibold text-white/95">
              AI Assistant <FiChevronDown className="text-xl" />
            </button>

            <div className="flex items-center gap-3 ml-auto">
              <Link href="/login">
                <button className="rounded-full bg-white text-black px-5 py-2 text-xl font-semibold hover:bg-white/90 transition-colors">
                  Log in
                </button>
              </Link>
              <Link href="/login">
                <button className="rounded-full border border-white/20 px-5 py-2 text-xl font-semibold text-white/95 hover:bg-white/7 transition-colors hidden sm:block">
                  Sign up for free
                </button>
              </Link>
              <button className="w-10 h-10 rounded-full border border-white/18 flex items-center justify-center text-white/90 hover:bg-white/7 transition-colors">
                <FiHelpCircle className="text-xl" />
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto py-6">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center">
                <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-white/96">
                  Draft or rewrite text
                </h1>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4 pb-6">
                {messages.map((message, index) => {
                  return message.role === "user" ? (
                    <div key={index} className="flex justify-end">
                      <div className="user-message bg-white/5 rounded-2xl sm:rounded-3xl p-3 sm:p-4 max-w-[85%] sm:max-w-[75%] backdrop-blur-sm border border-white/5">
                        <p className="text-sm sm:text-base leading-relaxed text-white/90">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div key={index} className="flex justify-start">
                      <div className="bot-message bg-blue-500/10 rounded-2xl sm:rounded-3xl p-3 sm:p-4 max-w-[85%] sm:max-w-[75%] backdrop-blur-sm border border-blue-500/20">
                        <p className="text-sm sm:text-base leading-relaxed text-white/95">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pb-2 md:pb-4">
            <div className="w-full max-w-4xl mx-auto rounded-full border border-white/10 bg-white/6 px-5 py-3">
              <div className="flex items-center gap-3">
                <button className="w-11 h-11 rounded-full flex items-center justify-center text-white/90 hover:bg-white/10 transition-colors">
                  <FiPlus className="text-2xl" />
                </button>
                <input
                  className="bg-transparent border-none outline-none flex-1 text-lg text-white/90 placeholder:text-white/55"
                  placeholder="Ask anything"
                  type="text"
                  value={input}
                  onChange={(e) => setinput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handelSend();
                    }
                  }}
                />
                <button
                  className="rounded-full bg-white/10 px-4 py-2 text-base font-semibold text-white/95 border border-white/10 flex items-center gap-2 hover:bg-white/14 transition-colors"
                  onClick={handelSend}
                >
                  <FiMic className="text-lg" /> Send
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
