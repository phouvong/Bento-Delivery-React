import { useQuery } from "react-query";
import { getModuleId } from "../../../../helper-functions/getModuleId";
import MainApi from "../../../MainApi";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";
import { recommended_provider } from "api-manage/ApiRoutes";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";

export const getData = async (pageParams) => {
  const { limit = 10, offset = 1 } = pageParams || {};
  const { data } = await MainApi.get(
    `${recommended_provider}` + `?limit=${limit}&offset=${offset}`,
  );
  return data;
};

export const useGetRecommendStores = (pageParams) => {
  const moduleType = getCurrentModuleType();

  return useQuery(["recommend-stores", getModuleId(), moduleType], () => getData(pageParams), {
    cacheTime: 5 * 60 * 1000,
    onError: onSingleErrorResponse,
  });
};
