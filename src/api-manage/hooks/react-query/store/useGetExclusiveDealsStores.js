import { useQuery } from "react-query";
import MainApi from "../../../MainApi";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";
import { exclusive_deals_stores_api } from "api-manage/ApiRoutes";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";

const getData = async (params = {}) => {
  const {
    limit = 10,
    offset = 1,
    search,
    sort_by,
    price_min,
    price_max,
    rating,
    type,
    quick_action,
    category_ids,
  } = params;

  const raw = {
    limit,
    offset,
    name: search || undefined,
    sort_by: sort_by || undefined,
    min_price: price_min || undefined,
    max_price: price_max || undefined,
    rating_count: rating || undefined,
    type: type || undefined,
    quick_action: quick_action || undefined,
    category_ids: category_ids || undefined,
  };

  const query = new URLSearchParams(
    Object.fromEntries(
      Object.entries(raw).filter(([, v]) => v !== undefined && v !== null && v !== ""),
    ),
  );

  const { data } = await MainApi.get(`${exclusive_deals_stores_api}?${query}`);
  return data;
};

const useGetExclusiveDealsStores = (params = {}, enabled = true) => {
  return useQuery(
    ["exclusive-deals-stores", getCurrentModuleType(), params],
    () => getData(params),
    {
      cacheTime: 5 * 60 * 1000,
      enabled,
      onError: onSingleErrorResponse,
    },
  );
};

export default useGetExclusiveDealsStores;
