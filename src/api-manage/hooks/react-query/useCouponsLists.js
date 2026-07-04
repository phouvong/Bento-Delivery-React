
import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { rental_coupon_list_api } from "api-manage/ApiRoutes";
import MainApi from "api-manage/MainApi";
import { useQuery } from "react-query";


// Define a standalone fetcher function
const fetchCouponLists = async (moduleId) => {
  const { data } = await MainApi.get(
    `${rental_coupon_list_api}`,
    moduleId ? { headers: { moduleId } } : undefined,
  );
  return data;
};

// Use the fetcher function in useQuery
export const useGetCouponLists = (moduleId) => {
  return useQuery(["coupon-list-vehicle", moduleId], () => fetchCouponLists(moduleId), {
    staleTime: 5 * 60 * 1000, // Data will be considered fresh for 5 minutes
    cacheTime: 10 * 60 * 1000, // Data will be cached for 10 minutes
    refetchOnWindowFocus: false,
    onError: onSingleErrorResponse, // Prevent refetching when the window regains focus
  });
};