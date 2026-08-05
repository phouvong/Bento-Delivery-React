import MainApi from "api-manage/MainApi";
import { useQuery } from "react-query";
import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";

// GET /api/v1/service/custom-requests/{id}
const CUSTOM_REQUESTS_API = "/api/v1/service/custom-requests";

const getData = async ({ id, limit, offset }) => {
  const params = new URLSearchParams();
  params.set("limit", String(limit ?? 20));
  params.set("offset", String(offset ?? 1));
  const { data } = await MainApi.get(
    `${CUSTOM_REQUESTS_API}/${id}?${params.toString()}`
  );
  return data;
};

export default function useGetCustomServiceRequestDetails(
  params,
  enabled = true
) {
  return useQuery(
    [
      "custom-service-request-details",
      params?.id,
      params?.offset,
      params?.limit,
    ],
    () => getData(params),
    {
      enabled: enabled && !!params?.id,
      staleTime: 0,
      cacheTime: 50000,
      onError: onSingleErrorResponse,
      refetchOnWindowFocus: false,
    }
  );
}
