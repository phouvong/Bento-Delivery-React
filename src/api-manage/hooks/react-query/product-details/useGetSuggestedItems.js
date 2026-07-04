import { useQuery } from "react-query";
import { suggested_items_api } from "../../../ApiRoutes";
import MainApi from "../../../MainApi";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";

const fetchSuggestedItems = async ({
  storeId,
  type,
  recommended = 1,
  offset = 1,
  limit = 50,
}) => {
  const params = new URLSearchParams();
  params.set("recommended", String(recommended));
  params.set("store_id", String(storeId));
  params.set("offset", String(offset));
  params.set("limit", String(limit));
  if (type) params.set("type", type);
  const { data } = await MainApi.get(
    `${suggested_items_api}?${params.toString()}`
  );
  return data;
};

export default function useGetSuggestedItems({
  storeId,
  type,
  recommended = 1,
  offset = 1,
  limit = 50,
  enabled = true,
} = {}) {
  return useQuery(
    ["suggested-items", storeId, type, recommended, offset, limit],
    () => fetchSuggestedItems({ storeId, type, recommended, offset, limit }),
    {
      enabled: Boolean(storeId) && enabled,
      staleTime: 1000 * 60 * 5,
      onError: onSingleErrorResponse,
    }
  );
}
