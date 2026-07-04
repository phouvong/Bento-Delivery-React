import { useQuery } from "react-query";
import { getCurrentModuleType } from "../../../../helper-functions/getCurrentModuleType";
import { pro_active_offer } from "../../../ApiRoutes";
import MainApi from "../../../MainApi";
import { onErrorResponse } from "../../../api-error-response/ErrorResponses";

const getProActiveOffer = async (moduleType) => {
  const { data } = await MainApi.get(pro_active_offer, {
    params: moduleType ? { module_type: moduleType } : undefined,
  });
  return data;
};

export const useGetProActiveOffer = ({ enabled = true } = {}) => {
  const moduleType = getCurrentModuleType();
  return useQuery(
    ["pro-customer-active-offer", moduleType ?? null],
    () => getProActiveOffer(moduleType),
    {
      enabled,
      onError: onErrorResponse,
      staleTime: 5 * 60 * 1000,
      cacheTime: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
};

export default useGetProActiveOffer;
