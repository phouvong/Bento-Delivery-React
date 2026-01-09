import { useQuery } from "react-query";
import MainApi from "api-manage/MainApi";
import { payment_failed_api } from "api-manage/ApiRoutes";
import { getGuestId } from "helper-functions/getToken";


const getData = async (order_id: string) => {
  const { data } = await MainApi.get(`${payment_failed_api}?order_id=${order_id}&&guest_id=${getGuestId()}`);
  return data;
};

export const useGetFailedPayment = (order_id: string, onSuccess: (data: any) => void) => {
  return useQuery(["failed-payment", order_id], () => getData(order_id), {
    onSuccess,
    enabled:false,
    retry: 1,
  });
};