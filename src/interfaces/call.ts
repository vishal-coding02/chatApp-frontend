export interface CallerInfo {
  _id: string;
  userFullName: string;
  userName: string;
  profilePic?: string;
}

export interface CallRecord {
  _id: string;
  callerId: CallerInfo;
  receiverId: CallerInfo;
  callStatus: "missed" | "received" | "rejected" | "busy";
  createdAt: string;
  read  : boolean
}
export interface CallLogProps {
  isOpen: boolean;
  onClose: () => void;
}
