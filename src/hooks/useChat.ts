import { socket } from "../socket";
import { useEffect, useState } from "react";
import {
  regularChatReqApi,
  pendingChatReqApi,
  acceptChatReqApi,
  deleteChatApi,
} from "../api/chat.api";

export const useChat = () => {
  const [activeTab, setActiveTab] = useState<"chats" | "requests">("chats");
  const [regularChats, setRegularChats] = useState<any[]>([]);
  const [pendingChats, setPendingChats] = useState<any[]>([]);
  const [loading, setLoading] = useState({
    chats: true,
    requests: false,
  });

  const id = localStorage.getItem("userID");

  const myRegularChats = async () => {
    try {
      setLoading({ chats: true, requests: true });

      const res = await regularChatReqApi();
      const chats = res.data.chats;

      const activeChats = chats.filter((chat: any) => chat.status === "active");

      const myPendingChats = chats.filter(
        (chat: any) => chat.status === "pending" && chat.createdBy === id,
      );

      setRegularChats([...activeChats, ...myPendingChats]);

      setLoading({ chats: false, requests: false });
    } catch (err: any) {
      setLoading({ chats: false, requests: false });
      console.log(err.response?.data?.error || err.message);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      setLoading((prev) => ({ ...prev, requests: true }));

      const res = await pendingChatReqApi();

      setPendingChats(res.data.requests);

      setLoading((prev) => ({ ...prev, requests: false }));
    } catch (err: any) {
      setLoading((prev) => ({ ...prev, requests: false }));
      console.log(err.response?.data?.error || err.message);
    }
  };

  const acceptChatRequest = async (chatId: string) => {
    try {
      const res = await acceptChatReqApi(chatId);

      const acceptedChat = res.data.chat;

      setPendingChats((prev) => prev.filter((chat) => chat._id !== chatId));

      setRegularChats((prev) => [...prev, acceptedChat]);

      console.log("Request Accepted Successfully");
    } catch (err: any) {
      console.log(err.response?.data?.error || err.message);
    }
  };

  const deleteChat = async (chatId: string) => {
    try {
      await deleteChatApi(chatId);

      setRegularChats((prev) => prev.filter((chat) => chat._id !== chatId));

      socket.emit("leaveRoom", chatId);

      console.log("Chat deleted successfully");
    } catch (err: any) {
      console.log(err.response?.data?.error || err.message);
    }
  };

  useEffect(() => {
    if (regularChats.length > 0) {
      regularChats.forEach((chat) => {
        socket.emit("joinRooms", { user: id, room: chat._id });
      });
    }
  }, [regularChats]);

  useEffect(() => {
    socket.on("lastMessage", ({ lastMessage, chatId, lastMessageAt }) => {
      setRegularChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === chatId ? { ...chat, lastMessage, lastMessageAt } : chat,
        ),
      );
    });

    return () => {
      socket.off("lastMessage");
    };
  }, []);

  useEffect(() => {
    if (activeTab === "requests") {
      fetchPendingRequests();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "chats") {
      myRegularChats();
    }
  }, [activeTab]);

  const handleRequestAction = (
    action: "accept" | "delete" | "block",
    chatId: string,
  ) => {
    if (action === "accept") {
      acceptChatRequest(chatId);
    }
  };
  
  return {
    deleteChat,
    activeTab,
    loading,
    setActiveTab,
    pendingChats,
    handleRequestAction,
    regularChats,
  };
};
