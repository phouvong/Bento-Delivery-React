import { useQuery } from "react-query";
import MainApi from "../../../MainApi";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";
import {recommended_provider} from "api-manage/ApiRoutes";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";

export const getData = async () => {
  const { data } = await MainApi.get(
    `${recommended_provider}`
  );
  return data;
};

export const useGetRecommendStores = (pageParams) => {
  return useQuery(["recommend-stores",getCurrentModuleType()], () => getData(pageParams), {
    cacheTime: 5 * 60 * 1000, // 5 minutes in milliseconds
    onError: onSingleErrorResponse,
  });
};