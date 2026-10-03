import { useQuery } from "react-query";
import MainApi from "api-manage/MainApi";
import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { paid_ads } from "api-manage/ApiRoutes";
import { getModuleId } from "helper-functions/getModuleId";
import { getApiList } from "../../getApiContent";
export const getData = async () => {
  const { data } = await MainApi.get(paid_ads);
  return getApiList(data);
};
export const useGetAdds = (handleSuccess) => {
  return useQuery(["getAdds",getModuleId()], () => getData(), {
    enabled: true,
    onError: onSingleErrorResponse,
    retry: 1,
    staleTime: 60 * 1000,
    cacheTime: 60 * 1000,
    onSuccess: handleSuccess,
  });
};
