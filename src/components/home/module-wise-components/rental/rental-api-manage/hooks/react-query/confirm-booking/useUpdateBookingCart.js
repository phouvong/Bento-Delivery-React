import { useMutation } from "react-query";
import MainApi from "api-manage/MainApi";
import { update_booking_cart } from "components/home/module-wise-components/rental/rental-api-manage/ApiRoutes";

const addData = async (postData) => {
  const { data } = await MainApi.put(update_booking_cart, postData);
  return data;
};

export default function useUpdateBookingCart() {
  return useMutation("updated_booking_cart_item", addData);
}
