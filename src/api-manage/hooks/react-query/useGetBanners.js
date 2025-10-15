import MainApi from "../../MainApi";
import { useQuery } from "react-query";
import { onSingleErrorResponse } from "../../api-error-response/ErrorResponses";
import { banners } from "../../ApiRoutes";
import { getModuleId } from "helper-functions/getModuleId";
const getBanners = async (feature) => {
  const url = feature ? `${banners}?feature=${feature}` : banners;
  const { data } = await MainApi.get(url);
  return data;
};

export default function useGetBanners(feature) {
  return useQuery(
    ["banners", feature || "all",getModuleId()], // unique key for each feature or default
    () => getBanners(feature),
    {
      enabled: true, // run always, but handles missing feature internally
      cacheTime: 300000, // 5 mins
      cacheTime: 60 * 1000,
      onError: onSingleErrorResponse,
    }
  );
}
