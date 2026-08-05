import { useQuery } from "react-query";
import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { data_limit, service_request_list_api } from "../../../ApiRoutes";
import MainApi from "api-manage/MainApi";

// GET /api/v1/service/requested-services?limit&offset&status
// The UI reads `category`, `image`, `service_name`, `status`, `description` —
// normalize the API response fields (`category_name`, `category_image_full_url`)
// once here so downstream components stay untouched.
const normalizeItem = (item) => ({
  ...item,
  category: item?.category_name ?? item?.category ?? "",
  image: item?.category_image_full_url ?? item?.image ?? null,
});

const getData = async ({ offset, type }) => {
  const params = new URLSearchParams();
  params.set("limit", String(data_limit));
  params.set("offset", String(offset ?? 1));
  // API expects `status`; the UI's "all" tab means "no filter" — omit the param.
  if (type && type !== "all") params.set("status", type);

  const { data } = await MainApi.get(
    `${service_request_list_api}?${params.toString()}`
  );
  return {
    custom_services: (data?.data ?? []).map(normalizeItem),
    total_size: data?.total_size ?? 0,
    limit: data?.limit,
    offset: data?.offset,
  };
};

export default function useGetServiceRequestList(params, enabled = true) {
  return useQuery(
    ["my-service-request-list", params?.type, params?.offset],
    () => getData(params),
    {
      staleTime: 0,
      cacheTime: 50000,
      enabled,
      onError: onSingleErrorResponse,
      refetchOnMount: "always",
      refetchOnWindowFocus: false,
    }
  );
}
