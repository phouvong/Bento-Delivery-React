import { useQuery } from "react-query";
import MainApi from "../../../MainApi";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";
import { quick_delivery_stores_api } from "api-manage/ApiRoutes";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";

/**
 * Params (all optional — only pass what's needed per context):
 *   limit, offset, ad, sort_by, quick_action, price_min, price_max,
 *   type (comma-separated: halal,non_veg,...), category_ids (comma-separated), rating
 */
const getData = async (params = {}) => {
  const {
    limit = 10,
    offset = 1,
    ad,
    sort_by,
    quick_action,
    price_min,
    price_max,
    type,
    category_ids,
    rating,
    with_items,
    search,
  } = params;

  const rawParams = {
    limit,
    offset,
    ad,
    sort_by,
    quick_action,
    price_min,
    price_max,
    type,
    category_ids,
    rating,
    with_items,
    search,
  };

  const query = new URLSearchParams(
    Object.fromEntries(
      Object.entries(rawParams).filter(
        ([, v]) => v !== undefined && v !== null && v !== "",
      ),
    ),
  );

  const { data } = await MainApi.get(
    `${quick_delivery_stores_api}?${query.toString()}`,
  );
  return data;
};

const useGetQuickDeliveryStores = (params = {}) => {
  return useQuery(
    ["quick-delivery-stores", getCurrentModuleType(), params],
    () => getData(params),
    {
      cacheTime: 5 * 60 * 1000,
      onError: onSingleErrorResponse,
    },
  );
};

export default useGetQuickDeliveryStores;
