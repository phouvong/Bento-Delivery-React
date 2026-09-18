import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { getModuleId } from "../../../../helper-functions/getModuleId";
import { useQuery } from "react-query";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";
import { store_details_api } from "../../../ApiRoutes";
import MainApi from "../../../MainApi";

const getData = async (store_id) => {
  if (store_id) {
    const { data } = await MainApi.get(`${store_details_api}/${store_id}`);
    return data;
  }
};

export default function useGetStoreDetails(store_id) {
  const moduleType = getCurrentModuleType();
  return useQuery(
    ["store-details_s", store_id, getModuleId(), moduleType],
    () => getData(store_id, moduleType),
    {
      enabled: false,
      onError: onSingleErrorResponse,
    },
  );
}
