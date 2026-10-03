import { useQuery } from "react-query";

import { most_trips } from "../../ApiRoutes";
import MainApi from "../../MainApi";
import { onSingleErrorResponse } from "../../api-error-response/ErrorResponses";
import { getApiContent } from "../../getApiContent";

const getData = async () => {
  const { data } = await MainApi.get(`${most_trips}`);
  return getApiContent(data);
};

export default function useGetMostTrips() {
  return useQuery("most-trips", () => getData(), {
    enabled: true,
    onError: onSingleErrorResponse,
  });
}
