import { useQuery } from "react-query";
import MainApi from "../../MainApi";
import {onSingleErrorResponse} from "../../api-error-response/ErrorResponses";
import { getApiCollection } from "../../getApiContent";


export const getData = async (pageParams) => {
    const { store_id, limit, offset } = pageParams;
    const { data } = await MainApi.get(
        `api/v1/items/recommended?filter=all&limit=${limit}&offset=${offset}`
    );
    return getApiCollection(data, "products");
};
export const useGetRecommendProductsForHome = (pageParams) => {
    return useQuery("recommend-products-in-home", () => getData(pageParams), {
        enabled: false,
        onError: onSingleErrorResponse,
    });
};
