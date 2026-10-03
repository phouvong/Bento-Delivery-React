import { useQuery } from "react-query";
import MainApi from "../../../MainApi";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";
import { bundle_details_api } from "api-manage/ApiRoutes";
import { getModuleId } from "helper-functions/getModuleId";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { getApiContent } from "../../../getApiContent";

// GET /bundle/{id} — public, no token/guest_id needed. The only browse
// endpoint that fills `items[]`, so the drawer fetches it lazily on open
// rather than the list/home/store-bundles calls carrying it.
const getData = async (id) => {
  const { data } = await MainApi.get(`${bundle_details_api}/${id}`);
  return getApiContent(data);
};

const useGetBundleDetails = (id, enabled = true) => {
  return useQuery(
    ["bundle-details", getModuleId(), getCurrentModuleType(), id],
    () => getData(id),
    {
      enabled: enabled && !!id,
      cacheTime: 5 * 60 * 1000,
      onError: onSingleErrorResponse,
    },
  );
};

export default useGetBundleDetails;
