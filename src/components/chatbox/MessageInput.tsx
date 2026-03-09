import React, { useState, useRef } from "react";
import { Send } from "lucide-react";
import api from "../../api/axios";
import { socket } from "../../socket";
import { encryptMessage } from "../../utils/encryption";

interface MessageInput {
  chat: any;
}
const MessageInput = ({ chat }: MessageInput) => {
  const [message, setMessage] = useState("");
  const typingTimeout = useRef<any>(null);

  const myId = localStorage.getItem("userID");
  const handleTyping = () => {
    socket.emit("typing", {
      room: chat._id,
      from: myId,
    });

    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    typingTimeout.current = setTimeout(() => {
      socket.emit("stopTyping", {
        room: chat._id,
        from: myId,
      });
    }, 2000);
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      const encryptedMsg = encryptMessage(message);
      const res = await api.post("/api/message/sendMessage", {
        chatRoomId: chat._id,
        text: encryptedMsg,
      });

      const data = res.data;
      console.log(data.message);

      socket.emit("sendMessage", {
        from: myId,
        message: encryptedMsg,
        room: chat._id,
      });

      console.log("message", encryptedMsg);
      setMessage("");

      socket.emit("stopTyping", {
        room: chat._id,
        from: myId,
      });
    } catch (err: any) {
      console.log(err.response?.data?.error || err.message);
    }
  };

  const handleChnage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    handleTyping();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={handleChnage}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            className="w-full min-h-11 max-h-32 px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-sm resize-none align-middle"
            rows={1}
          />
        </div>

        <button
          onClick={handleSend}
          disabled={!message.trim()}
          className={`p-2.5 rounded-xl flex items-center justify-center transition-all duration-300 ${
            message.trim()
              ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg"
              : "bg-linear-to-r from-gray-100 to-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
