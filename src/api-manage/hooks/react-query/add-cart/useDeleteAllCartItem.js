import MainApi from "../../../MainApi";
import { cart_all_item_remove } from "../../../ApiRoutes";
import { useMutation } from "react-query";

const deleteData = async (arg) => {
  const { guestId, storeId } =
    arg && typeof arg === "object" ? arg : { guestId: arg };
  const params = new URLSearchParams();
  if (guestId) params.append("guest_id", guestId);
  if (storeId != null && storeId !== "") params.append("store_id", storeId);
  const qs = params.toString();
  const { data } = await MainApi.delete(
    qs ? `${cart_all_item_remove}?${qs}` : cart_all_item_remove
  );
  return data;
};

export default function useDeleteAllCartItem() {
  return useMutation("delete-all-cart-item", deleteData);
}
