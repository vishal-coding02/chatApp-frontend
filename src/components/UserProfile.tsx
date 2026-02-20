// UserProfile.tsx
import { useState, useEffect } from "react";
import { X, Calendar, User as UserIcon, Mail } from "lucide-react";
import type { UserData } from "../interfaces";
import api from "../api/axios";

type UserProfileProps = {
  userId: string;
  onClose: () => void;
};

const UserProfile = ({ userId, onClose }: UserProfileProps) => {
  const [user, setUser] = useState<UserData>({});

  const handleFetchUserProfile = async () => {
    try {
      const res = await api.get(`/api/v1/users/profile/${userId}`);
      const data = res.data;
      setUser(data.user);
      console.log(data.message);
    } catch (err) {
      console.log("Fetch users error", err);
    }
  };

  useEffect(() => {
    if (userId) {
      handleFetchUserProfile();
    }
  }, [userId]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Recently";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-50 md:hidden" onClick={onClose}>
        <div className="absolute inset-0 bg-black/40" />
        <div
          className="absolute bottom-0 ml-10 mr-10 left-0 right-0 bg-white rounded-t-3xl shadow-2xl animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-12 h-1 bg-gray-300 rounded-full" />
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>

          <div className="p-6 pt-2">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden border-3 border-indigo-200 shadow-lg mb-3">
                {user?.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center">
                    <span className="text-3xl font-bold text-indigo-600">
                      {user?.userName?.[0]?.toUpperCase() || "U"}
                    </span>
                  </div>
                )}
              </div>

              {/* Name & Username */}
              <h2 className="text-xl font-bold text-gray-900">
                {user?.userFullName || user?.userName || "User"}
              </h2>
              <p className="text-sm text-gray-600 mb-5">
                @{user?.userName || "username"}
              </p>

              <div className="w-full space-y-2">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <Mail className="h-5 w-5 text-indigo-600" />
                  <span className="text-sm text-gray-700">
                    {user?.userEmail || "No email"}
                  </span>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  <span className="text-sm text-gray-700">
                    Joined {formatDate(user?.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:block fixed inset-0 z-50" onClick={onClose}>
        <div className="absolute inset-0 bg-black/40" />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 bg-white rounded-2xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <X className="h-4 w-4 text-gray-600" />
          </button>

          <div className="p-6">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-indigo-200 shadow-md mb-3">
                {user?.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center">
                    <span className="text-2xl font-bold text-indigo-600">
                      {user?.userName?.[0]?.toUpperCase() || "U"}
                    </span>
                  </div>
                )}
              </div>

              <h2 className="text-lg font-bold text-gray-900">
                {user?.userFullName || user?.userName || "User"}
              </h2>
              <p className="text-xs text-gray-600 mb-4">
                @{user?.userName || "username"}
              </p>

              <div className="w-full space-y-2">
                <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
                  <Mail className="h-4 w-4 text-indigo-600" />
                  <span className="text-xs text-gray-700">
                    {user?.userEmail || "No email"}
                  </span>
                </div>

                <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
                  <Calendar className="h-4 w-4 text-purple-600" />
                  <span className="text-xs text-gray-700">
                    Joined {formatDate(user?.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default UserProfile;
