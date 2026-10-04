import { useMutation } from "react-query";
import { add_wish_list_api } from "../../../ApiRoutes";
import MainApi from "../../../MainApi";
import { ModuleTypes } from "helper-functions/moduleTypes";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";

const addTOWishList = async (wishListId) => {
  const moduleType = getCurrentModuleType();
  const query =
    moduleType === ModuleTypes.SERVICE
      ? `?service_id=${wishListId}`
      : `?item_id=${wishListId}`;

  const { data } = await MainApi.post(`${add_wish_list_api}${query || ""}`);
  return data;
};
export const useAddToWishlist = () => {
  return useMutation("add_wishlist", addTOWishList);
};
