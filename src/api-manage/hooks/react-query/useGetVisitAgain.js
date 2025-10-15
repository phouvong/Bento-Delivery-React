import { useQuery } from "react-query";
import MainApi from "../../MainApi";
import { onSingleErrorResponse } from "../../api-error-response/ErrorResponses";
import { visit_again } from "api-manage/ApiRoutes";
import {getToken} from "helper-functions/getToken";
import {getModuleId} from "helper-functions/getModuleId";

export const getData = async () => {
  const { data } = await MainApi.get(`${visit_again}`);
  return data;
};
export const useGetVisitAgain = () => {
  return useQuery(["visit again", getToken(), getModuleId()], () => getData(), {
    enabled:!!getToken(),
      cacheTime: 1000 * 60 * 5,   // 5 minutes
      staleTime: 1000 * 60 * 4,   // 4 minutes
    onError: onSingleErrorResponse,
  });
};