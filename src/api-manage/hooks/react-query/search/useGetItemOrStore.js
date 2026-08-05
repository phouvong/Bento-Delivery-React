import MainApi from "../../../MainApi";
import { getModuleId } from "../../../../helper-functions/getModuleId";
import { suggested_items_stores } from "../../../ApiRoutes";
import { useQuery } from "react-query";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";
import { getGuestId } from "helper-functions/getToken";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { ModuleTypes } from "helper-functions/moduleTypes";
import { service_search_suggestion_api } from "components/home/module-wise-components/service/service-api-manage/ApiRoutes";

const getData = async (key) => {
  if (key !== "") {
    const guestId = getGuestId();
    const moduleType = getCurrentModuleType();

    const isService = moduleType === ModuleTypes.SERVICE;
    const url = isService
      ? `${service_search_suggestion_api}?name=${key}&limit=10&offset=1`
      : `${suggested_items_stores}?name=${key}`;

    const { data } = await MainApi.get(url, {
      headers: guestId ? { guestId: guestId } : {},
    });

    if (isService && data) {
      // Map service API response back to items/stores so components don't break
      return {
        items: data.services || data.items || [],
        stores: data.providers || data.stores || [],
      };
    }

    return data;
  }
};

export default function useGetItemOrStore(key) {
  return useQuery(
    ["item-and-store-suggestions", key, getModuleId(), getCurrentModuleType()],
    () => getData(key),
    {
      enabled: false,
      onError: onSingleErrorResponse,
    },
  );
}
