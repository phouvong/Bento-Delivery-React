import { useQuery } from "react-query";
import MainApi from "../../MainApi";
import { trending_searches_api } from "api-manage/ApiRoutes";
import { onSingleErrorResponse } from "../../api-error-response/ErrorResponses";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";

const getData = async () => {
  const { data } = await MainApi.get(trending_searches_api);
  return data;
};

const useGetTrendingSearches = () => {
  return useQuery(
    ["trending-searches", getCurrentModuleType()],
    getData,
    {
      staleTime: 5 * 60 * 1000,
      onError: onSingleErrorResponse,
    }
  );
};

export default useGetTrendingSearches;
