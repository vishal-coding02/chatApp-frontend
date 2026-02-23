import { socket } from "../../../socket";
import api from "../../../api/axios";
import { User, MessageSquarePlus, MessageSquare } from "lucide-react";

const UserCard = ({ user, onOpenProfile, existingChats }: any) => {
  const myID = localStorage.getItem("userID");

  const alreadyChatExists = existingChats?.some(
    (chat: any) =>
      chat.participants?.some(
        (p: any) => (p._id || p).toString() === myID?.toString(),
      ) &&
      chat.participants?.some(
        (p: any) => (p._id || p).toString() === user._id.toString(),
      ),
  );

  const handleCreateChatRoom = async () => {
    if (alreadyChatExists) return;
    try {
      const res = await api.post("/api/v1/chats", {
        participant1ID: myID,
        participant2ID: user._id,
      });

      const data = res.data;
      socket.emit("joinRooms", {
        user: myID,
        room: data.roomId,
      });
      alert(data.message);
    } catch (err: any) {
      console.log(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 flex items-center justify-between hover:shadow-lg transition-all duration-300 hover:border-indigo-400 hover:bg-linear-to-r hover:from-indigo-50/50 hover:to-purple-50/50 group">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Profile Image */}
        <div
          className="w-12 h-12 rounded-full bg-linear-to-r from-indigo-100 to-purple-100 border-2 border-indigo-200 flex items-center justify-center overflow-hidden cursor-pointer shrink-0 hover:border-indigo-500 hover:scale-105 transition-all duration-300 shadow-sm group-hover:shadow-md"
          onClick={() => onOpenProfile(user._id)}
        >
          {user?.profilePic ? (
            <img
              src={user.profilePic}
              alt={user.userFullName}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="h-5 w-5 text-indigo-600 group-hover:text-indigo-700" />
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 group-hover:text-indigo-700 transition-colors truncate">
            {user.userName || user.username}
          </p>
          <p className="text-xs text-gray-500 group-hover:text-gray-600 truncate">
            {user.userFullName || user.fullname}
          </p>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleCreateChatRoom}
        className={`px-3 py-2 text-white text-xs sm:text-sm font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md shrink-0 ml-2 min-w-21.25 sm:min-23.75
          bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:scale-105
          ${alreadyChatExists ? "opacity-90" : ""}`}
      >
        {alreadyChatExists ? (
          <>
            <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="font-medium">Message</span>
          </>
        ) : (
          <>
            <MessageSquarePlus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="font-medium">Chat</span>
          </>
        )}
      </button>
    </div>
  );
};

export default UserCard;
