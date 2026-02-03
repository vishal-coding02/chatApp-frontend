import { useState } from "react";
import ChatTopBar from "../chats/ChatTopBar";
import ChatRow from "../chats/ChatRow";

interface ChatListPanelProps {
  onSelectChat: (chat: any) => void;
}

const ChatListPanel = ({ onSelectChat }: ChatListPanelProps) => {
  const [activeTab, setActiveTab] = useState<"chats" | "requests">("chats");
  
  // Combined data - requests and regular chats
  const [allChats, setAllChats] = useState([
    // Regular chats
    { id: 1, name: "Vishal", lastMessage: "Hello bhai...", unread: 3, time: "2m ago", avatar: "V", isRequest: false },
    { id: 2, name: "Rahul", lastMessage: "Meeting at 5 PM", unread: 0, time: "1h ago", avatar: "R", isRequest: false },
    { id: 3, name: "Priya", lastMessage: "Sent you a file", unread: 1, time: "3h ago", avatar: "P", isRequest: false },
    { id: 4, name: "Amit", lastMessage: "Thanks for the help!", unread: 0, time: "5h ago", avatar: "A", isRequest: false },
    { id: 5, name: "Neha", lastMessage: "Are you coming?", unread: 2, time: "1d ago", avatar: "N", isRequest: false },
    
    // Message requests
    { id: 6, name: "Vipul Tyagi", username: "engineeringdigest.in", lastMessage: "Requested DSA Program is below 🚀", unread: 1, time: "2d ago", avatar: "V", isRequest: true },
    { id: 7, name: "mycodeshala", username: "mycodeshala", lastMessage: "Check out our new course!", unread: 1, time: "3d ago", avatar: "M", isRequest: true },
    { id: 8, name: "Rithik Agarwal", username: "rithik.dev", lastMessage: "Hey, let's connect!", unread: 0, time: "5d ago", avatar: "R", isRequest: true },
    { id: 9, name: "Pratyush Pandey", username: "pratyush.codes", lastMessage: "Regarding the project discussion", unread: 0, time: "6d ago", avatar: "P", isRequest: true },
  ]);

  // Filter chats based on active tab
  const filteredChats = allChats.filter(chat => 
    activeTab === "chats" ? !chat.isRequest : chat.isRequest
  );

  // Calculate request count
  const requestCount = allChats.filter(chat => chat.isRequest && chat.unread > 0).length;

  const handleRequestAction = (action: "accept" | "delete" | "block", chatId: number) => {
    if (action === "accept") {
      // Convert request to regular chat
      setAllChats(prev => prev.map(chat => 
        chat.id === chatId ? { ...chat, isRequest: false, unread: 0 } : chat
      ));
    } else {
      // Delete or block the request
      setAllChats(prev => prev.filter(chat => chat.id !== chatId));
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-white to-indigo-50/30">
      <ChatTopBar />

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white">
        <button
          className={`flex-1 py-3 text-center font-medium transition-all duration-300 relative ${
            activeTab === 'chats'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('chats')}
        >
          Chats
        </button>
        <button
          className={`flex-1 py-3 text-center font-medium transition-all duration-300 relative ${
            activeTab === 'requests'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('requests')}
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
              placeholder={activeTab === "chats" ? "Search chats..." : "Search requests..."}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-sm"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Info Message for Requests */}
          {activeTab === "requests" && (
            <div className="mb-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl">
              <p className="text-sm text-gray-700">
                Open a request to see more info. They won't know you've seen it until you accept.
              </p>
              <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium inline-block mt-1">
                Decide who can message you
              </a>
            </div>
          )}

          {/* Chats/Requests List */}
          <div className="space-y-2">
            {filteredChats.map((chat) => (
              <ChatRow
                key={chat.id}
                chat={chat}
                onSelectChat={activeTab === "chats" ? onSelectChat : undefined}
                onRequestAction={activeTab === "requests" ? handleRequestAction : undefined}
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredChats.length === 0 && (
            <div className="text-center py-10">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                {activeTab === "chats" ? (
                  <svg className="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"></path>
                  </svg>
                ) : (
                  <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                )}
              </div>
              <p className="text-gray-500 font-medium">
                {activeTab === "chats" ? "No chats yet" : "No message requests"}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {activeTab === "chats" 
                  ? "Start a conversation to see chats here" 
                  : "When someone sends you a message request, it will appear here"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatListPanel;