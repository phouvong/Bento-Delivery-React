import MainApi from "../../../MainApi";
import { cart_all_item_remove } from "../../../ApiRoutes";
import { useMutation, useQueryClient } from "react-query";
import { getGuestId, getToken } from "helper-functions/getToken";

const clearCart = async (storeId) => {
  const userToken = getToken();
  const guestId = getGuestId();
  const params = new URLSearchParams();
  if (!userToken && guestId) params.append("guest_id", guestId);
  if (storeId != null && storeId !== "") params.append("store_id", storeId);
  const qs = params.toString();
  const { data } = await MainApi.delete(
    qs ? `${cart_all_item_remove}?${qs}` : cart_all_item_remove
  );
  return data;
};

export default function useClearCart() {
  const queryClient = useQueryClient();
  return useMutation("clear-cart", clearCart, {
    onSuccess: () => {
      queryClient.invalidateQueries("cart-groups");
      queryClient.invalidateQueries("cart-itemss");
    },
  });
}
