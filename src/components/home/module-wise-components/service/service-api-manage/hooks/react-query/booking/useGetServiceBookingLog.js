import MainApi from "api-manage/MainApi";
import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { useQuery } from "react-query";
import { service_booking_log_api } from "../../../ApiRoutes";
import { getGuestId, getToken } from "helper-functions/getToken";

// GET /api/v1/service/booking/log/{id} — tracking stepper for a single booking,
// or the parent + every child occurrence for a repeat booking.
const getData = async (id) => {
  const guestParam = getToken() ? "" : `?guest_id=${getGuestId()}`;
  const { data } = await MainApi.get(
    `${service_booking_log_api}/${id}${guestParam}`
  );
  return data ?? null;
};

export default function useGetServiceBookingLog(params, enabled = false) {
  return useQuery(
    ["service-booking-log", params?.id],
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
