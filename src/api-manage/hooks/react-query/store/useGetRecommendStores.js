import { useQuery } from "react-query";
import MainApi from "../../../MainApi";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";
import {recommended_provider} from "api-manage/ApiRoutes";

export const getData = async () => {

  const { data } = await MainApi.get(
    `${recommended_provider}`
  );
  return data;
};
export const useGetRecommendStores = (pageParams) => {
  return useQuery("recommend-stores", () => getData(pageParams), {
    enabled: false,
    onError: onSingleErrorResponse,
  });
};
