import { useQuery } from "react-query";
import MainApi from "../../MainApi";
import { onSingleErrorResponse } from "../../api-error-response/ErrorResponses";
import { top_offer_api } from "api-manage/ApiRoutes";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";

const getData = async () => {
  const { data } = await MainApi.get(top_offer_api);
  return data;
};

const useGetTopOffer = () => {
  return useQuery(["top-offer", getCurrentModuleType()], getData, {
    cacheTime: 5 * 60 * 1000,
    onError: onSingleErrorResponse,
  });
};

export default useGetTopOffer;
