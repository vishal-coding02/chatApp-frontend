import { useLogout } from "../components/sidebar/LogoutButton";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { regularChatReqApi } from "../api/chat.api";
import { fetchAllUsersApi } from "../api/user.api";

export const useSideBar = () => {
  const logout = useLogout();
  const token = useSelector((state: any) => state.auth.jwtToken);
  const currentUserId = localStorage.getItem("userID");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceRef = useRef<any>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      setPage(1);
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(debounceRef.current);
  }, [search]);

  const { data: usersData, isLoading: loading } = useQuery({
    queryKey: ["users", debouncedSearch, page],
    queryFn: () => fetchAllUsersApi(debouncedSearch, page),
    enabled: !!token,
    staleTime: 2 * 60 * 1000,
    select: (res) =>
      res.data.users.filter((user: any) => user._id !== currentUserId),
  });

  const { data: myChatsData, refetch: refetchChats } = useQuery({
    queryKey: ["sidebarChats"],
    queryFn: regularChatReqApi,
    staleTime: 5 * 60 * 1000,
    select: (res) =>
      res.data.chats.filter((chat: any) => chat.status === "active"),
  });

  const filteredUsers = usersData || [];
  const myChats = myChatsData || [];

  return {
    logout,
    search,
    setPage,
    setSearch,
    loading,
    filteredUsers,
    myChats,
    setMyChats: refetchChats,
  };
};
