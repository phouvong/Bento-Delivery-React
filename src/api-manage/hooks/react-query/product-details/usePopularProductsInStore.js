import { useQuery } from "react-query";
import { popular_items_in_store } from "../../../ApiRoutes";
import MainApi from "../../../MainApi";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";
import { getCurrentModuleType } from "../../../../helper-functions/getCurrentModuleType";
import axios from "axios";

// Map UI sort tokens to the backend's expected `sort_by` values. Same
// mapping used in useGetStoreCategoriesItems — keeps call sites consistent.
const SORT_MAP = {
  high: "price_high_low",
  low: "price_low_high",
};

const buildUrl = ({ id, sortBy, type }) => {
  const parts = [`store_id=${id}`];
  if (type && type !== "all") parts.push(`type=${type}`);
  if (sortBy && sortBy !== "Default") {
    parts.push(`sort_by=${SORT_MAP[sortBy] || sortBy}`);
  }
  return `${popular_items_in_store}?${parts.join("&")}`;
};

const getPopularProductsInStore = async (params) => {
  const { moduleId, storeZoneId } = params;
  const url = buildUrl(params);
  if (getCurrentModuleType()) {
    const { data } = await MainApi.get(url);
    return data;
  } else {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}${url}`,
      {
        headers: {
          "Content-Type": "application/json",
          zoneid: storeZoneId,
          moduleId: moduleId,
        },
      }
    );
    return data;
  }
};

export default function usePopularProductsInStore(params) {
  return useQuery(
    [
      "popular-store-items",
      params?.id,
      params?.sortBy ?? null,
      params?.type ?? null,
    ],
    () => getPopularProductsInStore(params),
    {
      enabled: false,
      onError: onSingleErrorResponse,
    }
  );
}
