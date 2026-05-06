import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { socket } from "../socket";
import { decryptMessage } from "../utils/encryption";
import { getMessagesApi, deleteMessageApi } from "../api/message.api";
import api from "../api/axios";

interface UseMessageProps {
  chat: any;
  typingUser: string;
}

export const useMessage = ({ chat, typingUser }: UseMessageProps) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [lastCreatedAt, setLastCreatedAt] = useState<string>("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const myId = useMemo(() => localStorage.getItem("userID"), []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const isAtBottom = useCallback(() => {
    if (!messagesContainerRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } =
      messagesContainerRef.current;
    return Math.abs(scrollHeight - scrollTop - clientHeight) < 5;
  }, []);

  const loadMoreMessages = useCallback(async () => {
    if (!hasMore || isFetchingMore) return;
    setIsFetchingMore(true);

    const container = messagesContainerRef.current;
    const prevScrollHeight = container?.scrollHeight ?? 0;

    try {
      const res = await getMessagesApi(chat._id, lastCreatedAt);

      const decryptedMessages = res.data.messages.map((msg: any) => ({
        ...msg,
        text: decryptMessage(msg.text),
      }));

      setMessages((prev) => [...decryptedMessages, ...prev]);
      setHasMore(res.data.hasMore);

      if (decryptedMessages.length > 0) {
        setLastCreatedAt(decryptedMessages[0].createdAt);
      }

      requestAnimationFrame(() => {
        if (container) {
          const newScrollHeight = container.scrollHeight;
          container.scrollTop = newScrollHeight - prevScrollHeight;
        }
      });
    } catch (err: any) {
      console.log(err.response?.data?.error || err.message);
    } finally {
      setIsFetchingMore(false);
    }
  }, [hasMore, isFetchingMore, chat._id, lastCreatedAt]);

  const handleScroll = useCallback(() => {
    if (!messagesContainerRef.current) return;
    const { scrollTop } = messagesContainerRef.current;
    const atBottom = isAtBottom();
    setShouldAutoScroll(atBottom);

    if (scrollTop === 0 && hasMore && !isFetchingMore) {
      loadMoreMessages();
    }
  }, [isAtBottom, hasMore, isFetchingMore, loadMoreMessages]);

  const fetchCallRecords = async () => {
    try {
      const res = await api.get(`/api/calls/history/${chat?._id}`);
      const data = res.data;
      if (data.success) {
        return data.calls;
      }
      return [];
    } catch (err: any) {
      console.log(err.response?.data?.error || err.message);
      return [];
    }
  };

  const handleGetMessages = useCallback(async () => {
    try {
      const [messagesRes, callRecords] = await Promise.all([
        getMessagesApi(chat._id),
        fetchCallRecords(),
      ]);

      const decryptedMessages = messagesRes.data.messages.map((msg: any) => ({
        ...msg,
        text: decryptMessage(msg.text),
      }));

      const allItems = [...decryptedMessages, ...callRecords].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );

      setMessages(allItems);
      setHasMore(messagesRes.data.hasMore);

      if (decryptedMessages.length > 0) {
        setLastCreatedAt(decryptedMessages[0].createdAt);
      }

      setTimeout(() => {
        scrollToBottom();
        setShouldAutoScroll(true);
      }, 100);
    } catch (err: any) {
      console.log(err.response?.data?.error || err.message);
    }
  }, [chat._id, scrollToBottom]);

  const formatMessageDate = useCallback((dateString: string) => {
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
  }, []);

  const handleDeleteMessage = useCallback(
    async (messageId: string) => {
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
    },
    [chat._id],
  );

  const handleMessageClick = useCallback((messageId: string) => {
    setActiveMessageId((prevId) => (prevId === messageId ? null : messageId));
  }, []);

  useEffect(() => {
    if (!chat?._id) return;

    const handleNewCallRecord = (newCall: any) => {
      if (newCall.chatId === chat._id) {
        setMessages((prev) => {
          const exists = prev.some((item: any) => item._id === newCall._id);
          if (exists) return prev;

          const newMessages = [...prev, newCall].sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          );
          return newMessages;
        });

        setTimeout(() => scrollToBottom(), 100);
      }
    };

    socket.on("call-record-saved", handleNewCallRecord);

    return () => {
      socket.off("call-record-saved", handleNewCallRecord);
    };
  }, [chat._id, scrollToBottom]);

  useEffect(() => {
    if (shouldAutoScroll) {
      scrollToBottom();
    }
  }, [messages, typingUser, shouldAutoScroll, scrollToBottom]);

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
  }, [chat._id, handleGetMessages]);

  useEffect(() => {
    if (!chat?._id) return;

    socket.on("message", (newMsg) => {
      const decrypted = decryptMessage(newMsg.message);

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
  }, [chat._id]);

  return {
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
  };
};
