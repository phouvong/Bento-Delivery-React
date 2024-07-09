import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./root-reducer";

import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
	key: "sixam-mart",
	storage: storage,
	blacklist: ["categoryIds", "cashbackList", "brands"],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
	reducer: persistedReducer,
	devTools: true,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});
//store.js
export default configureStore({
	reducer: persistedReducer,
});
