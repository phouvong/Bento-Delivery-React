import { useQuery } from "react-query";
import MainApi from "../../../MainApi";
import { cart_discount_eligibility_api } from "../../../ApiRoutes";
import { getGuestId, getToken } from "helper-functions/getToken";
import { getApiContent } from "../../../getApiContent";

const getData = async (storeId) => {
  const params = new URLSearchParams({ store_id: storeId });
  if (!getToken()) params.set("guest_id", getGuestId());
  const { data } = await MainApi.get(
    `${cart_discount_eligibility_api}?${params}`,
  );
  return getApiContent(data);
};

const useGetCartDiscountEligibility = (storeId, enabled = true) => {
  return useQuery(
    ["cart-discount-eligibility", storeId],
    () => getData(storeId),
    {
      enabled: enabled && !!storeId,
      cacheTime: 60 * 1000,
      refetchOnWindowFocus: false,
      retry: false,
      onError: () => {},
    },
  );
};

export default useGetCartDiscountEligibility;
