import { useInfiniteQuery } from "react-query";
import MainApi from "../../../MainApi";

import { get_search_page_data } from "api-manage/ApiRoutes";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";

const getSearch = async (pageParams) => {
  const {
    data_type,
    currentTab,
    searchValue,
    offset,
    page_limit,
    selectedCategoriesIds,
    selectedBrands,
    filterValue,
    rating_count,
    minMax,
    pageParam,
  } = pageParams;
  const selectedCategoriesId =
    selectedCategoriesIds[0] !== "undefined"
      ? JSON.stringify(selectedCategoriesIds)
      : [];
  const selectedBrandId =
    selectedBrands[0] !== "undefined" ? JSON.stringify(selectedBrands) : [];
  const tempFilter = filterValue?.length > 0 ? JSON.stringify(filterValue) : [];

  const { data } = await MainApi.get(
    `${get_search_page_data}?name=${
      data_type === "searched" ? searchValue : ""
    }&offset=${
      pageParam ? pageParam : offset
    }&data_type=${data_type}&list_type=${
      currentTab === 0 ? "item" : "store"
    }&limit=12&category_ids=${selectedCategoriesId}&brand_ids=${selectedBrandId}&filter=${tempFilter}&rating_count=${rating_count}&min_price=${
      minMax[0]
    }&max_price=${minMax[1]}`
  );
  return data;
};

export default function useGetSearchPageData(pageParams, handleSuccess) {
  return useInfiniteQuery(
    [
      "search-products",
      pageParams?.currentTab,
      pageParams?.selectedCategoriesIds,
      pageParams?.selectedBrands,
      pageParams?.filterValue,
      pageParams?.rating_count,
      pageParams?.minMax,
      pageParams?.searchValue,
      pageParams?.selectedBrands,
    ],
    ({ pageParam = 1 }) => getSearch({ ...pageParams, pageParam }),
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages.length + 1;
        return (pageParams?.currentTab === 1
          ? lastPage?.stores?.length
          : lastPage?.products?.length) > 0
          ? nextPage
          : undefined;
      },
      getPreviousPageParam: (firstPage, allPages) => firstPage.prevCursor,
      retry: 1,
      enabled: false,
      onError: onSingleErrorResponse,
      cacheTime: 300000,
      onSuccess: handleSuccess,
    }
  );
}
