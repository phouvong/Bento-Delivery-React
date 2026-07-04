import { useQuery } from "react-query";
import { pro_plans } from "../../../ApiRoutes";
import MainApi from "../../../MainApi";
import { onErrorResponse } from "../../../api-error-response/ErrorResponses";

const getProPlans = async () => {
  const { data } = await MainApi.get(pro_plans);
  return data;
};

export const useGetProPlans = ({ enabled = true } = {}) => {
  return useQuery("pro-customer-plans", getProPlans, {
    enabled,
    onError: onErrorResponse,
    staleTime: 5 * 60 * 1000,
  });
};

export default useGetProPlans;
