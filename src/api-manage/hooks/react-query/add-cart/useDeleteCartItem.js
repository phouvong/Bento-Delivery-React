import MainApi from "../../../MainApi";
import { cart_item_delete } from "../../../ApiRoutes";
import { useMutation, useQueryClient } from "react-query";
import { getToken } from "helper-functions/getToken";

const deleteItem = async (cartIdAndGuestId) => {
  // Send guest_id only for true guest sessions. When a token is present
  // the MainApi interceptor adds Authorization, and the backend 403s if
  // both Authorization and guest_id are sent at once.
  const hasToken = Boolean(getToken());
  const guestId = !hasToken ? cartIdAndGuestId?.guestId : null;
  const cartId = cartIdAndGuestId?.cart_id;
  const storeId = cartIdAndGuestId?.store_id;

  const params = new URLSearchParams();
  if (guestId) params.set("guest_id", guestId);
  if (cartId != null) params.set("cart_id", cartId);
  if (storeId != null) params.set("store_id", storeId);

  const qs = params.toString();
  const url = qs ? `${cart_item_delete}?${qs}` : cart_item_delete;

  const { data } = await MainApi.delete(url);
  return data;
};

export default function useDeleteCartItem() {
  const queryClient = useQueryClient();
  return useMutation("delete-all-cart-item", deleteItem, {
    onSuccess: () => {
      queryClient.invalidateQueries("cart-groups");
      queryClient.invalidateQueries("cart-itemss");
    },
  });
}
