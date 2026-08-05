import { useMutation } from "react-query";
import { trip_booking } from "components/home/module-wise-components/rental/rental-api-manage/ApiRoutes";
import MainApi from "api-manage/MainApi";

const orderPlace = async (orderData) => {
  const { data } = await MainApi.post(`${trip_booking}`, orderData);
  return data;
};
export const useTripBooking = () => {
  return useMutation("trip-booking", orderPlace);
};
