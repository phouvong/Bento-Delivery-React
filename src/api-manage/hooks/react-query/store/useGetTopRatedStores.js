import MainApi from "../../../MainApi";
import { top_rated_stores } from "../../../ApiRoutes";
import { useInfiniteQuery } from "react-query";
import { onErrorResponse } from "../../../api-error-response/ErrorResponses";

const getData = async (pageParams) => {
  const { offset, limit, type, pageParam } = pageParams;
  const { data } = await MainApi.get(
    `${top_rated_stores}?offset=${pageParam}&limit=${limit}&type=${type}`,
  );
  return data;
};

export default function useGetTopRatedStores({ pageParams, enabled = false }) {
  const { offset, limit, type } = pageParams;
  return useInfiniteQuery(
    ["top rated stores", type],
    ({ pageParam = 1 }) => getData({ ...pageParams, pageParam }),
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages.length + 1;
        const items = lastPage?.providers ?? lastPage?.stores ?? [];
        return items.length > 0 ? nextPage : undefined;
      },
      getPreviousPageParam: (firstPage, allPages) => firstPage.prevCursor,
      enabled,
      onError: onErrorResponse,
      cacheTime: "0",
      refetchOnMount: "always",
      refetchOnWindowFocus: false,
    },
  );
}
