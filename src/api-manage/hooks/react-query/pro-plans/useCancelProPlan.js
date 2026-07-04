import { useMutation, useQueryClient } from "react-query";
import { pro_cancel } from "../../../ApiRoutes";
import MainApi from "../../../MainApi";

// POST /api/v1/customer/pro-customer/cancel — operates on auth'd user.
const cancelProPlan = async () => {
  const { data } = await MainApi.post(pro_cancel);
  return data;
};

export const useCancelProPlan = () => {
  const queryClient = useQueryClient();
  return useMutation(cancelProPlan, {
    onSuccess: () => {
      queryClient.invalidateQueries("pro-customer-active-offer");
      queryClient.invalidateQueries("profile-info");
    },
  });
};

export default useCancelProPlan;
