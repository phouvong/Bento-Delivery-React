import MainApi from "api-manage/MainApi";
import { related_provider_services_api } from "../../../ApiRoutes";
import { useQuery } from "react-query";
import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";

const getData = async (serviceId) => {
  const { data } = await MainApi.get(
    `${related_provider_services_api}/${serviceId}`
  );
  return data;
};

export default function useGetRelatedProviderServices(serviceId, enabled = true) {
  return useQuery(
    ["related-provider-services", serviceId],
    () => getData(serviceId),
    {
      staleTime: 1000 * 60 * 5,
      cacheTime: 300000,
      enabled: enabled && !!serviceId,
      onError: onSingleErrorResponse,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
}
