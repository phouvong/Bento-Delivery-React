import MainApi from "../../../MainApi";
import { cart_item_update } from "../../../ApiRoutes";
import { useMutation, useQueryClient } from "react-query";

const addData = async (postData) => {
  // store_id is required by the backend on update; if the caller passed it
  // in the body, also surface it as a URL query param (matches useAddCartItem
  // and what the backend's validator expects).
  const storeId = postData?.store_id;
  const url = storeId
    ? `${cart_item_update}?store_id=${storeId}`
    : cart_item_update;
  const { data } = await MainApi.post(url, postData);
  return data;
};

export default function useCartItemUpdate() {
  const queryClient = useQueryClient();
  return useMutation("updated_cart_item", addData, {
    onSuccess: () => {
      queryClient.invalidateQueries("cart-groups");
      queryClient.invalidateQueries("cart-itemss");
    },
  });
}
