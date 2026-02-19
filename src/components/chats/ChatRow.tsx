import { Trash2, Clock, UserPlus, Check, X, User, Lock } from "lucide-react";
import { useState } from "react";

interface ChatRowProps {
  chat: {
    _id: string;
    lastMessage: string;
    isRequest?: boolean;
    participants?: any[];
    createdBy?: string;
    lastMessageAt?: string;
    status?: string;
  };
  onOpenProfile: (userId: string) => void;

  onSelectChat?: (chat: any) => void;
  onRequestAction?: (
    action: "accept" | "delete" | "block",
    chatId: string,
  ) => void;
}

const ChatRow = ({
  chat,
  onSelectChat,
  onRequestAction,
  onOpenProfile,
}: ChatRowProps) => {
  const [showRequestActions, setShowRequestActions] = useState(false);

  const myId = localStorage.getItem("userID");

  const isRequest = chat.status === "pending" && chat.createdBy !== myId;

  const otherUser = chat.participants?.find((p: any) => p._id !== myId);

  const chatName = otherUser?.userFullName || "Unknown User";

  const chatAvatar = chatName.charAt(0).toUpperCase();

  const messageTime = chat.lastMessageAt
    ? new Date(chat.lastMessageAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const handleClick = () => {
    if (isRequest) {
      setShowRequestActions(!showRequestActions);
    } else if (onSelectChat) {
      onSelectChat(chat);
    }
  };

  const handleAction = (action: "accept" | "delete" | "block") => {
    if (onRequestAction) {
      onRequestAction(action, chat._id);
      setShowRequestActions(false);
    }
  };

  return (
    <div
      className={`bg-white border rounded-xl p-4 transition-all duration-300 ${
        isRequest
          ? "border-yellow-200 hover:border-yellow-300 cursor-pointer"
          : "border-gray-200 hover:border-indigo-300 hover:shadow-sm cursor-pointer"
      } ${
        showRequestActions
          ? "bg-gradient-to-r from-yellow-50/50 to-orange-50/50"
          : ""
      }`}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between">
        {/* Left Side - User Info */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isRequest
                  ? "bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-300"
                  : "bg-gradient-to-r from-indigo-100 to-purple-100 border-2 border-indigo-200"
              }`}
            >
              {isRequest ? (
                <UserPlus className="h-5 w-5 text-yellow-600" />
              ) : (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    if (otherUser?._id) {
                      onOpenProfile(otherUser._id);
                    }
                  }}
                  className="text-sm font-semibold text-indigo-600"
                >
                  {chatAvatar}
                </span>
              )}
            </div>

            {/* Indicators */}
            {isRequest && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                !
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="font-semibold text-gray-800">{chatName}</p>

              {isRequest && (
                <span className="text-xs px-2 py-1 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 rounded-full">
                  Request
                </span>
              )}
            </div>

            <p className="text-sm text-gray-600">
              {isRequest
                ? `Sent a message request`
                : chat.lastMessage || "Start a conversation..."}
            </p>

            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {messageTime}
            </p>
          </div>
        </div>

        {/* Right Side - Buttons */}
        <div>
          {isRequest ? (
            <div className="flex items-center gap-2">
              {showRequestActions ? (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAction("accept");
                    }}
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white flex items-center justify-center"
                  >
                    <Check className="h-5 w-5" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAction("delete");
                    }}
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white flex items-center justify-center"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAction("block");
                    }}
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-500 to-gray-600 text-white flex items-center justify-center"
                  >
                    <Lock className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <button className="px-4 py-2 bg-indigo-50 text-indigo-700 text-sm rounded-xl">
                  View
                </button>
              )}
            </div>
          ) : (
            <button
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
              onClick={(e) => {
                e.stopPropagation();
                console.log("Delete chat", chat._id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Expanded Request Details */}
      {isRequest && showRequestActions && (
        <div className="mt-4 pt-4 border-t border-yellow-200">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>{chatName}</span>
            </div>

            <div className="bg-yellow-50 border rounded-lg p-3">
              <p className="text-sm text-gray-700 mb-2">
                {chat.lastMessage || "No message yet"}
              </p>
              <p className="text-xs text-gray-500">
                They won't know you've seen it until you accept
              </p>
            </div>

            <div className="text-center text-xs text-gray-500">
              Accept to start chatting
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatRow;
