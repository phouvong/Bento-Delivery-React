import { useQuery } from "react-query";
import { geocode_api } from "../../../ApiRoutes";
import {
  onErrorResponse,
  onSingleErrorResponse,
} from "../../../api-error-response/ErrorResponses";
import MainApi from "../../../MainApi";
import { getApiContent } from "../../../getApiContent";

const getGeoCode = async (location) => {
  if (location) {
    const { data } = await MainApi.get(
      `${geocode_api}?lat=${location.lat}&lng=${location.lng}`
    );
    return getApiContent(data);
  }
};

// Dragging the map emits a new {lat,lng} on every idle event, and the raw
// floats differ in the 10th decimal. Keying the query on the raw object spawns
// a fresh request per pixel of movement, so the result never settles and
// `geoCodeResults` stays undefined — which blanks the search field and leaves
// the Pick button permanently disabled. ~5 decimals is ≈1m of precision, far
// finer than an address needs, and it makes the key stable.
const toStableKey = (location) => {
  const lat = Number(location?.lat);
  const lng = Number(location?.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return `${lat.toFixed(5)},${lng.toFixed(5)}`;
};

export default function useGetGeoCode(location, geoLocationEnable) {
  const stableKey = toStableKey(location);
  return useQuery(["geo-code", stableKey], () => getGeoCode(location), {
    enabled: !!stableKey,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    //onError: onSingleErrorResponse,
  });
}
