import ChatHeader from "../../chatbox/v1/ChatHeader";
import MessagesArea from "../../chatbox/v1/MessagesArea";
import MessageInput from "../../chatbox/v1/MessageInput";

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
