import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  wishLists: {
    item: [],
    store: [],
    vehicles: [],
    providers: [],
    service: [],
  },
};

export const wishListSlice = createSlice({
  name: "wishLists",
  initialState,
  reducers: {
    setWishList: (state, action) => {
      state.wishLists = action.payload;
    },
    addWishList: (state, action) => {
      state.wishLists.item.push(action.payload);
    },
    addWishListVehicle: (state, action) => {
      state.wishLists.vehicles.push(action.payload);
    },
    addWishListStore: (state, action) => {
      state.wishLists.store.push(action.payload);
    },
    addWishListProvider: (state, action) => {
      state.wishLists.providers.push(action.payload);
    },
    addWishListService: (state, action) => {
      state.wishLists.service.push(action.payload);
    },
    removeWishListItem: (state = initialState, action) => {
      let tempWishList = state.wishLists.item?.filter(
        (item) => item.id !== action.payload
      );

      return {
        wishLists: {
          ...state.wishLists,
          item: [...tempWishList],
        },
      };
    },
    removeWishListVehicle: (state = initialState, action) => {
      let tempWishList = state.wishLists.vehicles?.filter(
        (item) => item.id !== action.payload
      );

      return {
        wishLists: {
          ...state.wishLists,
          vehicles: [...tempWishList],
        },
      };
    },
    removeWishListStore: (state = initialState, action) => {
      let tempWishList = state.wishLists.store?.filter(
        (item) => item.id !== action.payload
      );
      return {
        wishLists: {
          ...state.wishLists,
          store: [...tempWishList],
        },
      };
    },
    removeWishListProvider: (state = initialState, action) => {
      let tempWishList = state.wishLists.providers?.filter(
        (item) => item.id !== action.payload
      );
      return {
        wishLists: {
          ...state.wishLists,
          providers: [...tempWishList],
        },
      };
    },
    removeWishListService: (state = initialState, action) => {
      let tempWishList = state.wishLists.service?.filter(
        (item) => item.id !== action.payload
      );
      return {
        wishLists: {
          ...state.wishLists,
          service: [...tempWishList],
        },
      };
    },
    clearWishList: (state = initialState, action) => {
      state.wishLists.item = action.payload;
      state.wishLists.store = action.payload;
      state.wishLists.providers = action.payload;
      state.wishLists.vehicles = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setWishList,
  removeWishListItem,
  addWishList,
  addWishListVehicle,
  removeWishListStore,
  removeWishListVehicle,
  removeWishListProvider,
  addWishListProvider,
  addWishListStore,
  addWishListService,
  removeWishListService,
  clearWishList,
} = wishListSlice.actions;
export default wishListSlice.reducer;
