import { useQuery } from "react-query";
import MainApi from "../../../MainApi";
import { bogo_offers_api } from "api-manage/ApiRoutes";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { getGuestId } from "helper-functions/getToken";
import { getApiCollection } from "../../../getApiContent";

// GET /bogo/offers/{id|slug} — the offer card plus every store's bundle for
// it. `content.offer` is the same shape as /bogo/home's offer card;
// `content.data` is one row per store (`bundle_id`, `store`, `buy_items`,
// `free_items`, `bundle_price`/`original_price`/`final_price`). Aliased to
// `bundles` here since `data` is already used as the generic collection key.
const getData = async (id, params = {}) => {
  const { limit = 10, offset = 1 } = params;

  const query = new URLSearchParams({
    limit,
    offset,
    guest_id: getGuestId() || "",
  });

  const { data } = await MainApi.get(`${bogo_offers_api}/${id}?${query}`);
  return getApiCollection(data, "bundles");
};

const useGetBogoOfferDetails = (id, params = {}, enabled = true) => {
  return useQuery(
    ["bogo-offer-details", id, getCurrentModuleType(), params],
    () => getData(id, params),
    {
      enabled: enabled && !!id,
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
      retry: false,
      onError: () => {},
    },
  );
};

export default useGetBogoOfferDetails;
