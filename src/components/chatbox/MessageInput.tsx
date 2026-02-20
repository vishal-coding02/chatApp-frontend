import { useState } from "react";
import { Send, Smile, Paperclip, Mic } from "lucide-react";
import api from "../../api/axios";
import { socket } from "../../socket";
import { encryptMessage } from "../../utils/encryption";

interface MessageInput {
  chat: any;
}
const MessageInput = ({ chat }: MessageInput) => {
  const [message, setMessage] = useState("");

  const myId = localStorage.getItem("userID");

  const handleSend = async () => {
    if (message == "") {
      alert("please fill input filed");
    }

    try {
      const encryptedMsg = encryptMessage(message);
      const res = await api.post("/api/v1/message/sendMessage", {
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
    } catch (err: any) {
      console.log(err.response?.data?.error || err.message);
    }
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
        <button className="p-2.5 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-300 hover:from-gray-100 hover:to-gray-200 transition-all duration-300">
          <Paperclip className="h-5 w-5 text-gray-600" />
        </button>

        <button className="p-2.5 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-300 hover:from-gray-100 hover:to-gray-200 transition-all duration-300">
          <Smile className="h-5 w-5 text-gray-600" />
        </button>

        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            className="w-full min-h-[44px] max-h-32 px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-sm resize-none align-middle"
            rows={1}
          />

          {!message.trim() && (
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-indigo-600">
              <Mic className="h-5 w-5" />
            </button>
          )}
        </div>

        <button
          onClick={handleSend}
          disabled={!message.trim()}
          className={`p-2.5 rounded-xl flex items-center justify-center transition-all duration-300 ${
            message.trim()
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg"
              : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
