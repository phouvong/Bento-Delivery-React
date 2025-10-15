import MainApi from "../../MainApi";
import { useQuery } from "react-query";
import { onSingleErrorResponse } from "../../api-error-response/ErrorResponses";
import { campaigns_item } from "../../ApiRoutes";
import { getModule } from "helper-functions/getLanguage";

const getData = async () => {
  const { data } = await MainApi.get(campaigns_item);
  return data;
};

export default function useGetItemCampaigns() {
  return useQuery(["item-campaigns",getModule()], getData, {
    enabled: true,
    onError: onSingleErrorResponse,
    cacheTime: 5 * 60 * 1000, // 5 minutes
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
