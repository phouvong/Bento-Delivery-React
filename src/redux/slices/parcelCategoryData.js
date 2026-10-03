import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  parcelCategories: null,
  // Chosen in the parcel information modal alongside the category, before the
  // customer reaches /parcel-delivery-info. Each row carries its own `charge`.
  parcelWeight: null,
  parcelDimension: null,
  // The zone the weight/dimension options above were fetched for — compared
  // against the sender's zone on /parcel-delivery-info to detect a mismatch.
  parcelInfoZoneId: null,
};

// Action creators are generated for each case reducer function
export const parcelICategoriesSlice = createSlice({
  name: "parcel-categories",
  initialState,
  reducers: {
    setParcelCategories: (state, action) => {
      state.parcelCategories = action.payload;
    },
    // The modal confirms type + weight + dimension together, so they land in
    // one action — a partial update would leave the three out of step.
    setParcelInformation: (state, action) => {
      state.parcelCategories = action.payload?.category ?? null;
      state.parcelWeight = action.payload?.weight ?? null;
      state.parcelDimension = action.payload?.dimension ?? null;
      state.parcelInfoZoneId = action.payload?.zoneId ?? null;
    },
  },
});

export const { setParcelCategories, setParcelInformation } =
  parcelICategoriesSlice.actions;

export default parcelICategoriesSlice.reducer;
