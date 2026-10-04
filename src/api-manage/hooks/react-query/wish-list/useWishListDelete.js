import { useMutation } from "react-query";
import { delete_wish_list_api } from "../../../ApiRoutes";
import MainApi from "../../../MainApi";
import { ModuleTypes } from "helper-functions/moduleTypes";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
//import { onErrorResponse } from '../../../../components/api-response-messages/ApiResponseMessages'

const deleteData = async (wishListId) => {
  const moduleType = getCurrentModuleType();
  const query =
    moduleType === ModuleTypes.SERVICE
      ? `?service_id=${wishListId}`
      : `?item_id=${wishListId}`;

  const { data } = await MainApi.delete(
    `${delete_wish_list_api}${query || ""}`,
  );
  return data;
};
export const useWishListDelete = () => {
  return useMutation("delete_wishlist", deleteData);
};
