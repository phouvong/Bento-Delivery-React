import { useQuery } from "react-query";
import { getModuleId } from "../../../../helper-functions/getModuleId";

import { categories_api } from "../../../ApiRoutes";
import MainApi from "../../../MainApi";
import { onErrorResponse } from "../../../api-error-response/ErrorResponses";
import { getApiList } from "../../../getApiContent";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";

// Callers read `response.data` and expect the rows array — that is what this
// endpoint used to put there. In v4.2 the rows moved to `content.data`, so
// rebuild the axios-shaped response with the array back under `data` rather
// than changing 20+ call sites.
const withRows = (response) => ({
  ...response,
  data: getApiList(response?.data) ?? [],
});

const getData = async (searchKey) => {
  const response =
    searchKey && searchKey !== ""
      ? await MainApi.get(`${categories_api}?search=${searchKey}`)
      : await MainApi.get(`${categories_api}`);
  return withRows(response);
};
// `options.enabled` lets a caller opt out entirely — used by the navbar search
// placeholder, which only wants category names it does not already have.
export const useGetCategories = (
  searchKey,
  handleRequestOnSuccess,
  queryKey,
  options = {},
) => {
  const moduleType = getCurrentModuleType();
  const { enabled = true } = options;
  return useQuery(
    [
      queryKey ? queryKey : "catogories-list",
      getModuleId(),
      moduleType,
      searchKey ?? "",
    ],
    () => getData(searchKey),
    {
      enabled: !!moduleType && enabled,
      onSuccess: handleRequestOnSuccess,
      onError: onErrorResponse,
      cacheTime: 300000,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  );
};

const getFeaturedData = async () => {
  return withRows(await MainApi.get(`${categories_api}`));
};
export const useGetFeaturedCategories = (handleSuccess) => {
  const moduleType = getCurrentModuleType();
  return useQuery(
    ["featured-categories-lists", getModuleId(), moduleType],
    () => getFeaturedData(),
    {
      enabled: !!moduleType,
      cacheTime: 1000 * 60, // 1 minute
      staleTime: 1000 * 30, // 30 seconds
      onError: onErrorResponse,
      onSuccess: (data) => {
        if (handleSuccess) {
          handleSuccess(data); // Call handleSuccess if provided
        }
      },
    },
  );
};
