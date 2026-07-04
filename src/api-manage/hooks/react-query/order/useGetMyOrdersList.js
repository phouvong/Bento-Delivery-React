import MainApi from "../../../MainApi";
import { data_limit, my_orders_api, popular_items } from "../../../ApiRoutes";
import { useQuery } from "react-query";
import {
  onErrorResponse,
  onSingleErrorResponse,
} from "../../../api-error-response/ErrorResponses";

const getData = async (pageParams) => {
  console.log({ pageParams });
  const { orderType, offset, moduleId } = pageParams;
  const { data } = await MainApi.get(
    `${my_orders_api}/${orderType}?limit=${data_limit}&offset=${offset}${
      pageParams?.type ? `&type=${pageParams?.type}` : ""
    }`,
    moduleId ? { headers: { moduleId } } : undefined,
  );
  return data;
};

export default function useGetMyOrdersList(pageParams, enabled = false) {
  return useQuery(
    [
      "my-orders-list",
      pageParams?.orderType,
      pageParams?.moduleId,
      pageParams?.type,
      pageParams?.offset,
    ],
    () => getData(pageParams),
    {
      staleTime: 60000,
      cacheTime: 50000,
      enabled: enabled,
      onError: onSingleErrorResponse,
      refetchOnMount: "always",
      refetchOnWindowFocus: false,
    },
  );
}
