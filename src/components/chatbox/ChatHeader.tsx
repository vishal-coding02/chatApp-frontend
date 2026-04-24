// ChatHeader.tsx
import { ArrowLeft, Phone } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { startCall } from "../../redux/reducer/CallReducer";
import { socket } from "../../socket";

interface ChatHeaderProps {
  chat: any;
  onBack: () => void;
  onOpenProfile: (userId: string) => void;
}

const ChatHeader = ({ chat, onBack, onOpenProfile }: ChatHeaderProps) => {
  const dispatch = useDispatch();

  const myId = localStorage.getItem("userID");
  const onlineUsers = useSelector((state: any) => state.online?.onlineUsers);
  const otherUser = chat?.participants?.find((p: any) => p._id !== myId);

  const chatName = otherUser?.userFullName || "Unknown User";
  const userName = otherUser?.userName;
  const chatAvatar = chatName.charAt(0).toUpperCase();
  const isOnline = onlineUsers?.includes(otherUser?._id);
  const myUser = chat?.participants?.find((p: any) => p._id === myId);

  const handleCall = () => {
    dispatch(
      startCall({
        caller: {
          id: myUser?._id,
          name: myUser?.userFullName,
        },
        receiver: {
          id: otherUser?._id,
          name: otherUser?.userFullName,
        },
        type: "audio",
      }),
    );
    socket.emit("call:initiate", {
      to: otherUser?._id,
      from: myUser?._id,
      callerName: myUser?.userFullName || "Unknown",
      callType: "audio",
      chatId: chat._id,
    });
  };

  return (
    <div className="border-b border-gray-200 p-4 flex items-center justify-between bg-white">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="md:hidden w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>

        <div className="relative">
          <div
            className="w-12 h-12 rounded-full bg-linear-to-r from-indigo-100 to-purple-100 border-2 border-indigo-200 flex items-center justify-center overflow-hidden cursor-pointer"
            onClick={() => onOpenProfile(otherUser?._id)}
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
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
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

      {/* Call Button - Added here */}
      <button
        onClick={handleCall}
        className="w-10 h-10 rounded-full bg-[#0f3460] flex items-center justify-center hover:bg-[#1a4a7a] transition-colors cursor-pointer"
      >
        <Phone className="w-5 h-5 text-white" />
      </button>
    </div>
  );
};

export default ChatHeader;
