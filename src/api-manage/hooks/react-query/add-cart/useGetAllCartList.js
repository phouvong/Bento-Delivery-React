import MainApi from "../../../MainApi";
import { useQuery } from "react-query";
import { all_cart_list } from "../../../ApiRoutes";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";
import { getToken } from "helper-functions/getToken";

const getData = async (guestId, store_id) => {
  try {
    const userToken = getToken();
    const query = new URLSearchParams();
    if (!userToken && guestId) query.set("guest_id", guestId);
    if (store_id) query.set("store_id", store_id);
    const queryString = query.toString();
    const { data } = await MainApi.get(
      queryString ? `${all_cart_list}?${queryString}` : all_cart_list
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export default function useGetAllCartList(
  guestId,
  cartListSuccessHandler,
  store_id
) {
  const token = getToken();
  // Include store_id AND token so re-login triggers a fresh fetch for the
  // store-details sidebar cart (token change = new key = new request).
  return useQuery(
    ["cart-itemss", store_id ?? null, token ?? null],
    () => getData(guestId, store_id),
    {
      onSuccess: cartListSuccessHandler,
      enabled: Boolean(store_id),
      onError: onSingleErrorResponse,
    }
  );
}
