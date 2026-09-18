import MainApi from "api-manage/MainApi";
import { useQuery } from "react-query";

import {
  onErrorResponse,
  onSingleErrorResponse,
} from "api-manage/api-error-response/ErrorResponses";
import { trip_details } from "../../../ApiRoutes";
import { getGuestId, getToken } from "helper-functions/getToken";

// Define a standalone fetcher function
const fetchGetTripDetails = async (id) => {
  if (id) {
    const { data } = await MainApi.get(
      `${trip_details}?trip_id=${id}&guest_id=${
        getToken() ? null : getGuestId()
      }`,
      {}
    );
    return data;
  }
};

// Use the fetcher function in useQuery
export const useGetTripDetails = (id) => {
  return useQuery(["trip-details"], () => fetchGetTripDetails(id), {
    onError: onSingleErrorResponse, // Prevent refetching when the window regains focus
  });
};
