"use client";
import { FiPlus, FiMenu, FiUser, FiTrash2, FiLogOut } from "react-icons/fi";
import { useEffect, useState } from "react";
import Link from "next/link";
import { redirectToNewChat } from "@/actions/redirect";
import { getProfileData, handleSignOut } from "@/actions/getProfileData";

export default function Sidebar({ collapsed, onToggle, chatId, titleChanged }) {
  const [resent, setresent] = useState([]);
  const [showAccountCard, setShowAccountCard] = useState(false);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    if (!chatId) return;

    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(`/api/chat/resent?chatId=${chatId}`, requestOptions)
      .then((response) => response.json())
      .then((result) => setresent(result.resent))
      .catch((error) => console.error(error));
  }, [chatId, titleChanged]);

  useEffect(() => {
    getProfileDatafn();
  }, [""]);

  const getProfileDatafn = async () => {
    const userData = await getProfileData();
    setUserData(userData);
  };
  const handleShowProfile = async () => {
    setShowAccountCard(!showAccountCard);
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

  const handleDeleteChat = async (chatId) => {
    try {
      const response = await fetch(`/api/chat/deleteChat`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatID: chatId }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      // Remove the deleted chat from the recent chats list
      setresent((prev) => prev.filter((chat) => chat._id !== chatId));
      //reload the page
      window.location.reload();
    } catch (error) {
      console.error("Error deleting chat:", error);
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
      </div>

      {/* New Chat Button */}
      <button
        onClick={() => handleNewChat()}
        className={`mb-6 flex items-center justify-center gap-3 rounded-lg bg-white/10 hover:bg-white/15 py-3 transition-colors font-medium text-sm ${collapsed ? "px-0" : "px-4"}`}
      >
        <FiPlus size={18} className="text-white/80" />
        {!collapsed && <span>New chat</span>}
      </button>

      {/* Chat History - Minimal remove scrollbar*/}
      {!collapsed && (
        <div className="flex-1 space-y-2 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
          <p className="px-3 py-2 text-xs font-medium text-white/50 uppercase tracking-wider">
            Recent
          </p>
          {/* Placeholder for chat items */}
          <div className="space-y-1">
            {resent.map((chat, index) => {
              return (
                <Link href={`/chat/${chat._id}`} key={index} className="">
                  <div className="items-left justify-between rounded-lg text-sm text-white/70 hover:bg-white/5 cursor-pointer transition-colors truncate flex scrollbar-hide">
                    <div className="items-left flex-col min-w-[70%] py-3 px-4 truncate">
                      <span className="text-ellipsis overflow-hidden">
                        {chat.chatName}
                      </span>

                      <span className="text-xs text-white/50">
                        <br />
                        {new Date(chat.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "2-digit",
                        })}
                      </span>
                    </div>

                    {/*delete chat button */}
                    <button
                      onClick={() => handleDeleteChat(chat._id)}
                      className="text-white/70 hover:text-white/90 transition-colors px-2"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* User Section */}

      {showAccountCard && (
        <div className="absolute bottom-20 left-4 bg-[#1F2020] border border-white/10 rounded-lg p-4 max-w-70 py-4">
          <div className="flex items-center gap-4">
            <img
              src={userData?.image}
              alt={"Profile"}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-medium text-white">{userData?.name}</p>
              <p className="text-sm text-white/70 overflow-hidden">
                {userData?.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex gap-4 items-center justify-center p-2 mt-4 rounded-lg bg-white/10 hover:bg-white/20 transition-colors w-full"
          >
            <FiLogOut
              size={18}
              className="text-white/70 hover:text-white/90 transition-colors items-center cursor-pointer"
            />{" "}
            <span>Logout</span>
          </button>
        </div>
      )}

      <div
        onClick={handleShowProfile}
        className={`mt-auto pt-4 border-t border-white/10 flex items-center gap-3 cursor-pointer ${collapsed ? "justify-center" : ""}`}
      >
        <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
          {userData?.image ? (
            <img
              src={userData?.image}
              alt={"Profile"}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <FiUser
              size={18}
              className="text-white/70 hover:text-white/90 transition-colors"
            />
          )}
        </button>
        {!collapsed && <span className="text-sm text-white/70">Account</span>}
      </div>
    </aside>
  );
}
