import MainApi from "../../../MainApi";
import { getModuleId } from "../../../../helper-functions/getModuleId";
import { data_limit, monthly_order_list_api } from "../../../ApiRoutes";
import { useQuery } from "react-query";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";
import { getApiCollection } from "../../../getApiContent";

const getData = async ({ offset, moduleType }) => {
  const { data } = await MainApi.get(
    `${monthly_order_list_api}?limit=${data_limit}&offset=${offset}&module_type=${moduleType}`,
  );
  return getApiCollection(data, "items");
};

export default function useGetMonthlyOrderList({ offset, moduleType }, enabled = false) {
  return useQuery(
    ["monthly-order-list", getModuleId(), moduleType, offset],
    () => getData({ offset, moduleType }),
    {
      staleTime: 60000,
      cacheTime: 50000,
      enabled: enabled && !!moduleType,
      onError: onSingleErrorResponse,
      refetchOnMount: "always",
      refetchOnWindowFocus: false,
    },
  );
}
