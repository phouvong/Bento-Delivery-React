import { useMutation, useQueryClient } from "react-query";
import { pro_subscribe } from "../../../ApiRoutes";
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


// POST /api/v1/customer/pro-customer/subscribe
// Body: { plan_id, payment_type, payment_method, callback_url? }
const subscribeProPlan = async (payload) => {
  const { data } = await MainApi.post(pro_subscribe, payload);
  return unwrapPayload(data);
};

export const useSubscribeProPlan = () => {
  const queryClient = useQueryClient();
  return useMutation(subscribeProPlan, {
    onSuccess: () => {
      queryClient.invalidateQueries("pro-customer-active-offer");
      queryClient.invalidateQueries("profile-info");
    },
  });
};

export default useSubscribeProPlan;
