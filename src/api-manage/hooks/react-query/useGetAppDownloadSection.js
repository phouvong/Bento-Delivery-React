import { useQuery } from "react-query";
import { app_download_section_api } from "../../ApiRoutes";
import MainApi from "../../MainApi";
import { onSingleErrorResponse } from "../../api-error-response/ErrorResponses";

const getAppDownloadSection = async () => {
  const { data } = await MainApi.get(app_download_section_api);
  return data;
};

export default function useGetAppDownloadSection() {
  return useQuery(
    ["app-download-section"],
    () => getAppDownloadSection(),
    {
      enabled: true,
      staleTime: 60 * 1000,
      cacheTime: 60 * 1000,
      onError: onSingleErrorResponse,
    }
  );
}
