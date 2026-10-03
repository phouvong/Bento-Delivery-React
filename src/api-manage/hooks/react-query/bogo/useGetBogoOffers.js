import { useQuery } from "react-query";
import MainApi from "../../../MainApi";
import { bogo_offers_api } from "api-manage/ApiRoutes";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { getGuestId } from "helper-functions/getToken";
import { getApiCollection } from "../../../getApiContent";

const getData = async (params = {}) => {
  const { limit = 20, offset = 1 } = params;

  const query = new URLSearchParams({
    limit,
    offset,
    guest_id: getGuestId() || "",
  });

  const { data } = await MainApi.get(`${bogo_offers_api}?${query}`);
  return getApiCollection(data, "offers");
};

const useGetBogoOffers = (params = {}, enabled = true) => {
  return useQuery(
    ["bogo-offers", getCurrentModuleType(), params],
    () => getData(params),
    {
      enabled,
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
      retry: false,
      onError: () => {},
    },
  );
};

export default useGetBogoOffers;
