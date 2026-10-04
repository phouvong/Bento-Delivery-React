import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	brands: null,
};

export const brands = createSlice({
	name: "brands",
	initialState,
	reducers: {
		setBrands: (state, action) => {
			state.brands = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const { setBrands } = brands.actions;
export default brands.reducer;
