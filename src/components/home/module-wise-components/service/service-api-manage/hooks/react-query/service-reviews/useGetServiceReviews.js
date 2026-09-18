import MainApi from "api-manage/MainApi";
import { service_reviews_api, data_limit } from "../../../ApiRoutes";
import { useQuery } from "react-query";
import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";

// GET /api/v1/service/reviews/{service_id}?limit=&offset=
const getData = async ({ serviceId, limit = data_limit, offset }) => {
  const params = new URLSearchParams();
  if (limit) params.set("limit", limit);
  if (offset) params.set("offset", offset);
  const query = params.toString();
  const { data } = await MainApi.get(
    `${service_reviews_api}/${serviceId}${query ? `?${query}` : ""}`
  );
  return data;
};

export default function useGetServiceReviews(params, enabled = true) {
  return useQuery(
    ["service-reviews", params?.serviceId, params?.limit, params?.offset],
    () => getData(params),
    {
      enabled: enabled && !!params?.serviceId,
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 300000,
      onError: onSingleErrorResponse,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
}