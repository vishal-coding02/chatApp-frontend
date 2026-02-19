export interface UserData {
  _id?: string;
  userFullName?: string;
  userName?: string;
  userEmail?: string;
  avatar?: string;
  createdAt?: string;
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
