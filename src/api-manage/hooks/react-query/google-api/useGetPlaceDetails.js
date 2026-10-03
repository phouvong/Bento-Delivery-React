import { useQuery } from "react-query";
import { placedetails_api } from "../../../ApiRoutes";
import {
  onErrorResponse,
  onSingleErrorResponse,
} from "../../../api-error-response/ErrorResponses";
import MainApi from "../../../MainApi";
import { getApiContent } from "../../../getApiContent";
const getPlaceDetails = async (placeId) => {
  if (placeId) {
    const { data } = await MainApi.get(
      `${placedetails_api}?placeid=${placeId}`
    );
    return getApiContent(data);
  }
};

export default function useGetPlaceDetails(
  placeId,
  placeDetailsEnabled,
  successHandler
) {
  return useQuery(["placeDetails", placeId], () => getPlaceDetails(placeId), {
    enabled: placeDetailsEnabled,
    onSuccess: successHandler,
    onError: onSingleErrorResponse,
  });
}
