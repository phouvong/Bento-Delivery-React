import { useQuery } from "react-query";
import MainApi from "../../MainApi";
import { moduleList } from "../../ApiRoutes";
import { getApiList } from "../../getApiContent";
import { onErrorResponse } from "../../api-error-response/ErrorResponses";

// Fully independent from useGetModule.js (that hook is reused across the app
// and always resolves the browsing session's zone). This one is for flows
// that need the module list for an ARBITRARY, explicitly chosen zone (e.g.
// vendor registration's "Business Zone" picker) — it takes zoneId as a plain
// argument and never touches localStorage/session zone state.
const getModuleByZone = async (zoneId) => {
  const { data } = await MainApi.get(`${moduleList}?zone_id=${zoneId}`);
  return getApiList(data);
};

export default function useGetModuleByZone(zoneId) {
  return useQuery(["module-list-by-zone", zoneId], () => getModuleByZone(zoneId), {
    enabled: !!zoneId,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    onError: onErrorResponse,
  });
}
