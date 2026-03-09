import ChatHeader from "../chatbox/ChatHeader";
import MessagesArea from "../chatbox/MessagesArea";
import MessageInput from "../chatbox/MessageInput";
import { useEffect, useState } from "react";
import { socket } from "../../socket";
interface ChatBoxProps {
  chat: any;
  onBack: () => void;
  onOpenProfile: (userId: string) => void;
}

const ChatBox = ({ chat, onBack, onOpenProfile }: ChatBoxProps) => {
  const [typingUser, setTypingUser] = useState<string>("");
  const [typingRoom, setTypingRoom] = useState<string>("");

  useEffect(() => {
    if (!chat?._id) return;
    socket.on("userTyping", ({ userId, room }) => {
      setTypingUser(userId);
      setTypingRoom(room);
    });
    socket.on("userStopTyping", () => {
      setTypingUser("");
      setTypingRoom("");
    });

    return () => {
      socket.off("userTyping");
      socket.off("userStopTyping");
    };
  }, [chat]);

  return (
    <div className="h-full flex flex-col bg-white">
      <ChatHeader chat={chat} onBack={onBack} onOpenProfile={onOpenProfile} />
      <MessagesArea
        chat={chat}
        typingUser={typingUser}
        typingRoom={typingRoom}
      />
      <MessageInput chat={chat} />
    </div>
  );
};

export default ChatBox;
