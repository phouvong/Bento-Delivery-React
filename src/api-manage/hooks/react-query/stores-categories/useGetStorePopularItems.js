import { useInfiniteQuery } from "react-query";
import MainApi from "../../../MainApi";
import { store_popular_items_api } from "../../../ApiRoutes";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";
import { getApiContent } from "../../../getApiContent";
import { buildStoreItemQueryParams } from "./buildStoreItemQueryParams";

// Hits /api/v1/stores/popular-items/{id} — a flat, paginated item list for
// one store, ordered by order_count DESC (most ordered first) unless
// `sortBy` overrides it. Shares its filter/sort params with
// /store-categories/items via buildStoreItemQueryParams, but stays a
// separate query key since it's a different endpoint with its own order.
const buildUrl = (params) => {
  const { storeId } = params || {};
  const parts = buildStoreItemQueryParams(params);
  return `${store_popular_items_api}/${storeId}?${parts.join("&")}`;
};

const fetchPage = async (params) => {
  const { data } = await MainApi.get(buildUrl(params));
  return getApiContent(data);
};

export default function useGetStorePopularItems(pageParams) {
  return useInfiniteQuery(
    [
      "store-popular-items",
      pageParams?.storeId,
      pageParams?.offset,
      pageParams?.type,
      pageParams?.filterData,
      pageParams?.minMax,
      pageParams?.ratingCount,
      pageParams?.sortBy,
      pageParams?.search,
    ],
    () => fetchPage(pageParams),
    {
      enabled: Boolean(pageParams?.storeId),
      retry: 1,
      cacheTime: 0,
      onError: onSingleErrorResponse,
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages.length + 1;
        return lastPage?.data?.length > 0 ? nextPage : undefined;
      },
    }
  );
}
