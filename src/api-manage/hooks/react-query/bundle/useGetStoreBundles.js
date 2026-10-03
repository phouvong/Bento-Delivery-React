import { useQuery } from "react-query";
import MainApi from "../../../MainApi";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";
import { bundle_store_bundles_api } from "api-manage/ApiRoutes";
import { getModuleId } from "helper-functions/getModuleId";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { getApiCollection } from "../../../getApiContent";

// GET /bundle/store-bundles — public, no token/guest_id needed. `store_id` is
// required by the endpoint (a missing one is a 404, not a 422).
const getData = async (params = {}) => {
  const { store_id, limit = 50, offset = 1, search } = params;

  const raw = {
    store_id,
    limit,
    offset,
    search: search || undefined,
  };

  const query = new URLSearchParams(
    Object.fromEntries(
      Object.entries(raw).filter(
        ([, v]) => v !== undefined && v !== null && v !== "",
      ),
    ),
  );

  const { data } = await MainApi.get(`${bundle_store_bundles_api}?${query}`);
  return getApiCollection(data, "bundles");
};

const useGetStoreBundles = (params = {}, enabled = true) => {
  return useQuery(
    ["store-bundles", getModuleId(), getCurrentModuleType(), params],
    () => getData(params),
    {
      enabled: enabled && !!params?.store_id,
      cacheTime: 5 * 60 * 1000,
      onError: onSingleErrorResponse,
    },
  );
};

export default useGetStoreBundles;
