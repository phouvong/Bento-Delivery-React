import MainApi from "../../../MainApi";
import { useQuery } from "react-query";
import { all_cart_list } from "../../../ApiRoutes";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";
import { getToken, getGuestId } from "helper-functions/getToken";
import { getApiList } from "../../../getApiContent";

const getData = async (guestId, store_id) => {
  try {
    const query = new URLSearchParams();
    // `customer_or_guest` endpoint — send guest_id whenever we hold one so a
    // guest cart stays addressable; the backend prefers the bearer token when
    // both are present.
    const effectiveGuestId = guestId ?? getGuestId();
    if (effectiveGuestId) query.set("guest_id", effectiveGuestId);
    if (store_id) query.set("store_id", store_id);
    const queryString = query.toString();
    const { data } = await MainApi.get(
      queryString ? `${all_cart_list}?${queryString}` : all_cart_list
    );
    // Callers do `res?.map(...)`, so hand back the rows array — v4.2 nests
    // them under content.data alongside pagination.
    return getApiList(data) ?? [];
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
      staleTime: 0,
      cacheTime: 0,
      refetchOnMount: "always",
      refetchOnWindowFocus: true,
    }
  );
}
