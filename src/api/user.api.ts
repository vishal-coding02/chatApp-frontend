import api from "./axios";

export const fetchUserProfile = async () => {
  const res = await api.get(`/api/users/profile`);
  return res.data;
};
