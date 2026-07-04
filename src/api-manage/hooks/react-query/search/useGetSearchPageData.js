import { useInfiniteQuery } from "react-query";
import MainApi from "../../../MainApi";
import { get_search_page_data } from "api-manage/ApiRoutes";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { getGuestId } from "helper-functions/getToken";

const getSearch = async (pageParams) => {
  const {
    data_type,
    currentTab,
    searchValue,
    offset,
    page_limit,
    selectedCategoriesIds,
    selectedBrands,
    pageParam,
    sort_by,
    price_min,
    price_max,
    rating,
    category_ids,
    type,
    quick_action,
  } = pageParams;

  const selectedCategoriesId =
    selectedCategoriesIds?.[0] !== "undefined" && selectedCategoriesIds?.length
      ? JSON.stringify(selectedCategoriesIds)
      : [];
  const selectedBrandId =
    selectedBrands?.[0] !== "undefined" && selectedBrands?.length
      ? JSON.stringify(selectedBrands)
      : [];

  const raw = {
    name: data_type === "searched" ? searchValue : "",
    offset: pageParam ?? offset ?? 0,
    data_type,
    list_type: currentTab === 0 ? "item" : "store",
    limit: page_limit ?? 12,
    category_ids:
      category_ids ??
      (selectedCategoriesId.length ? selectedCategoriesId : undefined),
    brand_ids: selectedBrandId.length ? selectedBrandId : undefined,
    sort_by,
    min_price: price_min,
    max_price: price_max,
    rating_count: rating,
    type,
    quick_action,
  };

  const query = new URLSearchParams(
    Object.fromEntries(
      Object.entries(raw).filter(
        ([, v]) => v !== undefined && v !== null && v !== "",
      ),
    ),
  );
  const guestId = getGuestId();

  const { data } = await MainApi.get(
    `${get_search_page_data}?${query.toString()}`,
    {
      headers: guestId ? { guestId: guestId } : {},
    },
  );
  return data;
};

export default function useGetSearchPageData(
  pageParams,
  handleSuccess,
  enabled = false,
) {
  return useInfiniteQuery(
    ["search-products", getCurrentModuleType(), pageParams],
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
      enabled,
      onError: onSingleErrorResponse,
      onSuccess: handleSuccess,
    },
  );
}
