import { useInfiniteQuery } from "react-query";
import MainApi from "../../../MainApi";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";
import { offers_stores_api } from "api-manage/ApiRoutes";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";

const getData = async (params = {}) => {
  const {
    search = "",
    limit = 10,
    price_min,
    price_max,
    rating,
    sort_by,
    category_ids,
    type,
    pageParam = 1,
  } = params;

  const raw = {
    search,
    limit,
    offset: pageParam,
    price_min,
    price_max,
    rating,
    sort_by,
    category_ids,
    type,
  };
  const query = new URLSearchParams(
    Object.fromEntries(
      Object.entries(raw).filter(
        ([, v]) => v !== undefined && v !== null && v !== "",
      ),
    ),
  );

  const { data } = await MainApi.get(
    `${offers_stores_api}?${query.toString()}`,
  );
  return data;
};

const useGetOfferStores = (params = {}, enabled = true) => {
  return useInfiniteQuery(
    ["offer-stores", getCurrentModuleType(), params],
    ({ pageParam = 1 }) => getData({ ...params, pageParam }),
    {
      getNextPageParam: (lastPage, allPages) => {
        const stores =
          lastPage?.stores ?? (Array.isArray(lastPage) ? lastPage : []);
        return Array.isArray(stores) && stores.length > 0
          ? allPages.length + 1
          : undefined;
      },
      enabled,
      cacheTime: 5 * 60 * 1000,
      onError: onSingleErrorResponse,
    },
  );
};

export default useGetOfferStores;
