import MainApi from "../../MainApi";
import { getApiContent } from "../../getApiContent";

// These helpers hand back the raw axios response — callers read `response.data`
// — so unwrap the v4.2 envelope in place and leave the rest of the response
// untouched.
const unwrapResponse = (request) =>
  request.then((response) => ({
    ...response,
    data: getApiContent(response?.data),
  }));

export const GoogleApi = {
  placeApiAutocomplete: (search) => {
    if (search && search !== "") {
      return unwrapResponse(
        MainApi.get(
          `/api/v1/config/place-api-autocomplete?search_text=${search}`
        )
      );
    }
  },
  placeApiDetails: (placeId) => {
    return unwrapResponse(
      MainApi.get(`/api/v1/config/place-api-details?placeid=${placeId}`)
    );
  },
  getZoneId: (location) => {
    return unwrapResponse(
      MainApi.get(
        `/api/v1/config/get-zone-id?lat=${location.lat}&lng=${location.lng}`
      )
    );
  },
  distanceApi: (origin, destination) => {
    if(!origin || !destination) {
      throw new Error("Origin and destination must be provided");
    }
    return unwrapResponse(
      MainApi.get(
        `/api/v1/config/distance-api?origin_lat=${origin.latitude}&origin_lng=${
          origin.longitude
        }&destination_lat=${
          destination.lat ? destination.lat : destination?.latitude
        }&destination_lng=${
          destination.lng ? destination.lng : destination?.longitude
        }&mode=WALK`
      )
    );
  },
  geoCodeApi: (location) => {
    return unwrapResponse(
      MainApi.get(
        `/api/v1/config/geocode-api?lat=${location.lat}&lng=${location.lng}`
      )
    );
  },
};
