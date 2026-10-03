import { useQuery } from "react-query";
import MainApi from "../../../MainApi";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";
import { bundle_home_api } from "api-manage/ApiRoutes";
import { getModuleId } from "helper-functions/getModuleId";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { getApiCollection } from "../../../getApiContent";

// GET /bundle/home — public, no token/guest_id needed. Strip only: takes
// `limit` (default 10 server-side) and no `offset`, and its content carries
// no `pagination` block.
const getData = async (params = {}) => {
  const { limit = 10, store_id, search } = params;

  const raw = {
    limit,
    store_id: store_id || undefined,
    search: search || undefined,
  };

  const query = new URLSearchParams(
    Object.fromEntries(
      Object.entries(raw).filter(
        ([, v]) => v !== undefined && v !== null && v !== "",
      ),
    ),
  );

  const { data } = await MainApi.get(`${bundle_home_api}?${query}`);
  return getApiCollection(data, "bundles");
};

const useGetBundleHome = (params = {}, enabled = true) => {
  return useQuery(
    ["bundle-home", getModuleId(), getCurrentModuleType(), params],
    () => getData(params),
    {
      enabled,
      cacheTime: 5 * 60 * 1000,
      onError: onSingleErrorResponse,
    },
  );
};

export default useGetBundleHome;
