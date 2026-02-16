import { useSelector } from "react-redux";
import { Bell, User, Image, Menu, X } from "lucide-react";
import { useState } from "react";

const ChatTopBar = () => {
  const userData = useSelector((state: any) => state.auth.userData);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  console.log(userData);

  return (
    <>
      <div className="border-b border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center justify-between">
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

          <div className="hidden md:flex items-center gap-3">
            <div className="relative">
              <button className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-300 flex items-center justify-center hover:from-gray-100 hover:to-gray-200 transition-all duration-300">
                <Bell className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            <div className="relative">
              <div
                className="cursor-pointer"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 border-2 border-indigo-200 flex items-center justify-center overflow-hidden">
                  {userData?.profileImage ? (
                    <img
                      src={userData.profileImage}
                      alt="profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-indigo-600">
                      {userData?.userName?.[0]?.toUpperCase() || "U"}
                    </span>
                  )}
                </div>
              </div>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <User className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-700">View Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      setIsImagePreviewOpen(true);
                    }}
                    className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Image className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-700">View Image</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-600" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Notifications</span>
                <button className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-300 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Profile</span>
                <div className="relative">
                  <div
                    className="cursor-pointer"
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 border-2 border-indigo-200 flex items-center justify-center overflow-hidden">
                      {userData?.profileImage ? (
                        <img
                          src={userData.profileImage}
                          alt="profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-semibold text-indigo-600">
                          {userData?.userName?.[0]?.toUpperCase() || "U"}
                        </span>
                      )}
                    </div>
                  </div>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <User className="h-4 w-4 text-gray-600" />
                        <span className="text-sm text-gray-700">
                          View Profile
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          setIsMobileMenuOpen(false);
                          setIsImagePreviewOpen(true);
                        }}
                        className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <Image className="h-4 w-4 text-gray-600" />
                        <span className="text-sm text-gray-700">
                          View Image
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {isImagePreviewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setIsImagePreviewOpen(false)}
        >
          <div className="absolute inset-0 bg-white/30 backdrop-blur-md"></div>

          <div
            className="relative cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-white shadow-2xl">
              {userData?.profileImage ? (
                <img
                  src={userData.profileImage}
                  alt={userData?.userName || "Profile"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center">
                  <span className="text-8xl font-bold text-indigo-600">
                    {userData?.userName?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatTopBar;
