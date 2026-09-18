import MainApi from "api-manage/MainApi";
import { useQuery } from "react-query";
import { verified_providers } from "../../ApiRoutes";
import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";

const fetchVerifiedProviders = async () => {
  const { data } = await MainApi.get(verified_providers);
  return data;
};

export const useGetVerifiedProviders = () => {
  return useQuery("verified-providers", fetchVerifiedProviders, {
    onError: onSingleErrorResponse,
  });
};
