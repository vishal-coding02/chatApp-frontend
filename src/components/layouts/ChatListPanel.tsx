import { useEffect, useState } from "react";
import ChatTopBar from "../chats/ChatTopBar";
import ChatRow from "../chats/ChatRow";
import api from "../../api/axios";

interface ChatListPanelProps {
  onSelectChat: (chat: any) => void;
  onOpenProfile: any;
}

const ChatListPanel = ({ onSelectChat, onOpenProfile }: ChatListPanelProps) => {
  const [activeTab, setActiveTab] = useState<"chats" | "requests">("chats");
  const [regularChats, setRegularChats] = useState<any[]>([]);
  const [pendingChats, setPendingChats] = useState<any[]>([]);
  const [loading, setLoading] = useState({
    chats: true,
    requests: false,
  });
  const id = localStorage.getItem("userID");

  const myRegularChats = async () => {
    try {
      setLoading({ chats: true, requests: true });

      const res = await api.get(`/api/v1/chats/${id}`);
      const chats = res.data.chats;

      const activeChats = chats.filter((chat: any) => chat.status === "active");

      const myPendingChats = chats.filter(
        (chat: any) => chat.status === "pending" && chat.createdBy === id,
      );

      setRegularChats([...activeChats, ...myPendingChats]);

      setLoading({ chats: false, requests: false });
    } catch (err: any) {
      setLoading({ chats: false, requests: false });
      console.log(err.response?.data?.error || err.message);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      setLoading((prev) => ({ ...prev, requests: true }));

      const res = await api.get("/api/v1/chats/requests");

      setPendingChats(res.data.requests);

      setLoading((prev) => ({ ...prev, requests: false }));
    } catch (err: any) {
      setLoading((prev) => ({ ...prev, requests: false }));
      console.log(err.response?.data?.error || err.message);
    }
  };

  const acceptChatRequest = async (chatId: string) => {
    try {
      const res = await api.patch("/api/v1/chats/acceptChat", {
        chatRoomId: chatId,
      });

      const acceptedChat = res.data.chat;

      setPendingChats((prev) => prev.filter((chat) => chat._id !== chatId));

      setRegularChats((prev) => [...prev, acceptedChat]);

      console.log("Request Accepted Successfully");
    } catch (err: any) {
      console.log(err.response?.data?.error || err.message);
    }
  };

  useEffect(() => {
    if (activeTab === "requests") {
      fetchPendingRequests();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "chats") {
      myRegularChats();
    }
  }, [activeTab]);

  const filteredChats = activeTab === "chats" ? regularChats : pendingChats;

  const requestCount = pendingChats.length;

  const handleRequestAction = (
    action: "accept" | "delete" | "block",
    chatId: string,
  ) => {
    if (action === "accept") {
      acceptChatRequest(chatId);
    }
  };

  return (
    <div className=" h-full flex flex-col bg-gradient-to-b from-white to-indigo-50/30">
      <ChatTopBar onOpenProfile={onOpenProfile} />

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white">
        <button
          className={`flex-1 py-3 text-center font-medium transition-all duration-300 relative ${
            activeTab === "chats"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("chats")}
        >
          Chats
          {regularChats.length > 0 && (
            <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              {regularChats.length}
            </span>
          )}
        </button>
        <button
          className={`flex-1 py-3 text-center font-medium transition-all duration-300 relative ${
            activeTab === "requests"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("requests")}
        >
          <span className="relative">
            Requests
            {requestCount > 0 && (
              <span className="absolute -top-3 -right-3 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {requestCount}
              </span>
            )}
          </span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-3">
          {/* Search Bar */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder={
                activeTab === "chats" ? "Search chats..." : "Search requests..."
              }
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-sm"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Info Message for Requests */}
          {activeTab === "requests" && pendingChats.length > 0 && (
            <div className="mb-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl">
              <p className="text-sm text-gray-700">
                Open a request to see more info. They won't know you've seen it
                until you accept.
              </p>
              <a
                href="#"
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium inline-block mt-1"
              >
                Decide who can message you
              </a>
            </div>
          )}

          {/* Loading States */}
          {loading[activeTab] ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading...</p>
            </div>
          ) : (
            <>
              {/* Chats/Requests List */}
              <div className="space-y-2">
                {filteredChats.map((chat) => (
                  <ChatRow
                    key={chat._id}
                    chat={chat}
                    onSelectChat={
                      activeTab === "chats" ? onSelectChat : undefined
                    }
                    onRequestAction={
                      activeTab === "requests" ? handleRequestAction : undefined
                    }
                    onOpenProfile={onOpenProfile}
                  />
                ))}
              </div>

              {/* Empty State */}
              {filteredChats.length === 0 && (
                <div className="text-center py-10">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                    {activeTab === "chats" ? (
                      <svg
                        className="h-8 w-8 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    ) : (
                      <svg
                        className="h-8 w-8 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        />
                      </svg>
                    )}
                  </div>
                  <p className="text-gray-500 font-medium">
                    {activeTab === "chats"
                      ? "No chats yet"
                      : "No message requests"}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    {activeTab === "chats"
                      ? "Start a conversation to see chats here"
                      : "When someone sends you a message request, it will appear here"}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatListPanel;
