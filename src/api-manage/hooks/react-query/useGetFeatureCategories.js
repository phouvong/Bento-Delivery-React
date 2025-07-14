import MainApi from "../../MainApi";
import { categories_details_api } from "../../ApiRoutes";
import { useQuery } from "react-query";
import { onSingleErrorResponse } from "../../api-error-response/ErrorResponses";

const getData = async ({ categoryId, page_limit, offset, type }) => {
  const { data } = await MainApi.get(
    `${categories_details_api}/${categoryId}?limit=${page_limit}&offset=${offset}&type=${type}`
  );
  return data;
};

export default function useGetFeatureCategoriesProducts(pageParams,handleDataSuccess) {
  return useQuery(
    ["categories-details-items", pageParams.categoryId, pageParams.page_limit, pageParams.offset, pageParams.type], 
    () => getData(pageParams), 
    {
      enabled: !!pageParams.categoryId,
      onError: onSingleErrorResponse,
      staleTime: 60 * 1000, // Data stays fresh for 1 minute
      cacheTime: 60 * 1000,
      onSuccess: handleDataSuccess,
    }
  );
}
