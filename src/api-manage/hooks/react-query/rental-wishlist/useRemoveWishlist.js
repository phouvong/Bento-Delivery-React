import { useMutation } from "react-query";
import MainApi from "api-manage/MainApi";
import { delete_wishlist_api } from "api-manage/ApiRoutes";

const deleteData = async ({ key, id }) => {
  const { data } = await MainApi.delete(`${delete_wishlist_api}?${key}=${id}`);
  return data;
};

export const useRemoveRentalWishList = () => {
  return useMutation("delete-rental_wishlist", deleteData);
};
