import { useState } from "react";
import LeftSidebar from "../layouts/LeftSidebar";
import ChatListPanel from "../layouts/ChatListPanel";
import ChatBox from "../layouts/ChatBox";
import { UserRoundPlus } from "lucide-react";
import UserProfile from "../UserProfile";

const ChatLayout = () => {
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [showChatBox, setShowChatBox] = useState<Boolean>(false);
  const [showSideBar, setShowSideBar] = useState<Boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const openProfile = (id: string) => {
    setSelectedUserId(id);
    setIsProfileOpen(true);
  };

  const closeProfile = () => {
    setIsProfileOpen(false);
    setSelectedUserId("");
  };

  const handleSelectChat = (chat: any) => {
    setSelectedChat(chat);
    setShowChatBox(true);
  };

  const handleBackToList = () => {
    setShowChatBox(false);
    setSelectedChat(null);
  };

  return (
    <div className="h-screen w-full flex bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative">
      <div
        className={`hidden md:flex w-[22%] h-full flex-col flex-shrink-0  border-r border-gray-100`}
      >
        <LeftSidebar onOpenProfile={openProfile} />
      </div>

      <div
        className={`
    fixed top-0 left-0 h-full w-[75%] bg-white z-50
    transform transition-transform duration-300
    ${showSideBar ? "translate-x-0" : "-translate-x-full"}
    md:hidden
  `}
      >
        <LeftSidebar onOpenProfile={openProfile} />
      </div>

      {showSideBar && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setShowSideBar(false)}
        />
      )}

      <div
        className={`${selectedChat ? "hidden md:flex" : "flex"} w-full md:w-[38%]  border-r border-gray-100 flex  flex-col h-full`}
      >
        <ChatListPanel
          onSelectChat={handleSelectChat}
          onOpenProfile={openProfile}
        />
      </div>

      <div
        className={`w-full md:w-[40%] h-full transition-all duration-300 ${showChatBox ? "opacity-100" : "opacity-0 hidden"}`}
      >
        {selectedChat && (
          <ChatBox
            chat={selectedChat}
            onBack={handleBackToList}
            onOpenProfile={openProfile}
          />
        )}
      </div>

      <div
        className={`${selectedChat && "hidden"} fixed bottom-8 right-5 z-50 md:hidden 
  bg-gradient-to-r from-indigo-500 to-purple-600 
  p-4 rounded-full shadow-lg cursor-pointer`}
      >
        <UserRoundPlus
          className="text-white w-6 h-6"
          onClick={() => setShowSideBar(true)}
        />
      </div>

      {!showChatBox && (
        <div className="hidden md:flex w-[40%] h-full items-center justify-center bg-white/50 border-l border-gray-100">
          <div className="text-center p-8">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
              <svg
                className="h-12 w-12 text-gray-400"
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
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Welcome to ChatHub
            </h3>
            <p className="text-gray-600 mb-4">
              Select a chat to start messaging
            </p>
            <p className="text-sm text-gray-500">
              Click on any conversation to open it here
            </p>
          </div>
        </div>
      )}

      {isProfileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center"
          onClick={closeProfile}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <UserProfile userId={selectedUserId} onClose={closeProfile} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatLayout;
