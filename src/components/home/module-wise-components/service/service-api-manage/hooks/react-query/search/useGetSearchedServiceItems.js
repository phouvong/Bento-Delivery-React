import MainApi from "api-manage/MainApi";
import { search_api } from "../../../ApiRoutes";
import { useInfiniteQuery } from "react-query";
import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";

const getData = async ({ searchKey, limit, pageParam }) => {
  const { data } = await MainApi.get(
    `${search_api}?name=${encodeURIComponent(searchKey)}&limit=${limit}&offset=${pageParam}`
  );
  // Normalise: the service search returns `services`; map to `products` so
  // callers can use a single shape regardless of module.
  return {
    ...data,
    products: data?.services ?? data?.products ?? [],
    total_size: data?.total_count ?? data?.total_size ?? 0,
  };
};

export default function useGetSearchedServiceItems(pageParams) {
  const { searchKey, limit = 12 } = pageParams ?? {};
  return useInfiniteQuery(
    ["searched-service-items", searchKey],
    ({ pageParam = 1 }) => getData({ searchKey, limit, pageParam }),
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages.length + 1;
        return lastPage?.products?.length > 0 ? nextPage : undefined;
      },
      retry: 3,
      enabled: false,
      onError: onSingleErrorResponse,
      cacheTime: 0,
    }
  );
}
