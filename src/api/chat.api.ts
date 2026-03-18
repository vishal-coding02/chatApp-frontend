import api from "../api/axios";

export const regularChatReqApi = () => {
  return api.get(`/api/chats`);
};

export const pendingChatReqApi = () => {
  return api.get("/api/chats/requests");
};

export const acceptChatReqApi = (chatId: string) => {
  return api.patch(`/api/chats/${chatId}/accept`);
};

export const deleteChatApi = (chatId: string) => {
  return api.delete(`/api/chats/${chatId}`);
};
