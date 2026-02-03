import { useSelector } from "react-redux";
import { Bell, Settings, ChevronDown } from "lucide-react";

const ChatTopBar = () => {
  const userData = useSelector((state: any) => state.auth.userData);
  console.log(userData);

  return (
    <div className="border-b border-gray-200 bg-white px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Logo */}
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

        {/* User Profile & Notifications */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <button className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-300 flex items-center justify-center hover:from-gray-100 hover:to-gray-200 transition-all duration-300">
              <Bell className="h-5 w-5 text-gray-600" />
            </button>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
              2
            </div>
          </div>

          {/* Settings */}
          <button className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-300 flex items-center justify-center hover:from-gray-100 hover:to-gray-200 transition-all duration-300">
            <Settings className="h-5 w-5 text-gray-600" />
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">
                {userData?.userName || "User"}
              </p>
              <p className="text-xs text-gray-500">Online</p>
            </div>
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 border-2 border-indigo-200 flex items-center justify-center">
                <span className="text-sm font-semibold text-indigo-600">
                  {userData?.userName?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatTopBar;
