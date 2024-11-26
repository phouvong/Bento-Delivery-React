import { useQuery } from "react-query";
import MainApi from "api-manage/MainApi";
import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { config_api } from "api-manage/ApiRoutes";
export const getData = async () => {
  const { data } = await MainApi.get(config_api);
  return data;
};
export const useGetConfigData = (handleSuccess) => {
  return useQuery("getConfig", () => getData(), {
    enabled: false,
    onError: onSingleErrorResponse,
    retry: 1,
    cacheTime: 400,
  });
};
