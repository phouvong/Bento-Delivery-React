import MainApi from "api-manage/MainApi";
import { filtered_stores_api } from "../../../ApiRoutes";
import { useInfiniteQuery } from "react-query";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";

const getData = async (pageParams) => {
  const { limit, pageParam, filteredData } = pageParams;
  const { data } = await MainApi.get(
    `${filtered_stores_api}?offset=${pageParam}&limit=${limit}&store_type=${filteredData}`
  );
  return data;
};

export default function useGetServicesByFiltering(pageParams) {
  const { offset, limit, filteredData } = pageParams;

  return useInfiniteQuery(
    [filteredData, offset],
    ({ pageParam = 1 }) => getData({ ...pageParams, pageParam }),
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages.length + 1;
        return lastPage?.stores?.length > 0 ? nextPage : undefined;
      },
      getPreviousPageParam: (firstPage, allPages) => firstPage.prevCursor,
      enabled: false,
      onError: onErrorResponse,
      cacheTime: "0",
    }
  );
}