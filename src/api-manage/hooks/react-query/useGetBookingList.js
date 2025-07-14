import { useQuery } from "react-query";
import { getToken } from "helper-functions/getToken";

import MainApi from "api-manage/MainApi";
import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { comfirm_booking_list } from "api-manage/ApiRoutes";

const getData = async (guestId) => {
  try {
    const userToken = getToken();
    const params = !userToken ? `?guest_id=${guestId}` : "";
    const { data } = await MainApi.get(`${comfirm_booking_list}${params}`);

    return data;
  } catch (error) {
    throw error; // Rethrow the error to be caught by React Query
  }
};

export default function useGetBookingList(guestId, bookingSuccess) {
  return useQuery("booking-items", () => getData(guestId), {
    onSuccess: bookingSuccess,
    enabled: false, // Enable the query only when guestId is defined
    onError: onSingleErrorResponse,
  });
}
