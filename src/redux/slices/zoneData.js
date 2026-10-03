import { createSlice } from "@reduxjs/toolkit";

// Keyed by zone id so lookups for other locations (receiver, map pan, rental
// pickup) add entries instead of replacing the user's zones.
const initialState = {
  zonesById: {},
};

export const zoneDataSlice = createSlice({
  name: "zone-data",
  initialState,
  reducers: {
    mergeZoneData: (state, action) => {
      const zones = Array.isArray(action.payload) ? action.payload : [];
      zones.forEach((zone) => {
        if (zone?.id == null) return;
        state.zonesById[zone.id] = {
          ...(state.zonesById[zone.id] || {}),
          ...zone,
        };
      });
    },
  },
});

export const { mergeZoneData } = zoneDataSlice.actions;

export default zoneDataSlice.reducer;
