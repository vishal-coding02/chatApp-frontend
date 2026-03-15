import api from "./axios";

export const getMessagesApi = (conversationId: string) => {
  return api.get(`/api/messages/${conversationId}`);
};

export const deleteMessageApi = (messageId: string) => {
  return api.delete(`/api/messages/${messageId}`);
};
