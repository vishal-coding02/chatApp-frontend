import { useLogout } from "../components/sidebar/LogoutButton";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { regularChatReqApi } from "../api/chat.api";
import { fetchAllUsersApi } from "../api/user.api";

export const useSideBar = () => {
  const logout = useLogout();
  const token = useSelector((state: any) => state.auth.jwtToken);
  const currentUserId = localStorage.getItem("userID");
  const [myChats, setMyChats] = useState([]);
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<any>(null);

  const filteredUsers = users.filter((user) => user._id !== currentUserId);

  const fetchUsers = async (searchValue: string, pageNumber: number) => {
    try {
      setLoading(true);

      const res = await fetchAllUsersApi(searchValue, pageNumber);

      setUsers(res.data.users);
    } catch (err) {
      console.log("Fetch users error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMyChats = async () => {
    try {
      const res = await regularChatReqApi();
      const chats = res.data.chats;

      const activeChats = chats.filter((chat: any) => chat.status === "active");

      setMyChats(activeChats);
    } catch (err: any) {
      console.log(err.response?.data?.error || err.message);
    }
  };

  useEffect(() => {
    handleMyChats();
  }, []);

  useEffect(() => {
    if (!token) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      setPage(1);
      fetchUsers(search, 1);
    }, 500);

    return () => clearTimeout(debounceRef.current);
  }, [search, token]);

  useEffect(() => {
    if (!token) return;
    fetchUsers(search, page);
  }, [page, token]);
  return {
    logout,
    search,
    setMyChats,
    setPage,
    setSearch,
    loading,
    filteredUsers,
    myChats,
  };
};
