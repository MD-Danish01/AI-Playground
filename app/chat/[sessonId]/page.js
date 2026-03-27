"use client";
import * as React from "react";
import Sidebar from "@/components/Sidebar";
import { useState, useEffect } from "react";
import {
  FiChevronDown,
  FiHelpCircle,
  FiMic,
  FiPlus,
  FiSend,
  FiSettings,
} from "react-icons/fi";

const ChatPage = ({ params }) => {
  const Id = React.use(params);
  const sessionId = Id.sessonId;

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [messages, setmessages] = useState([]);
  const [input, setinput] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChatData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/chatData?sessionId=${sessionId}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch chat");
        }
        
        const data = await response.json();
        console.log("📨 Chat data loaded:", data);
        
        if (data.chat && data.chat.messages) {
          setmessages(data.chat.messages);
        }
      } catch (error) {
        console.error("❌ Error loading chat:", error);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      loadChatData();
    }
  }, [sessionId]);

  const handelSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      content: input,
    };

    // Add user message immediately
    const updatedMessages = [...messages, userMessage];
    setmessages(updatedMessages);
    setinput("");

    try {
      const response = await fetch("/api/AIResponse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userMessage: userMessage,
          sessionId: sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();

      const assistantMessage = {
        role: "assistant",
        content: result.content,
      };

      // Add bot response
      setmessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = {
        role: "assistant",
        content: `Error: ${error.message}`,
      };
      setmessages((prev) => [...prev, errorMessage]);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#1F2020] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white mx-auto mb-4"></div>
          <p>Loading chat...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen bg-[#1F2020] text-white flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          collapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed((prev) => !prev)}
        />

        <section className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="border-b border-white/10 px-4 md:px-10 py-4 flex items-center justify-start shrink-0">
            <button className="flex items-center gap-2 text-2xl font-semibold text-white/95 hover:opacity-80 transition-opacity">
              ChatGPT <FiChevronDown className="text-xl text-white/70" />
            </button>
          </header>

          {/* Messages Container - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            {messages.length === 0 ? (
              /* Empty State - Centered */
              <div className="h-full flex flex-col items-center justify-center px-4">
                <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white/96 text-center mb-12">
                  Where should we begin?
                </h1>
              </div>
            ) : (
              /* Messages List */
              <div className="max-w-3xl mx-auto px-4 md:px-8 py-6 space-y-4">
                {messages.map((message, index) => {
                  return message.role === "user" ? (
                    <div key={index} className="flex justify-end">
                      <div className="bg-white/5 rounded-2xl p-4 max-w-[85%] sm:max-w-[75%] backdrop-blur-sm border border-white/5">
                        <p className="text-base leading-relaxed text-white/90">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div key={index} className="flex justify-start">
                      <div className="bg-transparent rounded-2xl p-4 max-w-[85%] sm:max-w-[75%]">
                        <p className="text-base leading-relaxed text-white/95">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Input Bar - Only input sticks to bottom */}
          <div className="px-4 md:px-10 py-4 md:py-6 bg-[#1F2020] shrink-0">
            <div className="w-full max-w-4xl mx-auto rounded-full border border-white/10 bg-white/6 px-5 py-3">
              <div className="flex items-center gap-3">
                <button className="w-10 h-10 rounded-full flex items-center justify-center text-white/90 hover:bg-white/10 transition-colors shrink-0">
                  <FiPlus className="text-xl" />
                </button>
                <input
                  className="bg-transparent border-none outline-none flex-1 text-base text-white/90 placeholder:text-white/55"
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
                <button className="w-10 h-10 rounded-full flex items-center justify-center text-white/90 hover:bg-white/10 transition-colors shrink-0">
                  <FiMic className="text-xl" />
                </button>
                <button className="w-10 h-10 rounded-full flex items-center justify-center text-white/90 hover:bg-white/10 transition-colors shrink-0">
                  <FiSettings className="text-xl" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer text */}
          <div className="px-4 text-center text-xs text-white/50 py-2 shrink-0">
            <p>ChatGPT can make mistakes. Check important info.</p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ChatPage;
