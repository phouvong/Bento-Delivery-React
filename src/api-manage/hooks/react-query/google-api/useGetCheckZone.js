// check_zone
import { useQuery } from "react-query";
import { check_zone, zoneId_api } from "../../../ApiRoutes";
import { onErrorResponse } from "../../../api-error-response/ErrorResponses";
import MainApi from "../../../MainApi";
import { getApiContent } from "../../../getApiContent";
const getZone = async (location, zoneId) => {
  if (location?.lat && zoneId) {
    const { data } = await MainApi.get(
      `${check_zone}?lat=${location?.lat}&lng=${location?.lng}&zone_id=${zoneId}`
    );
    return getApiContent(data);
  }
};

export default function useGetCheckZone(location, zoneId, successHandler) {
  return useQuery(
    ["zoneId", zoneId, location?.lat, location?.lng],
    () => getZone(location, zoneId),
    {
      onSuccess: successHandler,
      onError: onErrorResponse,
    }
  );
}
