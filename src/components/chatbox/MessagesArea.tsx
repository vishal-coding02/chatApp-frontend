import { useMessage } from "../../hooks/useMessage";
import { Trash2, Phone, PhoneMissed, PhoneCall } from "lucide-react";

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
    isFetchingMore,
    hasMore,
    activeMessageId,
    handleDeleteMessage,
    handleMessageClick,
    handleScroll,
    formatMessageDate,
  } = useMessage({ chat, typingUser });

  const getCallText = (call: any) => {
    if (call.callStatus === "missed") {
      return "Missed call";
    }
    if (call.callDuration > 0) {
      const mins = Math.floor(call.callDuration / 60);
      const secs = call.callDuration % 60;
      const duration = mins > 0 ? `${mins} min ${secs} sec` : `${secs} sec`;
      return `Call ended • ${duration}`;
    }
    return "Call ended";
  };

  const getCallIcon = (call: any) => {
    if (call.callStatus === "missed") {
      return <PhoneMissed className="h-3.5 w-3.5" />;
    }
    if (call.callType === "audio") {
      return <PhoneCall className="h-3.5 w-3.5" />;
    }
    return <Phone className="h-3.5 w-3.5" />;
  };

  const isCallRecord = (item: any) => {
    return item.callStatus !== undefined;
  };

  return (
    <div
      ref={messagesContainerRef}
      onScroll={handleScroll}
      className="flex-1 p-4 space-y-4 overflow-y-auto bg-linear-to-b from-white to-indigo-50/30"
    >
      <div className="space-y-3">
        {isFetchingMore && (
          <div className="flex justify-center py-2">
            <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!hasMore && messages.length > 0 && (
          <div className="flex justify-center">
            <span className="text-xs text-gray-400 py-1">No more messages</span>
          </div>
        )}

        {messages.map((item, index) => {
          const showDateSeparator =
            index === 0 ||
            new Date(item.createdAt ?? "").toDateString() !==
              new Date(messages[index - 1]?.createdAt ?? "").toDateString();

          if (!isCallRecord(item)) {
            const isMe = item.senderId === myId;
            return (
              <div key={item._id || index}>
                {showDateSeparator && (
                  <div className="flex justify-center my-4">
                    <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                      {formatMessageDate(item.createdAt ?? "")}
                    </div>
                  </div>
                )}

                <div
                  className={`flex flex-col ${isMe ? "items-end" : "items-start"} message-container`}
                >
                  <div
                    onClick={() => handleMessageClick(item._id ?? "")}
                    className={`max-w-[70%] rounded-2xl p-3 text-sm wrap-break-word ${
                      isMe
                        ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-tr-none"
                        : "bg-white border border-gray-200 text-gray-800 rounded-tl-none"
                    }`}
                  >
                    <p>{item.text}</p>
                    <div className="text-xs mt-1 opacity-70">
                      {new Date(item.createdAt ?? "").toLocaleTimeString(
                        "en-US",
                        { hour: "2-digit", minute: "2-digit", hour12: true },
                      )}
                    </div>
                  </div>

                  {isMe && activeMessageId === item._id && (
                    <button
                      onClick={() => handleDeleteMessage(item._id!)}
                      className="delete-btn flex items-center mt-2 gap-1 text-[13px] text-red-500 border border-gray-400 p-1 rounded-[5px] cursor-pointer"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          }

          return (
            <div key={item._id || index}>
              {showDateSeparator && (
                <div className="flex justify-center my-4">
                  <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                    {formatMessageDate(item.createdAt ?? "")}
                  </div>
                </div>
              )}

              <div className="flex justify-center my-2">
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
                  {getCallIcon(item)}
                  <span>{getCallText(item)}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(item.createdAt).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </div>
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
