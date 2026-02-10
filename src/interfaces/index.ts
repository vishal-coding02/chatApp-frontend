export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: string;
}

export interface Message {
  _id?: string;
  text: string;
  senderId: string;
  isMe?: boolean;
  createdAt: string;
  status?: string;
}

export interface Chat {
  id: string;
  userId: string;

  name: string;
  isOnline: boolean;

  lastMessage: string;

  unread: number;
  time: string;
}
