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
  const query = useQuery(["address-list", token], getData, {
    onSuccess: handleSuccess,
    // Auto-fetch when logged in so React Query caches the result.
    // Opening the navbar popover repeatedly won't re-hit the network;
    // add/edit/delete flows call refetch() to invalidate manually.
    enabled: !!token,
    // Keep data fresh for 30 s — background refetch after that.
    staleTime: 30 * 1000,
    onError: onErrorResponse,
  });
  // `enabled` only blocks react-query's own auto-triggers — a manual
  // refetch() call bypasses it and fires the request regardless. Several
  // callers refetch() unconditionally on mount, so guard here once instead
  // of adding a token check at every call site.
  const refetch = (...args) => (token ? query.refetch(...args) : undefined);
  return { ...query, refetch };
}
