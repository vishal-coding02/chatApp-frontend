// import { Check, CheckCheck } from "lucide-react";
import api from "../../api/axios";
import { useEffect, useState } from "react";
import type { Message } from "../../interfaces";
import { socket } from "../../socket";

interface MessagesAreaProps {
  chat: any;
}

const MessagesArea = ({ chat }: MessagesAreaProps) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const myId = localStorage.getItem("userID");

  const handleGetMessages = async () => {
    try {
      const res = await api.get(`/api/v1/message/${chat._id}`);
      setMessages(res.data.messages);
    } catch (err: any) {
      console.log(err.response?.data?.error || err.message);
    }
  };

  useEffect(() => {
    if (chat?._id) {
      handleGetMessages();
    }
  }, [chat]);

  useEffect(() => {
    if (!chat?._id) return;

    socket.emit("joinRooms", {
      user: myId,
      room: chat._id,
    });

    socket.on("message", (newMsg) => {
      setMessages((prev) => [
        ...prev,
        {
          _id: newMsg._id,
          senderId: newMsg.from,
          text: newMsg.message,
          createdAt: new Date().toISOString(),
        },
      ]);
    });

    return () => {
      socket.off("message");
    };
  }, [chat]);

  return (
    <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gradient-to-b from-white to-indigo-50/30">
      <div className="space-y-3">
        {messages.map((message) => {
          const isMe = message.senderId === myId;

          return (
            <div
              key={message._id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl p-3 text-sm relative ${
                  isMe
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-none"
                    : "bg-white border border-gray-200 text-gray-800 rounded-tl-none"
                }`}
              >
                <p className="whitespace-pre-wrap break-words">
                  {message.text}
                </p>

                {/* Time */}
                <div
                  className={`flex items-center justify-end gap-2 mt-2 ${
                    isMe ? "text-indigo-200" : "text-gray-500"
                  }`}
                >
                  <span className="text-xs">
                    {message.createdAt &&
                      new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MessagesArea;
