import { useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import MainApi from "../../../MainApi";
import { happy_hour_running_api } from "api-manage/ApiRoutes";
import { getModuleId } from "helper-functions/getModuleId";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { getApiContent } from "../../../getApiContent";

const getData = async () => {
  const { data } = await MainApi.get(happy_hour_running_api);
  return getApiContent(data);
};

const useGetRunningHappyHour = (enabled = true) => {
  const queryClient = useQueryClient();
  const query = useQuery(
    ["happy-hour-running", getModuleId(), getCurrentModuleType()],
    getData,
    {
      enabled,
      cacheTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      // Decorative banner — a failed lookup must stay silent, not surface an
      // error toast, so no onSingleErrorResponse here.
      retry: false,
      onError: () => {},
    },
  );

  const isRunning = query.data?.is_running;
  const happyHourId = query.data?.happy_hour?.id;
  const remainingSeconds = Number(query.data?.happy_hour?.remaining_seconds);

  useEffect(() => {
    if (!isRunning || !(remainingSeconds > 0)) return;
    const timer = setTimeout(
      () => {
        queryClient.invalidateQueries("happy-hour-running");
        queryClient.invalidateQueries("happy-hour-stores");
        queryClient.invalidateQueries("cart-discount-eligibility");
        queryClient.invalidateQueries("checkout-summary");
      },
      (remainingSeconds + 1) * 1000,
    );
    return () => clearTimeout(timer);
  }, [isRunning, happyHourId, remainingSeconds, queryClient]);

  return query;
};

export default useGetRunningHappyHour;
