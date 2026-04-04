"use client";
import * as React from "react";
import Sidebar from "@/components/Sidebar";
import { useState, useEffect, useRef } from "react";
import {
  FiChevronDown,
  FiHelpCircle,
  FiMic,
  FiPlus,
  FiSend,
  FiSettings,
  FiMenu,
} from "react-icons/fi";
import { redirectToNewChat } from "@/actions/redirect";

const ChatPage = ({ params }) => {
  const Id = React.use(params);
  const chatId = Id.chatId;

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [messages, setmessages] = useState([]);
  const [input, setinput] = useState("");
  const [loading, setLoading] = useState(true);
  const [titleChanged, settitleChanged] = useState(0);
  const [chatName, setchatName] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const messagesContainerRef = useRef(null);

  const handelGenerateTitle = async () => {
    try {
      const response = await fetch("/api/chat/generatedTitle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messages,
          chatId: chatId,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
    } catch (error) {
      console.error("Error:", error);
    }
  };

   const handleNewChat = async () => {
      try {
        const response = await fetch(`/api/chat/createNewChat`);
        const data = await response.json();
        await redirectToNewChat(data.chatId);
      } catch (error) {
        console.error("Error creating new chat:", error);
      }
    };

  useEffect(() => {
    if (
      (chatName === "New Chat" ||
        chatName === "General Discussion" ||
        chatName === "") &&
      messages.length > 0
    ) {
      handelGenerateTitle();
      settitleChanged(titleChanged + 1);
    }
  }, [messages]);

  useEffect(() => {
    const loadChatData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/chat/messages?chatId=${chatId}`);

        //if chat not found, create new chat and redirect to this chat
        if (response.status === 404) {
          handleNewChat();
          return;
        }

        if(!response.ok){
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.messages) {
          setmessages(data.messages);
          setchatName(data.chatName);
        }
      } catch (error) {
        console.error("❌ Error loading chat:", error);
      } finally {
        setLoading(false);
      }
    };

    if (chatId) {
      loadChatData();
    }
  }, [chatId]);

  useEffect(() => {
    const updateKeyboardOffset = () => {
      if (!window.visualViewport) {
        setKeyboardOffset(0);
        return;
      }

      const viewport = window.visualViewport;
      const offset = Math.max(
        0,
        window.innerHeight - viewport.height - viewport.offsetTop,
      );
      setKeyboardOffset(offset);
    };

    updateKeyboardOffset();
    window.visualViewport?.addEventListener("resize", updateKeyboardOffset);
    window.visualViewport?.addEventListener("scroll", updateKeyboardOffset);
    window.addEventListener("resize", updateKeyboardOffset);

    return () => {
      window.visualViewport?.removeEventListener("resize", updateKeyboardOffset);
      window.visualViewport?.removeEventListener("scroll", updateKeyboardOffset);
      window.removeEventListener("resize", updateKeyboardOffset);
    };
  }, []);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const distanceFromBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;
      setIsNearBottom(distanceFromBottom < 140);
    };

    handleScroll();
    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container || !isNearBottom) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isNearBottom]);

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
          chatId: chatId,
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

  const handelCommingSoon = () => {
    alert("This feature is coming soon!");
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
          chatId={chatId}
          titleChanged={titleChanged}
        />

        <section className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="border-b border-white/10 pl-16 pr-4 md:px-10 py-4 flex items-center justify-start shrink-0">
            <button className="flex items-center gap-2 text-2xl font-semibold text-white/95 hover:opacity-80 transition-opacity">
              AI Playground <FiChevronDown className="text-xl text-white/70" />
            </button>
          </header>

          {/* Messages Container - Scrollable */}
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto pb-36 md:pb-24 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
          >
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

          <div
            className="fixed md:static left-0 right-0 z-20 px-3 md:px-0"
            style={{ bottom: isInputFocused ? `${keyboardOffset}px` : "0px" }}
          >
            <div className="w-full max-w-4xl mx-auto rounded-full border border-white/10 bg-[#2a2b2f] px-4 md:px-5 py-3 mb-4 md:mb-0">
              <div className="flex items-center gap-2 md:gap-3">
              <button
                onClick={handelCommingSoon}
                className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white/90 hover:bg-white/10 transition-colors shrink-0"
              >
                <FiPlus className="text-xl" />
              </button>
              <input
                className="bg-transparent border-none outline-none flex-1 text-base text-white/90 placeholder:text-white/55"
                placeholder="Ask anything"
                type="text"
                value={input}
                onChange={(e) => setinput(e.target.value)}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && input.trim()) {
                    handelSend();
                  }
                }}
              />
              <button
                onClick={handelCommingSoon}
                className="hidden md:flex w-10 h-10 rounded-full items-center justify-center text-white/90 hover:bg-white/10 transition-colors shrink-0"
              >
                <FiMic className="text-xl" />
              </button>
              <button
                onClick={handelCommingSoon}
                className="hidden md:flex w-10 h-10 rounded-full items-center justify-center text-white/90 hover:bg-white/10 transition-colors shrink-0"
              >
                <FiSettings className="text-xl" />
              </button>
              <button
                disabled={!input.trim()}
                onClick={handelSend}
                className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white/90 hover:bg-white/10 transition-colors shrink-0 disabled:opacity-40"
              >
                <FiSend className="text-xl" />
              </button>
            </div>
          </div>
          </div>

          {/* Footer text */}
          <div className="hidden md:block px-4 text-center text-xs text-white/50 py-2 shrink-0">
            <p>AI Assistance can make mistakes. Check important info.</p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ChatPage;
