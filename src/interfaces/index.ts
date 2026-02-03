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
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
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
