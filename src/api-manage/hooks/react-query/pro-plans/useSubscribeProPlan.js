import { useMutation, useQueryClient } from "react-query";
import { pro_subscribe } from "../../../ApiRoutes";
import MainApi from "../../../MainApi";

// POST /api/v1/customer/pro-customer/subscribe
// Body: { plan_id, payment_type, payment_method, callback_url? }
const subscribeProPlan = async (payload) => {
  const { data } = await MainApi.post(pro_subscribe, payload);
  return data;
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
