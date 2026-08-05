import MainApi from "api-manage/MainApi";
import { explore_service_api, data_limit } from "../../../ApiRoutes";
import { useInfiniteQuery } from "react-query";
import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";

const getData = async ({ categoryId = "all", pageParam = 1 } = {}) => {
  const { data } = await MainApi.get(
    `${explore_service_api}?limit=${data_limit}&offset=${pageParam}&category_id=${categoryId}`
  );
  return data;
};

export default function useGetExploreServices(params = {}, enabled = true) {
  const { categoryId = "all" } = params;
  return useInfiniteQuery(
    ["explore-services", categoryId],
    ({ pageParam = 1 }) => getData({ categoryId, pageParam }),
    {
      getNextPageParam: (lastPage, allPages) => {
        const services = lastPage?.services ?? [];
        return services.length > 0 ? allPages.length + 1 : undefined;
      },
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 5,
      enabled,
      onError: onSingleErrorResponse,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
}