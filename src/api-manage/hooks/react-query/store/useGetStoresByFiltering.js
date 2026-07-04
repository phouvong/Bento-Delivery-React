import MainApi from "../../../MainApi";
import { filtered_stores_api } from "../../../ApiRoutes";
import { useInfiniteQuery, useQuery } from "react-query";
import { onErrorResponse } from "../../../api-error-response/ErrorResponses";
import { getModuleId } from "helper-functions/getModuleId";

const getData = async (pageParams) => {
  const { limit, type, pageParam, filteredData, sortBy, rating, categoryIds } =
    pageParams;
  const parts = [
    `offset=${pageParam}`,
    `limit=${limit}`,
    `store_type=${filteredData}`,
  ];
  if (sortBy) parts.push(`sort_by=${sortBy}`);
  if (rating) parts.push(`rating=${rating}`);
  if (categoryIds) parts.push(`category_ids=${categoryIds}`);
  const { data } = await MainApi.get(
    `${filtered_stores_api}/${
      type === "take away" ? "take_away" : type
    }?${parts.join("&")}`
  );
  return data;
};

export default function useGetStoresByFiltering(pageParams) {
  const { type, filteredData, sortBy, rating, categoryIds, enabled } =
    pageParams;
  const moduleId = getModuleId();

  return useInfiniteQuery(
    [type, pageParams?.currentTab, filteredData, moduleId, sortBy, rating, categoryIds],
    ({ pageParam = 1 }) => getData({ ...pageParams, pageParam }),
    {
      getNextPageParam: (lastPage, allPages) => {
        const stores = lastPage?.stores ?? [];
        return stores.length > 0 ? allPages.length + 1 : undefined;
      },
      enabled: enabled !== undefined ? enabled : false,
      onError: onErrorResponse,
      staleTime: 5 * 60 * 1000,
      cacheTime: 5 * 60 * 1000,
    }
  );
}

export function useGetStoresWithoutInfiniteScroll(pageParams) {
  const {
    offset,
    limit,
    type,
    filteredData,
    sortBy,
    rating,
    categoryIds,
    enabled,
  } = pageParams;
  const moduleId = getModuleId();
  return useQuery(
    [
      "stores-paginated",
      type,
      filteredData,
      offset,
      limit,
      moduleId,
      sortBy,
      rating,
      categoryIds,
    ],
    () => getData({ ...pageParams, pageParam: offset }),
    {
      enabled: enabled !== undefined ? enabled : false,
      onError: onErrorResponse,
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000,
      cacheTime: 5 * 60 * 1000,
    }
  );
}

// export  function useGetStoresByFiltering(pageParams) {
//     const { offset, limit, type } = pageParams;
//     return useInfiniteQuery(
//         [offset, limit, type],
//         ({ pageParam = offset }) => getData(pageParams),
//         {
//             getNextPageParam: (lastPage, allPages) => {
//                 const nextPage = allPages.length + 1;
//                 return lastPage?.stores?.length > 0 ? nextPage : undefined;
//             },
//             getPreviousPageParam: (firstPage, allPages) => firstPage.prevCursor,
//             enabled: false,
//             onError: onErrorResponse,
//             cacheTime: "0",
//         }
//     );
// }
