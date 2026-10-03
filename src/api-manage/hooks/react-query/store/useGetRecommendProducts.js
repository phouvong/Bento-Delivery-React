import { useQuery } from "react-query";
import MainApi from "../../../MainApi";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";
import { getApiCollection } from "../../../getApiContent";

export const getData = async (pageParams) => {
  const { store_id, page_limit, offset } = pageParams;
  const { data } = await MainApi.get(
    `api/v1/items/recommended?store_id=${store_id}&limit=${page_limit}&offset=${offset}`
  );
  return getApiCollection(data, ["items", "products"]);
};
export const useGetRecommendProducts = (pageParams) => {
  return useQuery("recommend-products", () => getData(pageParams), {
    enabled: false,
    onError: onSingleErrorResponse,
  });
};
