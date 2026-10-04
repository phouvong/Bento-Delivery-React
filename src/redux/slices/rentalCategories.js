import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	rentalCategories: [],
};

export const rentalCategoriesLists = createSlice({
	name: "rentalCategoriesLists",
	initialState,
	reducers: {
		setRentalCategoriesList: (state, action) => {
			state.rentalCategories = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const { setRentalCategoriesList } = rentalCategoriesLists.actions;
export default rentalCategoriesLists.reducer;
