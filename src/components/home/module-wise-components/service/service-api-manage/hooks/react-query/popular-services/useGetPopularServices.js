import MainApi from "api-manage/MainApi";
import { popular_service_api, data_limit } from "../../../ApiRoutes";
import { useQuery } from "react-query";
import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";

const getData = async ({ offset = 1, type = "all" }) => {
  const { data } = await MainApi.get(
    `${popular_service_api}?limit=${data_limit}&offset=${offset}${
      type ? `&type=${type}` : ""
    }`
  );
  return data;
};

export default function useGetPopularServices(params, enabled = true) {
  return useQuery(
    ["popular-services", params?.offset, params?.type],
    () => getData(params),
    {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 300000,
      enabled,
      onError: onSingleErrorResponse,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
}
