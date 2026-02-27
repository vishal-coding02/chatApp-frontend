import { ArrowLeft } from "lucide-react";

interface ChatHeaderProps {
  chat: any;
  onBack: () => void;
  onOpenProfile: (userId: string) => void;
}

const ChatHeader = ({ chat, onBack, onOpenProfile }: ChatHeaderProps) => {
  const myId = localStorage.getItem("userID");
  const otherUser = chat?.participants?.find((p: any) => p._id !== myId);

  const chatName = otherUser?.userFullName || "Unknown User";

  const userName = otherUser?.userName;
  const chatAvatar = chatName.charAt(0).toUpperCase();

  return (
    <div className="border-b border-gray-200 p-4 flex items-center justify-between bg-white">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="md:hidden w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>

        <div
          className="w-12 h-12 rounded-full bg-linear-to-r from-indigo-100 to-purple-100 border-2 border-indigo-200 flex items-center justify-center overflow-hidden cursor-pointer"
          onClick={() => onOpenProfile(otherUser._id)}
        >
          {otherUser?.profilePic ? (
            <img
              src={otherUser.profilePic}
              alt={chatName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-lg font-semibold text-indigo-600">
              {chatAvatar}
            </span>
          )}
        </div>

        <div
          className="cursor-pointer"
          onClick={() => otherUser?._id && onOpenProfile(otherUser._id)}
        >
          <p className="font-semibold text-gray-800">{chatName}</p>
          <p className="text-gray-400 text-[14px]">{userName}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
