"use client";
import { FiPlus, FiMenu, FiUser } from "react-icons/fi";
import { useEffect, useState } from "react";
import Link from "next/link";
import { redirectToNewChat } from "@/actions/redirect";

export default function Sidebar({ collapsed, onToggle, chatId, titleChanged }) {
  const [resent, setresent] = useState([]);

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      `http://localhost:3000/api/chat/resent?chatId=${chatId}`,
      requestOptions,
    )
      .then((response) => response.json())
      .then((result) => setresent(result.resent))
      .catch((error) => console.error(error));
  }, [titleChanged]);

  const handleNewChat = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/chat/createNewChat`,
      );
      const data = await response.json();
      await redirectToNewChat(data.chatId);
    } catch (error) {
      console.error("Error creating new chat:", error);
    }
  };

  return (
    <aside
      className={`hidden md:flex min-h-screen bg-[#0f1115] border-r border-white/10 text-white flex-col py-5 px-4 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Toggle sidebar"
        >
          <FiMenu size={20} className="text-white/70" />
        </button>
        {!collapsed && (
          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <FiPlus size={20} className="text-white/70" />
          </button>
        )}
      </div>

      {/* New Chat Button */}
      <button
        onClick={() => handleNewChat()}
        className={`mb-6 flex items-center justify-center gap-3 rounded-lg bg-white/10 hover:bg-white/15 py-3 transition-colors font-medium text-sm ${collapsed ? "px-0" : "px-4"}`}
      >
        <FiPlus size={18} className="text-white/80" />
        {!collapsed && <span>New chat</span>}
      </button>

      {/* Chat History - Minimal */}
      {!collapsed && (
        <div className="flex-1 space-y-2 overflow-y-auto">
          <p className="px-3 py-2 text-xs font-medium text-white/50 uppercase tracking-wider">
            Recent
          </p>
          {/* Placeholder for chat items */}
          <div className="space-y-1">
            {resent.map((chat, index) => {
              return (
                <Link href={`/chat/${chat._id}`} key={index}>
                  <div className="px-3 py-2 rounded-lg text-sm text-white/70 hover:bg-white/5 cursor-pointer transition-colors truncate">
                    {chat.chatName}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* User Section */}
      <div
        className={`mt-auto pt-4 border-t border-white/10 flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}
      >
        <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
          <FiUser size={18} className="text-white/70" />
        </button>
        {!collapsed && <span className="text-sm text-white/70">Account</span>}
      </div>
    </aside>
  );
}
