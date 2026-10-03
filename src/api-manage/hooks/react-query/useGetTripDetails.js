
import { useQuery } from "react-query";
import { trip_details } from "api-manage/ApiRoutes";
import MainApi from "api-manage/MainApi";
import { getGuestId, getToken } from "helper-functions/getToken";
import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { getApiContent } from "../../getApiContent";

// Define a standalone fetcher function
const fetchGetTripDetails = async (id) => {
  if (id) {
    const { data } = await MainApi.get(
      `${trip_details}?trip_id=${id}&guest_id=${
        getToken() ? null : getGuestId()
      }`,
      {}
    );
    return getApiContent(data);
  }
};

// Use the fetcher function in useQuery
export const useGetTripDetails = (id) => {
  // Keyed by id so this shares nothing with the rental module's copy of the
  // hook, which fetches the same endpoint without `enabled: false`.
  return useQuery(["trip-details", id], () => fetchGetTripDetails(id), {
    onError: onSingleErrorResponse, // Prevent refetching when the window regains focus
    enabled: false,
  });
};