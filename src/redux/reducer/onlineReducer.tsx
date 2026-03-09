import { createSlice } from "@reduxjs/toolkit";

interface OnlineUsers {
  onlineUsers: string[];
}

const initialState: OnlineUsers = {
  onlineUsers: [],
};

const onlineSlice = createSlice({
  name: "online",
  initialState,
  reducers: {
    onlineUserAction(state, action) {
      state.onlineUsers = action.payload;
    },
  },
});

export const { onlineUserAction } = onlineSlice.actions;

export default onlineSlice.reducer;
