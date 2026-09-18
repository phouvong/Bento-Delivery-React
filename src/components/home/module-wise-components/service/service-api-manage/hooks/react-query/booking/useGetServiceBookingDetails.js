import MainApi from "api-manage/MainApi";
import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { useQuery } from "react-query";
import { service_booking_details_api } from "../../../ApiRoutes";
import { getGuestId, getToken } from "helper-functions/getToken";

// GET /api/v1/service/booking/details/{id}
const getData = async (id) => {
  const guestParam = getToken() ? "" : `?guest_id=${getGuestId()}`;
  const { data } = await MainApi.get(
    `${service_booking_details_api}/${id}${guestParam}`
  );
  return data ?? null;
};

export default function useGetServiceBookingDetails(params, enabled = true) {
  return useQuery(
    ["service-booking-details", params?.id],
    () => getData(params?.id),
    {
      enabled: enabled && !!params?.id,
      staleTime: 0,
      cacheTime: 50000,
      onError: onSingleErrorResponse,
      refetchOnWindowFocus: false,
    }
  );
}
