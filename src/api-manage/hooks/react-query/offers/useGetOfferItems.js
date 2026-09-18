import { useInfiniteQuery } from "react-query";
import { getModuleId } from "../../../../helper-functions/getModuleId";
import MainApi from "../../../MainApi";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";
import { offers_items_api } from "api-manage/ApiRoutes";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { service_offers_items_api } from "components/home/module-wise-components/service/service-api-manage/ApiRoutes";
import { ModuleTypes } from "helper-functions/moduleTypes";

const getData = async (params = {}, moduleType) => {
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
  const dynamicApiURL =
    moduleType === ModuleTypes.SERVICE
      ? service_offers_items_api
      : offers_items_api;

  const { data } = await MainApi.get(`${dynamicApiURL}?${query.toString()}`);
  return data;
};

const useGetOfferItems = (params = {}, enabled = true) => {
  const moduleType = getCurrentModuleType();

  return useInfiniteQuery(
    ["offer-items", getModuleId(), moduleType, params],
    ({ pageParam = 1 }) => getData({ ...params, pageParam }, moduleType),
    {
      getNextPageParam: (lastPage, allPages) => {
        const items =
          lastPage?.products ??
          lastPage?.items ??
          (Array.isArray(lastPage) ? lastPage : []);
        return Array.isArray(items) && items.length > 0
          ? allPages.length + 1
          : undefined;
      },
      enabled,
      cacheTime: 5 * 60 * 1000,
      onError: onSingleErrorResponse,
    },
  );
};

export default useGetOfferItems;
