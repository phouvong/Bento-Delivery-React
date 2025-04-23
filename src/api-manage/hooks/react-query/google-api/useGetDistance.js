import { useQuery } from "react-query";
import { distance_api } from "../../../ApiRoutes";
import {
  onErrorResponse,
  onSingleErrorResponse,
} from "../../../api-error-response/ErrorResponses";
import MainApi from "../../../MainApi";
const getDistance = async (origin, destination, mode) => {
  if ((origin, destination)) {
    const { data } = await MainApi.get(
      `${distance_api}?origin_lat=${origin?.lat}&origin_lng=${
        origin?.lng
      }&destination_lat=${
        destination.lat ? destination.lat : destination?.latitude
      }&destination_lng=${
        destination.lng ? destination.lng : destination?.longitude
      }&mode=${mode || "WALK"}`
    );
    return data;
  }
};

export default function useGetDistance(origin, destination, mode) {
  return useQuery(
    ["distance", origin, destination],
    () => getDistance(origin, destination, mode),
    {
      enabled: false,
      onError: onSingleErrorResponse,
    }
  );
}
