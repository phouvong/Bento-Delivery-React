import { useQuery } from "react-query";
import MainApi from "../../../MainApi";
import { happy_hour_stores_api } from "api-manage/ApiRoutes";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { getApiCollection } from "../../../getApiContent";

const getData = async (params = {}) => {
  const { limit = 10, offset = 1, running = true } = params;

  const raw = {
    limit,
    offset,
    running: running ? 1 : undefined,
  };

  const query = new URLSearchParams(
    Object.fromEntries(
      Object.entries(raw).filter(
        ([, v]) => v !== undefined && v !== null && v !== "",
      ),
    ),
  );

  const { data } = await MainApi.get(`${happy_hour_stores_api}?${query}`);
  return getApiCollection(data, "stores");
};

const useGetHappyHourStores = (params = {}, enabled = true) => {
  return useQuery(
    ["happy-hour-stores", getCurrentModuleType(), params],
    () => getData(params),
    {
      enabled,
      cacheTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      // Stays silent on failure — the modal shows its own empty state.
      retry: false,
      onError: () => {},
    },
  );
};

export default useGetHappyHourStores;
