import {
  order_details_api,
  store_review_api,
  track_order_api,
} from "../../../ApiRoutes";
import { useQuery } from "react-query";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";
import MainApi from "../../../MainApi";
import { getApiCollection } from "../../../getApiContent";

const getData = async (id) => {
  const { data } = await MainApi.get(`${store_review_api}?store_id=${id}`);
  return getApiCollection(data, "reviews");
};

export default function useGetStoreReviews(id) {
  return useQuery("track-order-dxxx", () => getData(id), {
    enabled: false,
    onError: onSingleErrorResponse,
  });
}
