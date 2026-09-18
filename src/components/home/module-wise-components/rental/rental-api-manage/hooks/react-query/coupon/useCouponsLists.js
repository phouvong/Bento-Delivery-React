import MainApi from "api-manage/MainApi";
import { useQuery } from "react-query";

import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { rental_coupon_list_api } from "api-manage/ApiRoutes";

const fetchCouponLists = async ({ providerId, customerId }) => {
  const params = new URLSearchParams();
  if (providerId != null) params.set("provider_id", String(providerId));
  if (customerId != null) params.set("customer_id", String(customerId));
  // The constant in ApiRoutes still has a trailing space ("/api/v1/rental/coupon/list ").
  // Trim defensively so the URL is always valid.
  const base = rental_coupon_list_api.trim();
  const qs = params.toString();
  const { data } = await MainApi.get(qs ? `${base}?${qs}` : base);
  return data;
};

export const useGetCouponLists = (providerId, customerId) => {
  return useQuery(
    ["coupon-list-vehicle", providerId ?? null, customerId ?? null],
    () => fetchCouponLists({ providerId, customerId }),
    {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      onError: onSingleErrorResponse,
    }
  );
};
