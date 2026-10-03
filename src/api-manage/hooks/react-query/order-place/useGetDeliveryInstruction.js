import MainApi from "../../../MainApi";
import { useQuery } from "react-query";
import { parcel_delivery_instructions } from "../../../ApiRoutes";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";
import { getApiList } from "../../../getApiContent";
import { getModuleId } from "helper-functions/getModuleId";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";

const getDeliveryInstruction = async (params) => {
  const { limit = 10, offset = 1 } = params || {};
  const { data } = await MainApi.get(
    `${parcel_delivery_instructions}?limit=${limit}&offset=${offset}`,
  );
  return getApiList(data);
};

export default function useGetDeliveryInstruction(params) {
  return useQuery(
    [
      "parcel-delivery-instructions",
      getModuleId(),
      getCurrentModuleType(),
      params?.limit,
      params?.offset,
    ],
    () => getDeliveryInstruction(params),
    {
      refetchOnMount: "always",
      refetchOnWindowFocus: false,
      onError: onSingleErrorResponse,
    },
  );
}
