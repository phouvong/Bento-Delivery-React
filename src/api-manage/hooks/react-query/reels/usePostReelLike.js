import MainApi from "../../../MainApi";
import { reels_like_api } from "../../../ApiRoutes";
import { useMutation } from "react-query";

const postLike = async ({ reelId, guestId }) => {
  const body = { reel_id: reelId };
  if (guestId) body.guest_id = guestId;
  const { data } = await MainApi.post(reels_like_api, body);
  return data;
};

export default function usePostReelLike() {
  return useMutation("reels-like", postLike);
}
