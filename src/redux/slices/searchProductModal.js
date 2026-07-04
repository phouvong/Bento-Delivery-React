import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  selectedItem: null,
};

export const searchProductModalSlice = createSlice({
  name: "searchProductModal",
  initialState,
  reducers: {
    openSearchProductModal: (state, action) => {
      state.isOpen = true;
      state.selectedItem = action.payload;
    },
    closeSearchProductModal: (state) => {
      state.isOpen = false;
      state.selectedItem = null;
    },
  },
});

export const { openSearchProductModal, closeSearchProductModal } =
  searchProductModalSlice.actions;
export default searchProductModalSlice.reducer;
