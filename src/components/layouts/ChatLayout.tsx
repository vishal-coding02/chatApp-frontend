import { useState } from "react";
import LeftSidebar from "../layouts/LeftSidebar";
import ChatListPanel from "../layouts/ChatListPanel";
import ChatBox from "../layouts/ChatBox";

const ChatLayout = () => {
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [showChatBox, setShowChatBox] = useState<boolean>(false);

  const handleSelectChat = (chat: any) => {
    setSelectedChat(chat);
    setShowChatBox(true);
  };

  const handleBackToList = () => {
    setShowChatBox(false);
    setSelectedChat(null);
  };

  return (
    <div className="h-screen w-full flex bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Left Sidebar - Always visible */}
      <div className="w-[22%] border-r border-gray-100">
        <LeftSidebar />
      </div>

      {/* Middle Chat List - Always visible */}
      <div className="w-[38%] border-r border-gray-100">
        <ChatListPanel onSelectChat={handleSelectChat} />
      </div>

      {/* Right Chat Box - Only shows when chat is selected */}
      <div className={`w-[40%] transition-all duration-300 ${showChatBox ? 'opacity-100' : 'opacity-0 hidden'}`}>
        {selectedChat && (
          <ChatBox chat={selectedChat} onBack={handleBackToList} />
        )}
      </div>

      {/* Placeholder when no chat is selected */}
      {!showChatBox && (
        <div className="w-[40%] flex items-center justify-center bg-white/50 border-l border-gray-100">
          <div className="text-center p-8">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
              <svg className="h-12 w-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Welcome to ChatHub</h3>
            <p className="text-gray-600 mb-4">Select a chat to start messaging</p>
            <p className="text-sm text-gray-500">Click on any conversation to open it here</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatLayout;