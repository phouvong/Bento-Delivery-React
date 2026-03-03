import { useQuery } from "react-query";

import { categories_api } from "../../../ApiRoutes";
import MainApi from "../../../MainApi";
import { onErrorResponse } from "../../../api-error-response/ErrorResponses";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";

const getData = async (searchKey) => {
  if (searchKey && searchKey !== "") {
    return await MainApi.get(`${categories_api}/${searchKey}`);
  } else {
    return await MainApi.get(`${categories_api}`);
  }
};
export const useGetCategories = (
  searchKey,
  handleRequestOnSuccess,
  queryKey
) => {
  const moduleType = getCurrentModuleType();
  return useQuery(
    [queryKey ? queryKey : "catogories-list", moduleType],
    () => getData(searchKey),
    {
      enabled:  !!moduleType,
      onSuccess: handleRequestOnSuccess,
      onError: onErrorResponse,
      cacheTime: 300000,
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  );
};

const getFeaturedData = async () => {
  return await MainApi.get(`${categories_api}`);
};
export const useGetFeaturedCategories = (handleSuccess) => {
  const moduleType = getCurrentModuleType();
  return useQuery(["featured-categories-lists", moduleType], () => getFeaturedData(), {
     enabled: !!moduleType,
    cacheTime: 1000 * 60,        // 1 minute
    staleTime: 1000 * 30,        // 30 seconds
    onError: onErrorResponse,
    onSuccess: (data) => {
      if (handleSuccess) {
        handleSuccess(data); // Call handleSuccess if provided
      }
    },
  });
};

