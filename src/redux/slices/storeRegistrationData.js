import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allData: {},
  activeStep: null,
  inZone: null,
};

// Action creators are generated for each case reducer function
export const storedResDataSlice = createSlice({
  name: "mple",
  initialState,
  reducers: {
    setAllData: (state, action) => {
      state.allData = action.payload;
    },
    setActiveStep: (state, action) => {
      state.activeStep = action.payload;
    },
    setInZone: (state, action) => {
      state.inZone = action.payload;
    },
  },
});

export const { setAllData, setActiveStep, setInZone } = storedResDataSlice.actions;

export default storedResDataSlice.reducer;
