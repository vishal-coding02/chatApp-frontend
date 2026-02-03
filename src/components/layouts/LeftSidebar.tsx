import UserCard from "../sidebar/UserCard";
import { LogOut, Search } from "lucide-react";
import { useLogout } from "../sidebar/LogoutButton";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import api from "../../api/axios";

const LeftSidebar = () => {
  const logout = useLogout();
  const token = useSelector((state: any) => state.auth.jwtToken);
  const currentUserId = localStorage.getItem("userID");

  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const debounceRef = useRef<any>(null);

  const filteredUsers = users.filter((user) => user._id !== currentUserId);

  const fetchUsers = async (searchValue: string, pageNumber: number) => {
    try {
      setLoading(true);

      const res = await api.get(
        `/api/v1/users?name=${searchValue}&page=${pageNumber}`,
      );

      setUsers(res.data.users);
    } catch (err) {
      console.log("Fetch users error", err);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="h-full flex flex-col bg-linear-to-b from-white to-indigo-50/30 p-4 border-r border-gray-100">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
            <svg
              className="h-5 w-5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
            ChatHub
          </h1>
        </div>
        <p className="text-sm text-gray-600">Find and connect with users</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-sm"
        />
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {!loading && filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto bg-linear-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-3">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">No users found</p>
            <p className="text-gray-400 text-xs mt-1">Try a different search</p>
          </div>
        )}

        <div className="space-y-3">
          {filteredUsers.map((user) => (
            <UserCard key={user._id} user={user} />
          ))}
        </div>

        {/* Next users button */}
        {filteredUsers.length > 0 && (
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="w-full mt-4 px-4 py-2.5 text-sm font-medium  cursor-pointer  bg-linear-to-r from-indigo-50 to-purple-50 text-indigo-700 rounded-xl hover:from-indigo-100 hover:to-purple-100 transition-all duration-300 border border-indigo-200"
          >
            Load More Users
          </button>
        )}
      </div>

      {/* Logout Button */}
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 cursor-pointer px-4 py-3 text-gray-700 bg-linear-to-r from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-300 border border-gray-300 hover:border-gray-400"
        >
          <LogOut className="h-4 w-4" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default LeftSidebar;
