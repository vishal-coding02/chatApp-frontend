import api from "./axios";

export const getMessagesApi = (
  conversationId: string,
  page: number = 1,
  limit: number = 20,
) => {
  return api.get(`/api/messages/${conversationId}?page=${page}&limit=${limit}`);
};

export const deleteMessageApi = (messageId: string) => {
  return api.delete(`/api/messages/${messageId}`);
};
