import { useQuery } from "react-query";
import { wishlist_api } from "components/home/module-wise-components/rental/rental-api-manage/ApiRoutes";
import MainApi from "api-manage/MainApi";

export const WishList = async () => {
  const { data } = await MainApi.get(`${wishlist_api}`);
  return data;
};

export const useGetWishList = (onSuccessHandler) => {
  return useQuery("get-rental-wishlist", () => WishList(), {
    enabled: false,
    retry: false,
    onSuccess: onSuccessHandler,
  });
};
