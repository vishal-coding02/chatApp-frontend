import ChatHeader from "../chatbox/ChatHeader";
import MessagesArea from "../chatbox/MessagesArea";
import MessageInput from "../chatbox/MessageInput";

interface ChatBoxProps {
  chat: any;
  onBack: () => void;
  onOpenProfile: (userId: string) => void;
}

const ChatBox = ({ chat, onBack, onOpenProfile }: ChatBoxProps) => {
  return (
    <div className="h-full flex flex-col bg-white">
      <ChatHeader chat={chat} onBack={onBack} onOpenProfile={onOpenProfile} />
      <MessagesArea chat={chat} />
      <MessageInput chat={chat} />
    </div>
  );
};

export default ChatBox;
