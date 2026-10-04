import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profileInfo: null,
  couponInfo: null,
  couponType: null,
};

export const profileInfoSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.profileInfo = action.payload;
    },
    setLogoutUser: (state, action) => {
      state.profileInfo = action.payload;
    },
    setCouponInfo: (state, action) => {
      state.couponInfo = action.payload;
    },
    setCouponType: (state, action) => {
      state.couponType = action.payload;
    },
    clearProSubscription: (state) => {
      if (state.profileInfo) {
        state.profileInfo = { ...state.profileInfo, pro_subscription: null };
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUser, setLogoutUser, setCouponInfo, setCouponType, clearProSubscription } =
  profileInfoSlice.actions;
export default profileInfoSlice.reducer;
