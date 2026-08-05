import { useMutation, useQueryClient } from "react-query";
import MainApi from "api-manage/MainApi";
import { service_booking_cancel_api } from "components/home/module-wise-components/service/service-api-manage/ApiRoutes";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";

const cancelServiceBooking = async (payload) => {
  const { data } = await MainApi.post(service_booking_cancel_api, payload);
  return data;
};

// POST /api/v1/service/booking/cancel
export default function useCancelServiceBooking() {
  const queryClient = useQueryClient();

  return useMutation(cancelServiceBooking, {
    onSuccess: () => {
      queryClient.invalidateQueries(["service-booking-list"]);
      queryClient.invalidateQueries(["service-booking-details"]);
      queryClient.invalidateQueries(["service-booking-counts"]);
      queryClient.invalidateQueries(["service-booking-log"]);
    },
    onError: onErrorResponse,
  });
}
