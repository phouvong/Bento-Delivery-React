import { useQuery } from "react-query";
import MainApi from "../../../MainApi";
import { bogo_store_offers_api } from "api-manage/ApiRoutes";
import { getGuestId } from "helper-functions/getToken";
import { getApiCollection } from "../../../getApiContent";

// GET /bogo/store-offers — a store's live BOGO bundles; empty `data` means none running.
const getData = async (storeId, params = {}) => {
  const { limit = 10, offset = 1 } = params;

  const query = new URLSearchParams({
    store_id: storeId,
    limit,
    offset,
    guest_id: getGuestId() || "",
  });

  const { data } = await MainApi.get(`${bogo_store_offers_api}?${query}`);
  return getApiCollection(data, "offers");
};

const useGetBogoStoreOffers = (storeId, params = {}, enabled = true) => {
  return useQuery(
    ["bogo-store-offers", storeId, params],
    () => getData(storeId, params),
    {
      enabled: enabled && !!storeId,
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
      retry: false,
      onError: () => {},
    },
  );
};

export default useGetBogoStoreOffers;
