import { useQuery } from "react-query";
import MainApi from "../../../MainApi";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";
import { last_orders_api, last_trips_api } from "api-manage/ApiRoutes";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { ModuleTypes } from "helper-functions/moduleTypes";

const getData = async (store_id) => {
  const currentModule = getCurrentModuleType();
  const dynamicUrl =
    currentModule === ModuleTypes.RENTAL
      ? `${last_trips_api}${store_id ? "?store_id=" + store_id : ""}`
      : `${last_orders_api}${store_id ? "?store_id=" + store_id : ""}`;

  const { data } = await MainApi.get(dynamicUrl);
  return data;
};

const useGetLastOrders = ({ store_id } = {}) => {
  const currentModule = getCurrentModuleType();
  return useQuery(
    ["last-orders", currentModule, store_id],
    () => getData(store_id),
    {
      cacheTime: 5 * 60 * 1000,
      select: (res) => {
        const list = res?.trips ?? res?.orders ?? res ?? [];
        if (!Array.isArray(list)) return [];
        if (currentModule === ModuleTypes.RENTAL) return list;
        return list.filter((o) => o?.can_reorder);
      },
      onError: onSingleErrorResponse,
    },
  );
};

export default useGetLastOrders;
