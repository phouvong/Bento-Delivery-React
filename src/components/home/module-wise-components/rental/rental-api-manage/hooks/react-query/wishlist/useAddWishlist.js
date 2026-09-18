import { useMutation } from "react-query";
import MainApi from "api-manage/MainApi";
import { add_wishlist_api } from "components/home/module-wise-components/rental/rental-api-manage/ApiRoutes";

const addWishList = async ({ key, id }) => {
  const { data } = await MainApi.post(`${add_wishlist_api}?${key}=${id}`);
  return data;
};

export const useAddWishlist = () => {
  return useMutation("add_wishlist", addWishList);
};
