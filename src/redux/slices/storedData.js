import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [],
  subCategories: [],
  popularStores: [],
  recommendedStores: [],
  newStores: [],
  basicCampaigns: [],
  banners: {
    banners: [],
    campaigns: [],
  },
  featuredCategories: [],
  popularItemsNearby: {
    products: [],
  },
  runningCampaigns: [],
  newArrivalStores: [],
  bestReviewedItems: {
    products: [],
  },
  youWillLoveItems: {
    products: [],
  },
  AllSaveAddress: [],
  // CMS payload behind the footer. Persisted (this slice is not in the
  // redux-persist blacklist) so a reload can seed react-query instead of
  // refetching content that changes maybe once a month. `fetchedAt` lets the
  // query apply its normal staleTime to the restored copy.
  landingPage: { data: null, fetchedAt: 0 },
  // Category names for the navbar's animated search placeholder. Tagged with
  // the module they came from so switching modules invalidates them without
  // anyone having to remember to clear this.
  searchPlaceholderCategories: { moduleId: null, names: [] },
};

export const storedDataSlice = createSlice({
  name: "stored-data",
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setSubCategories: (state, action) => {
      state.subCategories = action.payload;
    },
    setPopularStores: (state, action) => {
      state.popularStores = action.payload;
    },
    setRecommendedStores: (state, action) => {
      state.recommendedStores = action.payload;
    },
    setNewStores: (state, action) => {
      state.newStores = action.payload;
    },
    setBasicCampaigns: (state, action) => {
      state.basicCampaigns = action.payload;
    },
    setBanners: (state, action) => {
      state.banners.banners = action.payload.banners;
      state.banners.campaigns = action.payload.campaigns;
    },
    setFeaturedCategories: (state, action) => {
      state.featuredCategories = action.payload;
    },
    setPopularItemsNearby: (state, action) => {
      state.popularItemsNearby = {
        ...action.payload,
        products: action.payload.products,
      };
    },
    setRunningCampaigns: (state, action) => {
      state.runningCampaigns = action.payload;
    },
    setNewArrivalStores: (state, action) => {
      state.newArrivalStores = action.payload;
    },
    setBestReviewedItems: (state, action) => {
      state.bestReviewedItems = {
        ...action.payload,
        products: action.payload.products,
      };
    },
    setYouWillLoveItems: (state, action) => {
      state.youWillLoveItems = {
        ...action.payload,
        products: action.payload.products,
      };
    },
    setAllSaveAddress: (state, action) => {
      state.AllSaveAddress = action.payload;
    },
    setLandingPage: (state, action) => {
      state.landingPage = action.payload;
    },
    setSearchPlaceholderCategories: (state, action) => {
      state.searchPlaceholderCategories = action.payload;
    },
    // Clears the module-scoped lists on a module switch. `landingPage` is
    // global CMS content and `searchPlaceholderCategories` carries its own
    // module tag, so neither is what this reset is for — dropping them just
    // forces a needless refetch on the next page load.
    setResetStoredData: (state) => ({
      ...initialState,
      landingPage: state.landingPage,
      searchPlaceholderCategories: state.searchPlaceholderCategories,
    }),
  },
});

// Action creators are generated for each case reducer function
export const {
  setCategories,
  setSubCategories,
  setPopularStores,
  setNewStores,
  setBasicCampaigns,
  setBanners,
  setFeaturedCategories,
  setPopularItemsNearby,
  setRunningCampaigns,
  setNewArrivalStores,
  setBestReviewedItems,
  setYouWillLoveItems,
  setResetStoredData,
  setLandingPage,
  setSearchPlaceholderCategories,
  setAllSaveAddress,
  setRecommendedStores,
} = storedDataSlice.actions;
export default storedDataSlice.reducer;
