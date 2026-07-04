import MainApi from "api-manage/MainApi";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { coupon_list_api } from "api-manage/ApiRoutes";
import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { getToken } from "helper-functions/getToken";

const fetchStoreCouponList = async (storeId) => {
  const params = new URLSearchParams();
  if (storeId) params.set("store_id", String(storeId));
  const queryString = params.toString();
  const url = queryString
    ? `${coupon_list_api}?${queryString}`
    : coupon_list_api;
  const { data } = await MainApi.get(url);
  return data;
};

export const useGetStoreCouponList = (storeId, options = {}) => {
  // Endpoint is gated to authenticated users — backend resolves the
  // customer from the bearer token. Skip entirely for guests.
  const isLoggedIn = !!getToken();
  const query = useQuery(
    ["store-coupon-list", storeId ?? null, isLoggedIn],
    () => fetchStoreCouponList(storeId),
    {
      enabled: isLoggedIn ,
      // The app's QueryClient sets a global staleTime of 2 minutes, which
      // would let stale coupon data show on every store visit without
      // refetching. Force a fresh hit per mount so newly added or removed
      // coupons appear immediately.
      staleTime: 0,
      refetchOnMount: "always",
      refetchOnWindowFocus: false,
      onError: onSingleErrorResponse,
      ...options,
    }
  );

  // Belt-and-braces: when storeId arrives after the first render (parent
  // hasn't fetched store details yet), React Query's enabled-flip doesn't
  // always trigger a refetch reliably in v3 with our global staleTime
  // overrides. Trigger it explicitly.
  useEffect(() => {
    if (isLoggedIn && storeId) query.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeId, isLoggedIn]);

  return query;
};
