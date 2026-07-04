import MainApi from "../../../MainApi";
import {
  suggested_items_stores,
  suggestedProducts_api,
} from "../../../ApiRoutes";
import { useQuery } from "react-query";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";
import { getGuestId } from "helper-functions/getToken";

const getData = async (key) => {
  if (key !== "") {
    const guestId = getGuestId();
    const { data } = await MainApi.get(
      `${suggested_items_stores}?name=${key}`,
      {
        headers: guestId ? { guestId: guestId } : {},
      },
    );
    return data;
  }
};

export default function useGetItemOrStore(key) {
  return useQuery(["item-and-store-suggestions", key], () => getData(key), {
    enabled: false,
    onError: onSingleErrorResponse,
  });
}
