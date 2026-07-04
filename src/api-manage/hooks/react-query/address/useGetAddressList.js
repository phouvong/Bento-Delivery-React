import MainApi from "../../../MainApi";
import { address_list_api } from "../../../ApiRoutes";
import { useQuery } from "react-query";
import { onErrorResponse } from "../../../api-error-response/ErrorResponses";
import { getToken } from "helper-functions/getToken";

const getData = async () => {
  const { data } = await MainApi.get(address_list_api);
  return data;
};

export default function useGetAddressList(handleSuccess) {
  const token = getToken();
  return useQuery(["address-list", token], getData, {
    onSuccess: handleSuccess,
    // Auto-fetch when logged in so React Query caches the result.
    // Opening the navbar popover repeatedly won't re-hit the network;
    // add/edit/delete flows call refetch() to invalidate manually.
    enabled: !!getToken(),
    // Keep data fresh for 30 s — background refetch after that.
    staleTime: 30 * 1000,
    onError: onErrorResponse,
  });
}
