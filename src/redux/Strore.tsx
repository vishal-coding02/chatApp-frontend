import { configureStore } from "@reduxjs/toolkit";

import authSlice from "./reducer/AuthReducer";
import onlineSlice from "./reducer/onlineReducer";
import callSlice from "./reducer/CallReducer"

const store = configureStore({
  reducer: {
    auth: authSlice,
    online: onlineSlice,
    call : callSlice,
  },
});

export default store;
