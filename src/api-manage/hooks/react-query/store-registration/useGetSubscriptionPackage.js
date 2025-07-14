import MainApi from "../../../MainApi";
import { store_details_api, subscription_package } from "../../../ApiRoutes";
import { useQuery } from "react-query";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";
import { getModuleId } from "helper-functions/getModuleId";

const getData = async (selectedPlan) => {
  if (selectedPlan === "subscription") {
    const { data } = await MainApi.get(
      `${subscription_package}?module_id=${getModuleId()}`
    );
    return data;
  }
};

export default function useGetSubscriptionPackage(selectedPlan) {
  return useQuery(
    ["store-details", selectedPlan],
    () => getData(selectedPlan),
    {
      onError: onSingleErrorResponse,
    }
  );
}
