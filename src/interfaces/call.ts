export interface CallerInfo {
  _id: string;
  userFullName: string;
  userName: string;
  profilePic?: string;
}

export interface CallLog {
  _id: string;
  callerId: CallerInfo;
  callStatus: string;
  createdAt: string;
}

export interface CallLogProps {
  isOpen: boolean;
  onClose: () => void;
}
