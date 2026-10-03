import { useQuery } from "react-query";
import MainApi from "api-manage/MainApi";
import { wishlist_api } from "api-manage/ApiRoutes";
import { getApiContent } from "../../../getApiContent";

export const WishList = async () => {
  const { data } = await MainApi.get(`${wishlist_api}`);
  return getApiContent(data);
};

export const useGetWishList = (onSuccessHandler) => {
  return useQuery("get-rental-wishlist", () => WishList(), {
    enabled: false,
    retry: false,
    onSuccess: onSuccessHandler,
  });
};
