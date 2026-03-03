import MainApi from "../../../MainApi";
import { cart_all_item_remove } from "../../../ApiRoutes";
import { useMutation } from "react-query";
import { getGuestId, getToken } from "helper-functions/getToken";

const clearCart = async () => {
  const userToken = getToken();
  const guestId = getGuestId();
  const params = !userToken ? `?guest_id=${guestId}` : "";
  const { data } = await MainApi.delete(`${cart_all_item_remove}${params}`);
  return data;
};

export default function useClearCart() {
  return useMutation("clear-cart", clearCart);
}
