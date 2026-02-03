import ChatHeader from "../chatbox/ChatHeader";
import MessagesArea from "../chatbox/MessagesArea";
import MessageInput from "../chatbox/MessageInput";

interface ChatBoxProps {
  chat: any;
  onBack: () => void;
}

const ChatBox = ({ chat, onBack }: ChatBoxProps) => {
  return (
    <div className="h-full flex flex-col bg-white">
      <ChatHeader chat={chat} onBack={onBack} />
      <MessagesArea />
      <MessageInput />
    </div>
  );
};

export default ChatBox;
