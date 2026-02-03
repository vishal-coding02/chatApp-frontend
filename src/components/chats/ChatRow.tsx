import { MessageCircle, Trash2, Clock, UserPlus, Check, X, AlertCircle, User, Lock } from "lucide-react";
import { useState } from "react";

interface ChatRowProps {
  chat: {
    id: number;
    name: string;
    username?: string;
    lastMessage: string;
    unread: number;
    time: string;
    avatar: string;
    isRequest?: boolean; // New flag for request
    status?: "pending" | "accepted" | "blocked"; // Request status
  };
  onSelectChat?: (chat: any) => void;
  onRequestAction?: (action: "accept" | "delete" | "block", chatId: number) => void;
}

const ChatRow = ({ chat, onSelectChat, onRequestAction }: ChatRowProps) => {
  const [showRequestActions, setShowRequestActions] = useState(false);
  const isRequest = chat.isRequest || false;

  const handleClick = () => {
    if (isRequest) {
      setShowRequestActions(!showRequestActions);
    } else if (onSelectChat) {
      onSelectChat(chat);
    }
  };

  const handleAction = (action: "accept" | "delete" | "block") => {
    if (onRequestAction) {
      onRequestAction(action, chat.id);
      setShowRequestActions(false);
    }
  };

  return (
    <div 
      className={`bg-white border rounded-xl p-4 transition-all duration-300 ${
        isRequest 
          ? 'border-yellow-200 hover:border-yellow-300 cursor-pointer' 
          : 'border-gray-200 hover:border-indigo-300 hover:shadow-sm cursor-pointer'
      } ${showRequestActions ? 'bg-gradient-to-r from-yellow-50/50 to-orange-50/50' : ''}`}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between">
        {/* Left Side - User Info */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isRequest 
                ? 'bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-300' 
                : 'bg-gradient-to-r from-indigo-100 to-purple-100 border-2 border-indigo-200'
            }`}>
              {isRequest ? (
                <UserPlus className="h-5 w-5 text-yellow-600" />
              ) : (
                <span className="text-sm font-semibold text-indigo-600">{chat.avatar}</span>
              )}
            </div>
            
            {/* Indicators */}
            {!isRequest && chat.unread > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                {chat.unread}
              </div>
            )}
            {isRequest && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                !
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="font-semibold text-gray-800">{chat.name}</p>
              {isRequest && (
                <span className="text-xs px-2 py-1 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 rounded-full">
                  Request
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600">
              {isRequest ? `Sent a message • ${chat.time}` : chat.lastMessage}
            </p>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {chat.time}
            </p>
          </div>
        </div>

        {/* Right Side - Buttons/Info */}
        <div>
          {isRequest ? (
            // Request buttons
            <div className="flex items-center gap-2">
              {showRequestActions ? (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAction('accept');
                    }}
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white flex items-center justify-center hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-sm"
                    title="Accept"
                  >
                    <Check className="h-5 w-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAction('delete');
                    }}
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white flex items-center justify-center hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-sm"
                    title="Delete"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAction('block');
                    }}
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-500 to-gray-600 text-white flex items-center justify-center hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-sm"
                    title="Block"
                  >
                    <Lock className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <button className="px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 text-sm font-medium rounded-xl hover:from-indigo-100 hover:to-purple-100 transition-all duration-300 border border-indigo-200">
                  View
                </button>
              )}
            </div>
          ) : (
            // Regular chat button
            <button 
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300"
              onClick={(e) => {
                e.stopPropagation();
                console.log("Delete chat", chat.id);
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
              <span>{chat.username || chat.name}</span>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-gray-700 mb-2">{chat.lastMessage}</p>
              <p className="text-xs text-gray-500">They won't know you've seen it until you accept</p>
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