import { combineReducers } from "@reduxjs/toolkit";
import AddAddressModalReducer from "../slices/addAddress";
import brandsReducer from "../slices/brands";
import cartReducer from "../slices/cart";
import cashbackReducer from "../slices/cashbackList";
import categoryIdsReducer from "../slices/categoryIds";
import configDataReducer from "../slices/configData";
import exampleReducer from "../slices/example";
import fbCredentialSliceReducer from "../slices/fbCredentials";
import guestUserReducer from "../slices/guestUserInfo";
import languageChangeReducer from "../slices/languageChange";
import offlinePaymentInfoReducer from "../slices/offlinePaymentData";
import parcelCategoriesReducers from "../slices/parcelCategoryData";
import parcelInfoDataReducer from "../slices/parcelDeliveryInfo";
import profileInfoReducers from "../slices/profileInfo";
import searchFilterReducer from "../slices/searchFilter";
import storedDataSliceReducer from "../slices/storedData";
import themeSettingsReducer from "../slices/themeSettings";
import utilsReducers from "../slices/utils";
import wishListReducer from "../slices/wishList";

//register all reducers here
export const rootReducer = combineReducers({
	example: exampleReducer,
	themeSettings: themeSettingsReducer,
	configData: configDataReducer,
	parcelInfoData: parcelInfoDataReducer,
	utilsData: utilsReducers,
	profileInfo: profileInfoReducers,
	parcelCategories: parcelCategoriesReducers,
	cart: cartReducer,
	wishList: wishListReducer,
	searchFilterStore: searchFilterReducer,
	fbCredentialsStore: fbCredentialSliceReducer,
	storedData: storedDataSliceReducer,
	languageChange: languageChangeReducer,
	addressModel: AddAddressModalReducer,
	guestUserInfo: guestUserReducer,
	offlinePayment: offlinePaymentInfoReducer,
	categoryIds: categoryIdsReducer,
	cashbackList: cashbackReducer,
	brands: brandsReducer,
});
