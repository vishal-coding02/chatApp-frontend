import { Check, CheckCheck } from "lucide-react";

interface MessagesArea {
  chat: any;
}

const MessagesArea = ({ chat }: MessagesArea) => {
  const messages = [
    {
      id: 1,
      text: "Hello! How are you doing today? 😊",
      time: "9:30 AM",
      isMe: false,
      status: "read",
    },
    {
      id: 2,
      text: "I'm doing great! Just finished the project. What about you?",
      time: "9:31 AM",
      isMe: true,
      status: "delivered",
    },
    {
      id: 3,
      text: "That's awesome! Let's catch up for coffee tomorrow? ☕",
      time: "9:32 AM",
      isMe: false,
      status: "read",
    },
    {
      id: 4,
      text: "Sure, 3 PM at the usual place?",
      time: "9:33 AM",
      isMe: true,
      status: "read",
    },
    {
      id: 5,
      text: "Perfect! See you there! 👋",
      time: "9:34 AM",
      isMe: false,
      status: "read",
    },
  ];

  return (
    <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gradient-to-b from-white to-indigo-50/30">
      {/* Date Separator */}
      <div className="text-center">
        <span className="inline-block px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 text-xs font-medium rounded-full">
          Today
        </span>
      </div>

      {/* Messages */}
      <div className="space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] rounded-2xl p-3 text-sm relative ${
                message.isMe
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-none"
                  : "bg-white border border-gray-200 text-gray-800 rounded-tl-none"
              }`}
            >
              <p className="whitespace-pre-wrap break-words">{message.text}</p>

              {/* Message Footer */}
              <div
                className={`flex items-center justify-end gap-2 mt-2 ${
                  message.isMe ? "text-indigo-200" : "text-gray-500"
                }`}
              >
                <span className="text-xs">{message.time}</span>
                {message.isMe && (
                  <span className="text-xs">
                    {message.status === "read" ? (
                      <CheckCheck className="h-3 w-3" />
                    ) : (
                      <Check className="h-3 w-3" />
                    )}
                  </span>
                )}
              </div>

              {/* Tail */}
              <div
                className={`absolute w-3 h-3 ${
                  message.isMe ? "-right-3 top-0" : "-left-3 top-0"
                }`}
              >
                <div
                  className={`w-full h-full ${
                    message.isMe
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600"
                      : "bg-white border-l border-b border-gray-200"
                  } ${message.isMe ? "rounded-bl-full" : "rounded-br-full"}`}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Typing Indicator */}
      <div className="flex justify-start">
        <div className="max-w-[70%] rounded-2xl rounded-tl-none p-3 text-sm bg-white border border-gray-200">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        </div>
      </div>

      {/* New Message Alert */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-full">
          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></div>
          <span className="text-xs font-medium text-indigo-700">
            New messages
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessagesArea;
