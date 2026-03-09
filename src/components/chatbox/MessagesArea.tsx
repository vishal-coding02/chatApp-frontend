import api from "../../api/axios";
import { useEffect, useState, useRef } from "react";
import type { Message } from "../../interfaces";
import { socket } from "../../socket";
import { decryptMessage } from "../../utils/encryption";

interface MessagesAreaProps {
  chat: any;
  typingUser: string;
  typingRoom: string;
}

const MessagesArea = ({ chat, typingUser, typingRoom }: MessagesAreaProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const myId = localStorage.getItem("userID");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const isAtBottom = () => {
    if (!messagesContainerRef.current) return true;

    const { scrollTop, scrollHeight, clientHeight } =
      messagesContainerRef.current;
    return Math.abs(scrollHeight - scrollTop - clientHeight) < 5;
  };

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const atBottom = isAtBottom();
      setShouldAutoScroll(atBottom);
    }
  };

  useEffect(() => {
    if (shouldAutoScroll) {
      scrollToBottom();
    }
  }, [messages, typingUser]);

  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
  };

  const handleGetMessages = async () => {
    try {
      const res = await api.get(`/api/message/${chat._id}`);
      const decryptedMessages = res.data.messages.map((msg: any) => ({
        ...msg,
        text: decryptMessage(msg.text),
      }));

      setMessages(decryptedMessages);
      setTimeout(() => {
        scrollToBottom();
        setShouldAutoScroll(true);
      }, 100);
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
      const decrypted = decryptMessage(newMsg.message);
      setMessages((prev) => [
        ...prev,
        {
          _id: newMsg._id,
          senderId: newMsg.from,
          text: decrypted,
          createdAt: new Date().toISOString(),
        },
      ]);
    });

    return () => {
      socket.off("message");
    };
  }, [chat]);

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
            new Date(message.createdAt).toDateString() !==
              new Date(messages[index - 1].createdAt).toDateString();

          return (
            <div key={message._id}>
              {showDateSeparator && (
                <div className="flex justify-center my-4">
                  <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                    {formatMessageDate(message.createdAt)}
                  </div>
                </div>
              )}

              {/* Message */}
              <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[70%] rounded-2xl p-3 text-sm relative ${
                    isMe
                      ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-tr-none"
                      : "bg-white border border-gray-200 text-gray-800 rounded-tl-none"
                  }`}
                >
                  <p className="whitespace-pre-wrap wrap-break-word">
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
            </div>
          );
        })}

        {/* Typing Indicator */}
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

        {/* Scroll Anchor */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessagesArea;
