import { useMutation, useQueryClient } from "react-query";
import MainApi from "api-manage/MainApi";
import { service_booking_place_api } from "components/home/module-wise-components/service/service-api-manage/ApiRoutes";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";

export default function usePlaceServiceBooking() {
  const queryClient = useQueryClient();

  return useMutation(
    (payload) => MainApi.post(service_booking_place_api, payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["cart-groups"]);
        queryClient.invalidateQueries(["cart-itemss"]);
      },
      onError: onErrorResponse,
    }
  );
}
