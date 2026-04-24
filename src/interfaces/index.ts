export interface UserData {
  _id?: string;
  userFullName?: string;
  userName?: string;
  userEmail?: string;
  avatar?: string;
  createdAt?: string;
  profilePic?: string;
}

export interface Message {
  _id?: string;
  text?: string;
  senderId: string;
  isMe?: boolean;
  createdAt?: string;
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


type CallStatus = "idle" | "calling" | "ringing" | "ongoing" | "ended";

export interface UserInfo {
  id: string;
  name: string;
  avatar?: string;
}

export interface CallState {
  callStatus: CallStatus;
  caller: UserInfo | null;
  receiver: UserInfo | null;
  callType: "audio" | null;
  isMuted: boolean;
  callTime: number;
}