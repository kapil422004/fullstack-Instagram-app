import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice.js";
import postSlice from "./postSlice.js";
import socketSlice from "./socketSlice.js";

import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import chatSlice from "./chatSlice.js";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  blacklist: ["socketio"],
};

const rootReducer = combineReducers({
  users: userSlice,
  posts: postSlice,
  socketio: socketSlice,
  chats: chatSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
