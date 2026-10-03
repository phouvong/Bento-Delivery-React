import { useQuery } from "react-query";
import MainApi from "../../../MainApi";
import { bogo_home_api } from "api-manage/ApiRoutes";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { getGuestId } from "helper-functions/getToken";
import { getApiContent } from "../../../getApiContent";

const getData = async () => {
  const query = new URLSearchParams({
    guest_id: getGuestId() || "",
  });

  const { data } = await MainApi.get(`${bogo_home_api}?${query}`);
  return getApiContent(data);
};

const useGetBogoHome = (enabled = true) => {
  return useQuery(["bogo-home", getCurrentModuleType()], getData, {
    enabled,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
    onError: () => {},
  });
};

export default useGetBogoHome;
