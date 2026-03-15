import api from "./axios";

export const loginUser = async (data: { email: string; password: string }) => {
  const res = await api.post("/api/auth/login", data);
  return res.data;
};

export const signUpUser = async (data: {
  fullname: string;
  username: string;
  email: string;
  password: string;
  profilePic: string;
}) => {
  const res = await api.post("/api/auth/signup", data);
  return res.data;
};
