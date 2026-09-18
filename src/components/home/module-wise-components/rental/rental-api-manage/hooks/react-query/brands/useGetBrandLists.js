import MainApi from "api-manage/MainApi";
import { useQuery } from "react-query";
import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { vehicle_brand_list } from "../../../ApiRoutes";
import { useSelector } from "react-redux";
import { getCurrentModuleId } from "helper-functions/getCurrentModuleType";

// Define a standalone fetcher function
const fetchBrandLists = async () => {
  const { data } = await MainApi.get(
    `${vehicle_brand_list}?offset=1&limit=100`
  );
  return data;
};

// Use the fetcher function in useQuery
export const useGetBrandLists = () => {
  const selectedModuleId = useSelector(
    (state) => state?.utilsData?.selectedModule?.id
  );
  const moduleId = selectedModuleId || getCurrentModuleId();

  return useQuery(["brand-list", moduleId], fetchBrandLists, {
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    onError: onSingleErrorResponse,
    enabled: Boolean(moduleId),
  });
};
