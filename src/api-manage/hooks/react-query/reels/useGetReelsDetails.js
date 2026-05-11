import MainApi from "../../../MainApi";
import { reels_details_api } from "../../../ApiRoutes";
import { useQuery } from "react-query";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";

const getData = async (reelId, guestId) => {
  const guestParam = guestId ? `&guest_id=${guestId}` : "";
  const { data } = await MainApi.get(
    `${reels_details_api}?reel_id=${reelId}&stream=1${guestParam}`,
    { headers: { Range: "bytes=0-2097151" } }
  );
  return data;
};

export default function useGetReelsDetails(reelId, options = {}, guestId) {
  return useQuery(
    ["reels-details", reelId, guestId],
    () => getData(reelId, guestId),
    {
      enabled: !!reelId,
      onError: onSingleErrorResponse,
      ...options,
    }
  );
}
