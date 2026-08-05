import { useMutation } from "react-query";
import MainApi from "api-manage/MainApi";
import { removeItemFromBookingList } from "components/home/module-wise-components/rental/rental-api-manage/ApiRoutes";
import { getGuestId, getToken } from "helper-functions/getToken";

const deleteItem = async (cartId) => {
  if (getToken()) {
    const { data } = await MainApi.delete(
      `${removeItemFromBookingList}/${cartId}`
    );
    return data;
  } else {
    const { data } = await MainApi.delete(
      `${removeItemFromBookingList}/${cartId}?guest_id=${getGuestId()}`
    );
    return data;
  }
};

export default function useDeleteItemFromBooking() {
  return useMutation("delete-all-cart-item_booking", deleteItem);
}
