import { useInfiniteQuery } from "react-query";
import MainApi from "api-manage/MainApi";
import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { getModuleId } from "helper-functions/getModuleId";

const getSearch = async (pageParams) => {
  const {
    name,
    date,
    tripType,
    duration,
    min_price,
    max_price,
    offset,
    limit,
    category_ids,
    brand_ids,
    seating_capacity,
    air_condition,
    no_air_condition,
    sort_by,
    top_rated,
    provider_id,
    api_endpoint,
    pickup_location,
    pageParam,
  } = pageParams;
  const { data } = await MainApi.get(
    `${api_endpoint}?name=${name}&top_rated=${
      top_rated || ""
    }&pickup_location=${api_endpoint==="/api/v1/rental/vehicle/get-provider-vehicles" ? "" : pickup_location }&date=${
      date || ""
    }&provider_id=${provider_id || ""}&trip_type=${
      tripType ?tripType: "distance_wise"
    }&duration=${duration}&sortby_price=${sort_by}&min_price=${min_price}&max_price=${max_price}&category_ids=[${category_ids}]&brand_ids=[${brand_ids}]&seating_capacity=${encodeURIComponent(
      JSON.stringify(seating_capacity)
    )}&air_condition=${air_condition}&no_air_condition=${no_air_condition}&offset=${
      pageParam ? pageParam : offset
    }&limit=${limit}`
  );
  return data;
};

export default function useGetRentalSearch(pageParams,handleAPiCallOnSuccess) {
  const moduleId = getModuleId();
  const isProviderVehiclesEndpoint =
    pageParams?.api_endpoint === "/api/v1/rental/vehicle/get-provider-vehicles";

  return useInfiniteQuery(
    [
      "hello",
      pageParams?.name,
      pageParams?.date,
      pageParams?.tripType,
      pageParams?.duration,
      pageParams?.min_price,
      pageParams?.max_price,
      pageParams?.offset,
      pageParams?.limit,
      pageParams?.category_ids,
      pageParams?.brand_ids,
      pageParams?.seating_capacity,
      pageParams?.air_condition,
      pageParams?.no_air_condition,
      pageParams?.sort_by,
      pageParams?.top_rated,
      pageParams?.provider_id,
      pageParams?.api_endpoint,
      moduleId,
      pageParams?.pickup_location,
      pageParams?.all_category
    ],
    ({ pageParam = 1 }) => getSearch({ ...pageParams, pageParam }),
    {
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage || !pageParams?.limit) return undefined;

        const maxPages = Math.ceil(lastPage.total_size / pageParams.limit);
        const nextPage = allPages.length + 1;

        // Check if there are more vehicles and if the next page is within bounds
        return lastPage?.vehicles?.length > 0 && nextPage <= maxPages
          ? nextPage
          : undefined;
      },
      retry: 1,
      enabled:
        Boolean(moduleId) &&
        (isProviderVehiclesEndpoint ? Boolean(pageParams?.provider_id) : true),
      onError: onSingleErrorResponse,
      cacheTime: "0",
      onSuccess:handleAPiCallOnSuccess
    }
  );
}
