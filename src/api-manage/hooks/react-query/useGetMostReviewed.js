import MainApi from "../../MainApi";
import { most_reviewed_items_api } from "../../ApiRoutes";
import { useQuery } from "react-query";
import { onErrorResponse } from "../../api-error-response/ErrorResponses";
import {
  getCurrentModuleId,
  getCurrentModuleType,
} from "helper-functions/getCurrentModuleType";

const getData = async (pageParams) => {
  const { offset, type } = pageParams;
  const { data } = await MainApi.get(`${most_reviewed_items_api}?type=${type}`);
  return data;
};

export default function useGetMostReviewed(pageParams) {
  const moduleId = typeof window !== "undefined" ? getCurrentModuleId() : null;
  const moduleType =
    typeof window !== "undefined" ? getCurrentModuleType() : null;
  return useQuery(
    ["best-reviewed-items", moduleId, moduleType],
    () => getData(pageParams),
    {
      enabled: !!moduleType,
      onError: onErrorResponse,
    },
  );
}
