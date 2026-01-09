import { useMutation } from "react-query";
import MainApi from "../../../MainApi";
import toast from "react-hot-toast";

const offlinePayment = async (offlineInfo) => {
  const { data } = await MainApi.put("/api/v1/customer/order/offline-payment", offlineInfo);
  return data;
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