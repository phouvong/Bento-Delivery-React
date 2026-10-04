import MainApi from "../../../MainApi";
import { reels_visit_api } from "../../../ApiRoutes";
import { useMutation } from "react-query";

const postVisit = async ({ reelId, guestId }) => {
  const body = { reel_id: reelId };
  if (guestId) body.guest_id = guestId;
  const { data } = await MainApi.post(reels_visit_api, body);
  return data;
};

export default function usePostReelVisit() {
  return useMutation("reels-visit", postVisit);
}
