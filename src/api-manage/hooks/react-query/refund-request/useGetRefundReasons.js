import { useQuery } from "react-query";
import { onErrorResponse } from "../../../api-error-response/ErrorResponses";
import MainApi from "../../../MainApi";
import { refund_reasons_api } from "../../../ApiRoutes";
import { getApiCollection } from "../../../getApiContent";

const getData = async () => {
  const { data } = await MainApi.get(refund_reasons_api);
  return getApiCollection(data, "refund_reasons");
};
export const useGetRefundReasons = () => {
  return useQuery("get_refund_list", () => getData(), {
    enabled: false,
    onError: onErrorResponse,
  });
};
