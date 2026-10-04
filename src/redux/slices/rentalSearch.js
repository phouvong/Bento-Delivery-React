import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  rentalSearch: {},
};

export const rentalSearch = createSlice({
  name: "rentalSearch",
  initialState,
  reducers: {
    setRentalSearch: (state, action) => {
      state.rentalSearch = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setRentalSearch } = rentalSearch.actions;
export default rentalSearch.reducer;
