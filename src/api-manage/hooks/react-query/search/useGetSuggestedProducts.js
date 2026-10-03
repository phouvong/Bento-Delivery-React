import MainApi from "../../../MainApi";
import { useQuery } from "react-query";

import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";
import { suggestedProducts_api } from "../../../ApiRoutes";
import { getApiCollection } from "../../../getApiContent";

const getSuggestedProducts = async () => {
  const { data } = await MainApi.get(`${suggestedProducts_api}`);
  return getApiCollection(data, ["products", "items"]);
};

export default function useGetSuggestedProducts(handleSearchSuccess) {
  return useQuery("suggested-products", getSuggestedProducts, {
    enabled: false,
    onSuccess: handleSearchSuccess,
    onError: onSingleErrorResponse,
  });
}
