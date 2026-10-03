import { useQuery } from "react-query";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";
import { order_details_api } from "../../../ApiRoutes";
import MainApi from "../../../MainApi";
import { getApiContent, getApiList } from "../../../getApiContent";

const getData = async (order_id, guestId) => {
  const { data } = await MainApi.get(
    `${order_details_api}?order_id=${order_id}&guest_id=${guestId}`
  );
  // Consumers disagree on the shape: RateAndReview treats this as the array of
  // order rows (`data.filter(...)`, `setItems(data)`), while order-details reads
  // object fields. The doc's capture for this endpoint was a 404 so it settles
  // neither. Return the rows when the payload is a list, otherwise the object —
  // correct for both, and never undefined-when-it-was-an-object.
  return getApiList(data) ?? getApiContent(data);
};

export default function useGetOrderDetails(order_id, guestId) {
  // Key by order_id (+ guestId) so each order is its own cache entry. With a
  // static key, switching orders reused the previous order's cached data — so
  // `isLoading` stayed false (no shimmer) and stale details flashed until the
  // background refetch resolved.
  return useQuery(
    ["order-details", order_id, guestId],
    ({ queryKey }) => {
      const [, currentOrderId, currentGuestId] = queryKey;
      return getData(currentOrderId, currentGuestId);
    },
    {
      enabled: false,
      onError: onSingleErrorResponse,
    }
  );
}
