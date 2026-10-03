import { useQuery } from "react-query";
import MainApi from "../../../MainApi";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";
import { getApiContent } from "../../../getApiContent";

const getData = async (pageParams) => {
  const { tempDistance } = pageParams;
  if (tempDistance === 0 || tempDistance) {
    const { data } = await MainApi.get(
      `/api/v1/vehicle/extra_charge?distance=${tempDistance}`
    );
    return getApiContent(data);
  }
};

export default function useGetVehicleCharge(pageParams) {
  // Keyed on `tempDistance` so a stale in-flight request can't overwrite a newer one's cache slot.
  return useQuery(
    ["vehicle-extra-charge", pageParams?.tempDistance],
    () => getData(pageParams),
    {
      enabled: false,
      onError: onSingleErrorResponse,
    }
  );
}
