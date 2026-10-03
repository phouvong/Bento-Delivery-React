import { useMutation } from "react-query";
import { order_place_api, signIn_api, signUp_api } from "../../../ApiRoutes";
import MainApi from "../../../MainApi";

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


const orderPlace = async (orderData) => {
  const { data } = await MainApi.post(`${order_place_api}`, orderData);
  return unwrapPayload(data);
};
export const useOrderPlace = () => {
  return useMutation("order-place", orderPlace);
};
