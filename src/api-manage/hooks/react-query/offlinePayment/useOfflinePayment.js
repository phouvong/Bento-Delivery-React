import { useMutation } from "react-query";
import MainApi from "../../../MainApi";
import toast from "react-hot-toast";

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


const offlinePayment = async (offlineInfo) => {
  const { data } = await MainApi.put("/api/v1/customer/order/offline-payment", offlineInfo);
  return unwrapPayload(data);
};

export const useOfflinePayment = () => {
  return useMutation("offline_method", (offlinePaymentData) => offlinePayment(offlinePaymentData), {
    onError: (error) => {
      console.error("API Error:", error);
      // You can add more specific error handling here, e.g., displaying a message to the user.
    },
    onSuccess: () => {
      toast.success("Order is successful placed", {
        id: "offline_method",
      });
    },

  });
};