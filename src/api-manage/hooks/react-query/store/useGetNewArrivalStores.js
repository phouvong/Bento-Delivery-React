import MainApi from "../../../MainApi";
import { new_arrival_stores_api } from "../../../ApiRoutes";
import { useQuery } from "react-query";
import { onErrorResponse } from "../../../api-error-response/ErrorResponses";
import {getModuleId} from "helper-functions/getModuleId";
import { getApiCollection } from "../../../getApiContent";

const getData = async (pageParams) => {
  const { offset, type } = pageParams;
  
  const { data } = await MainApi.get(`${new_arrival_stores_api}?type=${type}`);
  return getApiCollection(data, "stores");
};

export default function useGetNewArrivalStores(pageParams) {
  return useQuery(["new-arrival-stores", pageParams?.type, getModuleId()], () => getData(pageParams), {
    enabled: true,
      cacheTime: 1000 * 60 * 5,   // 5 minutes
      staleTime: 1000 * 60 * 4,   // 4 minutes
    onError: onErrorResponse,
  });
}