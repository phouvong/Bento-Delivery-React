import { useQuery } from "react-query";
import MainApi from "../../../MainApi";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";
import { last_orders_api, last_trips_api } from "api-manage/ApiRoutes";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";

const getData = async (store_id) => {
  const base =
    getCurrentModuleType() === "rental" ? last_trips_api : last_orders_api;
  const url = store_id ? `${base}?store_id=${store_id}` : base;
  const { data } = await MainApi.get(url);
  return data;
};

const useGetLastOrders = ({ store_id } = {}) => {
  const isRental = getCurrentModuleType() === "rental";
  return useQuery(
    ["last-orders", getCurrentModuleType(), store_id],
    () => getData(store_id),
    {
      cacheTime: 5 * 60 * 1000,
      select: (res) => {
        // Rental endpoint returns `trips`; other modules return `orders`
        // (and some return a bare array). Try every known shape.
        const list = res?.trips ?? res?.orders ?? res ?? [];
        if (!Array.isArray(list)) return [];
        // Rental rows don't carry `can_reorder` — skip that gate, otherwise
        // every trip gets filtered out and the section never renders.
        if (isRental) return list;
        return list.filter((o) => o?.can_reorder);
      },
      onError: onSingleErrorResponse,
    }
  );
};

export default useGetLastOrders;
