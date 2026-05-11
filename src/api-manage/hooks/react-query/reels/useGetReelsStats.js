import MainApi from "../../../MainApi";
import { reels_stats_api } from "../../../ApiRoutes";
import { useQuery } from "react-query";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";

const getData = async (reelId, guestId) => {
  const guestParam = guestId ? `&guest_id=${guestId}` : "";
  const { data } = await MainApi.get(`${reels_stats_api}?reel_id=${reelId}${guestParam}`);
  return data;
};

export default function useGetReelsStats(reelId, options = {}, guestId) {
  return useQuery(
    ["reels-stats", reelId, guestId],
    () => getData(reelId, guestId),
    {
      enabled: !!reelId,
      staleTime: 5 * 60 * 1000,
      onError: onSingleErrorResponse,
      ...options,
    }
  );
}
