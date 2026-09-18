import { useQuery } from "react-query";
import MainApi from "api-manage/MainApi";
import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { provider_details } from "components/home/module-wise-components/rental/rental-api-manage/ApiRoutes";

const getData = async (provider_id) => {
  const { data } = await MainApi.get(
    `${provider_details}?provider_id=${provider_id || null}`
  );
  return data;
};

export default function useGetVehicleFromThisVendor(
  handleSuccess,
  provider_id
) {
  return useQuery(
    ["get-vehicle-from-this-vendor", provider_id],
    () => getData(provider_id),
    {
      enabled: !!provider_id,
      onSuccess: handleSuccess,
      onError: onSingleErrorResponse,
    }
  );
}
