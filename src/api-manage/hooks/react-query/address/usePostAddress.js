import MainApi from "../../../MainApi";
import { add_address_api, profile_update_api } from "../../../ApiRoutes";
import { useMutation } from "react-query";

import { getApiContent } from "api-manage/getApiContent";

// Mutation payloads (tax, surge price, order id, redirect_link) live in
// `content` while `message` stays on the envelope and some handlers toast it.
// Expose both, payload winning. Only success responses reach here — axios
// rejects on failure, so error.response.data.message is untouched.
const unwrapPayload = (envelope) => {
  const content = getApiContent(envelope);
  const isObject =
    !!content && typeof content === "object" && !Array.isArray(content);
  return isObject ? { message: envelope?.message, ...content } : content;
};


const addData = async (postData) => {
  const { data } = await MainApi.post(add_address_api, postData);
  return unwrapPayload(data);
};

export default function usePostAddress() {
  return useMutation("add-address", addData);
}
