import { useEffect, useState, useRef } from "react";
import type { Message } from "../interfaces/index";
import { socket } from "../socket";
import { decryptMessage } from "../utils/encryption";
import { getMessagesApi, deleteMessageApi } from "../api/message.api";

interface UseMessageProps {
  chat: any;
  typingUser: string;
}

export const useMessage = ({ chat, typingUser }: UseMessageProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);

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

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleGetMessages = async () => {
    try {
      const res = await getMessagesApi(chat._id);

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

  const handleDeleteMessage = async (messageId: string) => {
    setMessages((prev) => prev.filter((m) => m._id !== messageId));
    setActiveMessageId(null);

    try {
      const res = await deleteMessageApi(messageId);

      socket.emit("deleteMessage", { messageId, room: chat._id });

      const updatedChat = res.data.updatedChat;
      if (updatedChat) {
        socket.emit("lastMessageUpdate", {
          room: chat._id,
          chatId: chat._id,
          lastMessage: updatedChat.lastMessage,
          lastMessageAt: updatedChat.lastMessageAt,
        });
      }
    } catch (err: any) {
      console.log(err.response?.data?.error || err.message);
    }
  };

  const handleMessageClick = (messageId: string) => {
    setActiveMessageId((prevId) => (prevId === messageId ? null : messageId));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (
        !target.closest(".message-container") &&
        !target.closest(".delete-btn")
      ) {
        setActiveMessageId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    socket.on("messageDeleted", ({ messageId }) => {
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
    });

    return () => {
      socket.off("messageDeleted");
    };
  }, []);

  useEffect(() => {
    if (chat?._id) {
      handleGetMessages();
    }
  }, [chat]);

  useEffect(() => {
    if (!chat?._id) return;

    socket.on("message", (newMsg) => {
      const decrypted = decryptMessage(newMsg.message);
      console.log(newMsg.messageId);

      setMessages((prev) => [
        ...prev,
        {
          _id: newMsg.messageId,
          senderId: newMsg.from,
          text: decrypted,
          createdAt: new Date().toString(),
        },
      ]);
    });

    return () => {
      socket.off("message");
    };
  }, [chat]);

  return {
    messages,
    messagesContainerRef,
    messagesEndRef,
    myId,
    activeMessageId,
    handleDeleteMessage,
    handleMessageClick,
    handleScroll,
    formatMessageDate,
  };
};
