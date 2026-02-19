import { socket } from "../../socket";
import api from "../../api/axios";
import { User, MessageSquarePlus } from "lucide-react";

const UserCard = ({ user, onOpenProfile }: any) => {
  const participant1ID = localStorage.getItem("userID");

  const handleCreateChatRoom = async () => {
    try {
      const res = await api.post("/api/v1/chats", {
        participant1ID,
        participant2ID: user._id,
      });

      const data = res.data;
      socket.emit("joinRooms", {
        user: participant1ID,
        room: data.roomId,
      });
      console.log(data.message);
    } catch (err: any) {
      console.log(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 flex items-center justify-between hover:shadow-sm transition-all duration-300 hover:border-indigo-300">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 border-2 border-indigo-200 flex items-center justify-center">
          <User
            onClick={() => onOpenProfile(user._id)}
            className="h-5 w-5 text-indigo-600 cursor-pointer"
          />
        </div>
        <div>
          <p className="font-medium text-gray-800">
            {user.userName || user.username}
          </p>
          <p className="text-xs text-gray-500">
            {user.userFullName || user.fullname}
          </p>
        </div>
      </div>

      <button
        onClick={handleCreateChatRoom}
        className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow"
      >
        <MessageSquarePlus className="h-4 w-4" />
        Chat
      </button>
    </div>
  );
};

export default UserCard;
