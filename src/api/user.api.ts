import api from "./axios";

export const fetchUserProfile = async (userId: string) => {
  const res = await api.get(`/api/users/profile/${userId}`);
  return res.data;
};

export const fetchAllUsersApi = (searchValue: string, pageNumber: number) => {
  return api.get(`/api/users?name=${searchValue}&page=${pageNumber}`);
};
