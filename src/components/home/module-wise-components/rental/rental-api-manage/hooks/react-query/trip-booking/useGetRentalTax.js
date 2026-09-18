import { useMutation } from "react-query";
import {rental_get_tax, trip_booking} from "components/home/module-wise-components/rental/rental-api-manage/ApiRoutes";
import MainApi from "api-manage/MainApi";

const getTax = async (orderData) => {
  const { data } = await MainApi.post(`${rental_get_tax}`, orderData);
  return data;
};
export const useGetRentalTax = () => {
  return useMutation("get-tax", getTax);
};
