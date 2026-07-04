import MainApi from "../../../MainApi";
import { data_limit, monthly_order_list_api } from "../../../ApiRoutes";
import { useQuery } from "react-query";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";

const getData = async ({ offset, moduleType }) => {
  const { data } = await MainApi.get(
    `${monthly_order_list_api}?limit=${data_limit}&offset=${offset}&module_type=${moduleType}`,
  );
  return data;
};

export default function useGetMonthlyOrderList({ offset, moduleType }, enabled = false) {
  return useQuery(
    ["monthly-order-list", moduleType, offset],
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
