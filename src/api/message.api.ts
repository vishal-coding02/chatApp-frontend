import api from "./axios";

export const getMessagesApi = (
  conversationId: string,
  lastCreatedAt?: string,
  limit: number = 20,
) => {
  let url = `/api/messages/${conversationId}?limit=${limit}`;

  if (lastCreatedAt) {
    url += `&lastCreatedAt=${lastCreatedAt}`;
  }

  return api.get(url);
};

export const deleteMessageApi = (messageId: string) => {
  return api.delete(`/api/messages/${messageId}`);
};
