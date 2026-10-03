import { useQuery } from "react-query"
import { onErrorResponse } from "../../../api-error-response/ErrorResponses"
import MainApi from "../../../MainApi"
import { common_condition_api } from "../../../ApiRoutes"
import { getApiList } from "../../../getApiContent"

// Callers read `conditions.data` and expect the rows array. v4.2 moved the rows
// to `content.data`, so put them back under `data` on the axios-shaped result.
const getConditionsData = async() =>{
    const response = await MainApi.get(`${common_condition_api}`)
    return { ...response, data: getApiList(response?.data) ?? [] }
}

export const useGetCommonConditions = () =>{
    return useQuery("common-condition", () => getConditionsData(), {
        staleTime: 1000 * 60 * 8,
        cacheTime: 1000 * 60 * 8,
        onError: onErrorResponse,
    });
}
