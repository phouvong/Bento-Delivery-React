import { useQuery } from "react-query";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";
import { order_details_api } from "../../../ApiRoutes";
import MainApi from "../../../MainApi";

const getData = async (order_id, guestId) => {
  const { data } = await MainApi.get(
    `${order_details_api}?order_id=${order_id}&guest_id=${guestId}`,
  );
  return data;
};

export default function useGetOrderDetails(order_id, guestId) {
  return useQuery("order-details", () => getData(order_id, guestId), {
    enabled: false,
    onError: onSingleErrorResponse,
  });
}
