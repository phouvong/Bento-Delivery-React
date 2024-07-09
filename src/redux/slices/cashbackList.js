import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	cashbackList: null,
};

export const cashbackList = createSlice({
	name: "cashbackList",
	initialState,
	reducers: {
		setCashbackList: (state, action) => {
			state.cashbackList = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const { setCashbackList } = cashbackList.actions;
export default cashbackList.reducer;
