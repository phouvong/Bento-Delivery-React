import { useQuery } from "react-query";
import MainApi from "api-manage/MainApi";
import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { service_request_list_api } from "../../../ApiRoutes";

// GET /api/v1/service/requested-services/{id}
// Normalize category_name/category_image_full_url to the field names the UI
// already reads (mirrors useGetServiceRequestList).
const normalizeDetail = (item) => {
  if (!item) return null;
  return {
    ...item,
    category: item?.category_name ?? item?.category ?? "",
    image: item?.category_image_full_url ?? item?.image ?? null,
  };
};

const getData = async (id) => {
  const { data } = await MainApi.get(`${service_request_list_api}/${id}`);
  return normalizeDetail(data?.data ?? null);
};

export default function useGetServiceRequestDetails(params, enabled = true) {
  return useQuery(
    ["service-request-details", params?.id],
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
