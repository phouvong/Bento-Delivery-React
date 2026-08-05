import { useQuery } from "react-query";
import MainApi from "api-manage/MainApi";
import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { getModule } from "helper-functions/getLanguage";
import { service_campaigns_api } from "../../../ApiRoutes";

const getData = async () => {
  const { data } = await MainApi.get(
    `${service_campaigns_api}?limit=${100}&offset=${1}`,
  );
  return data?.campaigns ?? [];
};

export default function useGetServiceCampaigns() {
  return useQuery(["service-campaigns", getModule()], getData, {
    enabled: true,
    onError: onSingleErrorResponse,
    cacheTime: 5 * 60 * 1000,
    staleTime: 2 * 60 * 1000,
  });
}
