import { ArrowLeft, Phone, Video, MoreVertical } from "lucide-react";

interface ChatHeaderProps {
  chat: any;
  onBack: () => void;
}

const ChatHeader = ({ chat, onBack }: ChatHeaderProps) => {
  return (
    <div className="border-b border-gray-200 p-4 flex items-center justify-between bg-white">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="md:hidden w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 border-2 border-indigo-200 flex items-center justify-center">
          <span className="text-lg font-semibold text-indigo-600">{chat?.avatar}</span>
        </div>
        
        <div>
          <p className="font-semibold text-gray-800">{chat?.name}</p>
          <p className="text-xs text-green-600 flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Online
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-300 flex items-center justify-center hover:from-gray-100 hover:to-gray-200 transition-all duration-300">
          <Phone className="h-5 w-5 text-gray-600" />
        </button>
        
        <button className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-300 flex items-center justify-center hover:from-gray-100 hover:to-gray-200 transition-all duration-300">
          <Video className="h-5 w-5 text-gray-600" />
        </button>
        
        <button className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-300 flex items-center justify-center hover:from-gray-100 hover:to-gray-200 transition-all duration-300">
          <MoreVertical className="h-5 w-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;