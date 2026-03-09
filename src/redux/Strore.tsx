import { configureStore } from "@reduxjs/toolkit";

import authSlice from "./reducer/AuthReducer";
import onlineSlice from "./reducer/onlineReducer";

const store = configureStore({
  reducer: {
    auth: authSlice,
    online: onlineSlice,
  },
});

export default store;
