import MainApi from "../../../MainApi";
import { getModuleId } from "../../../../helper-functions/getModuleId";
import { useInfiniteQuery } from "react-query";

import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { ModuleTypes } from "helper-functions/moduleTypes";

const getSearch = async (pageParams) => {
  const {
    currentTab: search_type,
    searchValue,
    offset,
    page_limit,
    pageParam,
  } = pageParams;

  const moduleType = getCurrentModuleType();
  const isService = moduleType === ModuleTypes.SERVICE;

  let url = `/api/v1/${search_type}/search?name=${searchValue}&offset=${
    pageParam ? pageParam : offset
  }&limit=100`;

  // Use service API if module is service and we are searching for items (services)
  if (isService && search_type === "items") {
    url = `/api/v1/service/search?name=${searchValue}&offset=${
      pageParam ? pageParam : offset
    }&limit=100`;
  }

  const { data } = await MainApi.get(url);

  if (isService && data) {
    return {
      ...data,
      items: data.services || data.items || [],
      stores: data.providers || data.stores || [],
    };
  }

  return data;
};

export default function useGetSearch(pageParams) {
  return useInfiniteQuery(
    ["search-products", pageParams?.currentTab, getModuleId(), getCurrentModuleType()],
    ({ pageParam = 1 }) => getSearch({ ...pageParams, pageParam }),
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages.length + 1;
        return (pageParams?.currentTab === 1
          ? lastPage?.stores?.length
          : lastPage?.items?.length) > 0
          ? nextPage
          : undefined;
      },
      getPreviousPageParam: (firstPage, allPages) => firstPage.prevCursor,
      retry: 3,
      enabled: false,
      onError: onSingleErrorResponse,
      cacheTime: "0",
    }
  );
}
