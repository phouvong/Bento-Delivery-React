import { useQuery } from "react-query";
import MainApi from "api-manage/MainApi";
import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { paid_ads } from "api-manage/ApiRoutes";
export const getData = async () => {
  const { data } = await MainApi.get(paid_ads);
  return data;
};
export const useGetAdds = (handleSuccess) => {
  return useQuery("getAdds", () => getData(), {
    enabled: false,
    onError: onSingleErrorResponse,
    retry: 1,
    onSuccess: handleSuccess,
    cacheTime: 400,
  });
};
