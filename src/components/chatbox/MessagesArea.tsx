import { useMessage } from "../../hooks/useMessage";
import { Trash2 } from "lucide-react";

interface MessagesAreaProps {
  chat: any;
  typingUser: string;
  typingRoom: string;
}

const MessagesArea = ({ chat, typingUser, typingRoom }: MessagesAreaProps) => {
  const {
    messages,
    messagesContainerRef,
    messagesEndRef,
    myId,
    activeMessageId,
    handleDeleteMessage,
    handleMessageClick,
    handleScroll,
    formatMessageDate,
  } = useMessage({ chat, typingUser });

  return (
    <div
      ref={messagesContainerRef}
      onScroll={handleScroll}
      className="flex-1 p-4 space-y-4 overflow-y-auto bg-linear-to-b from-white to-indigo-50/30"
    >
      <div className="space-y-3">
        {messages.map((message, index) => {
          const isMe = message.senderId === myId;

          const showDateSeparator =
            index === 0 ||
            new Date(message.createdAt ?? "").toDateString() !==
              new Date(messages[index - 1].createdAt ?? "").toDateString();

          return (
            <div key={message._id || index}>
              {showDateSeparator && (
                <div className="flex justify-center my-4">
                  <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                    {formatMessageDate(message.createdAt ?? "")}
                  </div>
                </div>
              )}

              <div
                className={`flex flex-col ${isMe ? "items-end" : "items-start"} message-container`}
              >
                <div
                  onClick={() => handleMessageClick(message._id ?? "")}
                  className={`max-w-[70%] rounded-2xl p-3 text-sm ${
                    isMe
                      ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-tr-none"
                      : "bg-white border border-gray-200 text-gray-800 rounded-tl-none"
                  }`}
                >
                  <p>{message.text}</p>

                  <div className="text-xs mt-1 opacity-70">
                    {new Date(message.createdAt ?? "").toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                {isMe && activeMessageId === message._id && (
                  <button
                    onClick={() => handleDeleteMessage(message._id!)}
                    className="delete-btn flex items-center mt-2 gap-1 text-[13px] text-red-500 border border-gray-400 p-1 rounded-[5px] cursor-pointer"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {typingUser && typingUser !== myId && typingRoom == chat._id && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 text-gray-600 px-4 py-3 rounded-2xl rounded-tl-none shadow-xs">
              <div className="flex items-center gap-1.5">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessagesArea;
