import MainApi from "api-manage/MainApi";
import { useMutation } from "react-query";

import { getApiContent } from "api-manage/getApiContent";

// Auth responses carry the payload in `content` (token, is_personal_info, …)
// while `message` stays on the envelope and some handlers toast it. Expose
// both, payload winning on conflict. Only success responses pass through —
// axios rejects on failure, so `error.response.data.message` is unaffected.
const unwrapAuth = (envelope) => {
  const content = getApiContent(envelope);
  const isObject =
    !!content && typeof content === "object" && !Array.isArray(content);
  return isObject ? { message: envelope?.message, ...content } : content;
};


const postHandler = async (userData) => {
  const { data } = await MainApi.post("/api/v1/auth/update-info", userData);
  return unwrapAuth(data);
};
export const useUpdateUserInfo = () => {
  return useMutation("update_user", postHandler);
};
