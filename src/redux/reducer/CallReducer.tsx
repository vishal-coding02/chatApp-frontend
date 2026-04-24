import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface UserInfo {
  id: string;
  name: string;
  avatar?: string;
}

export interface CallState {
  callStatus:
    | "idle"
    | "calling"
    | "ringing"
    | "ongoing"
    | "ended"
    | "busy"
    | "missed";
  callEndType?:
    | "rejected"
    | "cancelled"
    | "missed"
    | "ended"
    | "busy"
    | "no_answer";
  isAccepted?: boolean;
  caller: UserInfo | null;
  receiver: UserInfo | null;
  callType: "audio" | null;
  isMuted: boolean;
  callTime: number;
  endedDuration: number;
}

const initialState: CallState = {
  callStatus: "idle",
  caller: null,
  receiver: null,
  callType: null,
  isMuted: false,
  callTime: 0,
  endedDuration: 0,
  isAccepted: false,
};

const callSlice = createSlice({
  name: "call",
  initialState,
  reducers: {
    startCall: (
      state,
      action: PayloadAction<{
        caller: UserInfo;
        receiver: UserInfo;
        type: "audio";
      }>,
    ) => {
      state.callStatus = "calling";
      state.caller = action.payload.caller;
      state.receiver = action.payload.receiver;
      state.callType = action.payload.type;
      state.isMuted = false;
      state.callTime = 0;
    },

    incomingCall: (
      state,
      action: PayloadAction<{
        caller: UserInfo;
        type: "audio";
      }>,
    ) => {
      state.callStatus = "ringing";
      state.caller = action.payload.caller;
      state.callType = action.payload.type;
      state.isMuted = false;
      state.callTime = 0;
    },

    acceptCall: (state) => {
      state.callStatus = "ongoing";
      state.callTime = 0;
      state.isAccepted = true;
    },

    rejectCall: (state) => {
      state.callStatus = "ended";
      state.callEndType = "rejected";
      state.endedDuration = 0;
    },

    endCall: (state) => {
      state.endedDuration = state.callTime;
      state.callStatus = "ended";

      if (state.isAccepted) {
        state.callEndType = "ended";
      } else {
        state.callEndType = "cancelled";
      }
    },

    missedCall: (state) => {
      state.callStatus = "ended";
      state.callEndType = "missed";
      state.endedDuration = 0;
    },

    noAnswer: (state) => {
      state.callStatus = "ended";
      state.callEndType = "no_answer";
      state.endedDuration = 0;
    },

    setBusy: (state) => {
      state.callStatus = "ended";
      state.callEndType = "busy";
    },

    resetCall: () => initialState,

    toggleMute: (state) => {
      state.isMuted = !state.isMuted;
    },

    incrementTime: (state) => {
      state.callTime += 1;
    },
  },
});

export const {
  startCall,
  incomingCall,
  acceptCall,
  rejectCall,
  endCall,
  resetCall,
  toggleMute,
  incrementTime,
  setBusy,
  missedCall,
  noAnswer,
} = callSlice.actions;

export default callSlice.reducer;
