
import { useQuery } from 'react-query'
import MainApi from "api-manage/MainApi";
import {onSingleErrorResponse} from "api-manage/api-error-response/ErrorResponses";
import {item_details_api} from "api-manage/ApiRoutes";

export const getData = async (params) => {
  const { id, campaign, page_limit, offset } = params
  const tempUrl = campaign
    ? `${item_details_api}/${id}?campaign=${campaign}`
    : `${item_details_api}/${id}`
  const { data } = await MainApi.get(`${tempUrl}`)
  return data
}

export const useGetItemDetails = (params, itemSuccess,productUpdate) => {
  // Create a query key that includes the relevant parameters
  const queryKey = ['item-Details', params.id, params.campaign]

  return useQuery(queryKey, () => getData(params), {
    enabled: !productUpdate,
    onSuccess: itemSuccess,
    onError: onSingleErrorResponse,
    retry: false,
    cacheTime: 30000,
    staleTime: 30000,
    // This forces React Query to respect the cache duration even with refetch
    // refetchOnMount: false,
    // refetchOnWindowFocus: false,
    // refetchOnReconnect: false,
  })
}