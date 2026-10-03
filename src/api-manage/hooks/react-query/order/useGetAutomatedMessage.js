import { useQuery } from "react-query";
import MainApi from "../../../MainApi";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";
import { automated_message } from "api-manage/ApiRoutes";
import { getApiCollection } from "../../../getApiContent";

export const getData = async () => {
  const { data } = await MainApi.get(`${automated_message}`);
  return getApiCollection(data);
};
export const useGetOrderCancelReason = () => {
  return useQuery("auto", () => getData(), {
    //onSuccess: onSuccessHandler,
    onError: onSingleErrorResponse,
  });
};
