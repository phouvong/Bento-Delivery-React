import MainApi from "api-manage/MainApi";
import { data_limit } from "../../../ApiRoutes";
import { useQuery } from "react-query";
import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";

// GET /api/v1/service/custom-requests
const CUSTOM_REQUESTS_API = "/api/v1/service/custom-requests";

// The UI reads these legacy fields (category, sub_category, image,
// bidding_count). The new list resource exposes them under different
// names — normalize once here so downstream components stay untouched.
const normalizeItem = (item) => ({
  ...item,
  category: item?.category_name ?? item?.category ?? "",
  sub_category: item?.sub_category_name ?? item?.sub_category ?? "",
  image: item?.category_image_full_url ?? item?.image ?? "",
  bidding_count: item?.bid_count ?? item?.bidding_count ?? 0,
});

const getData = async ({ offset, type }) => {
  const params = new URLSearchParams();
  params.set("limit", String(data_limit));
  params.set("offset", String(offset ?? 1));
  if (type) params.set("status", type);
  const { data } = await MainApi.get(
    `${CUSTOM_REQUESTS_API}?${params.toString()}`
  );
  return {
    custom_services: (data?.data ?? []).map(normalizeItem),
    total_size: data?.total_size ?? 0,
    limit: data?.limit,
    offset: data?.offset,
  };
};

export default function useGetMyCustomServiceList(params, enabled = true) {
  return useQuery(
    ["my-custom-service-list", params?.type, params?.offset],
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
