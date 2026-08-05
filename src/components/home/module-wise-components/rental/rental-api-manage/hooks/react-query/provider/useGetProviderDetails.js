import MainApi from "api-manage/MainApi";
import { useQuery } from "react-query";
import { getModuleId } from "helper-functions/getModuleId";
import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { provider_details_banner } from "../../../ApiRoutes";

const fetchProviderDetails = async (id, moduleId) => {
  console.log({moduleId});
  
  if (!id || !moduleId) return null;
  const { data } = await MainApi.get(`${provider_details_banner}/${id}`);
  return data;
};

// Use the fetcher function in useQuery
export const useGetProviderDetails = (id) => {
  const moduleId = getModuleId();
  return useQuery(
    ["provider-details", id, moduleId],
    () => fetchProviderDetails(id, moduleId),
    {
      onError: onSingleErrorResponse,
      enabled: !!id && !!moduleId, // Only run the query if id and moduleId are available
    }
  );
};
