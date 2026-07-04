import { useQuery } from "react-query";
import MainApi from "../../../MainApi";
import { categories_details_Store_api } from "../../../ApiRoutes";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";

type Params = {
  categoryId?: string | number | null;
  pageLimit?: number | string;
  offset?: number | string;
  type?: string;
  sortBy?: string;
};

const getCategoryStores = async ({
  categoryId,
  pageLimit,
  offset,
  type,
  sortBy,
}: Params) => {
  const sortQuery = sortBy ? `&sort_by=${sortBy}` : "";
  const { data } = await MainApi.get(
    `${categories_details_Store_api}/${categoryId}?limit=${pageLimit}&offset=${offset}&type=${type}${sortQuery}`
  );

  return data;
};

export default function useGetHomeCategoryStores({
  categoryId,
  pageLimit = 20,
  offset = 1,
  type = "all",
  sortBy = "",
}: Params) {
  return useQuery(
    ["home-category-stores", categoryId, pageLimit, offset, type, sortBy],
    () => getCategoryStores({ categoryId, pageLimit, offset, type, sortBy }),
    {
      enabled: !!categoryId,
      onError: onSingleErrorResponse,
      staleTime: 60 * 1000,
      cacheTime: 60 * 1000,
    }
  );
}
