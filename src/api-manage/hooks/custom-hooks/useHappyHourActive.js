import { useEffect, useState } from "react";
import useGetRunningHappyHour from "../react-query/happy-hour/useGetRunningHappyHour";

const useHappyHourActive = () => {
  const { data } = useGetRunningHappyHour();
  const happyHour = data?.is_running ? data?.happy_hour : null;

  // Anchored to the server-computed `remaining_seconds` at response time, so
  // the countdown is immune to client clock / timezone drift — unlike parsing
  // `ends_at` locally.
  const [expireAt, setExpireAt] = useState(null);
  useEffect(() => {
    const remainingSeconds = Number(happyHour?.remaining_seconds) || 0;
    setExpireAt(
      remainingSeconds > 0 ? Date.now() + remainingSeconds * 1000 : null,
    );
  }, [happyHour?.id, happyHour?.remaining_seconds]);

  return {
    isActive: Boolean(happyHour) && Boolean(expireAt),
    happyHour,
    expireAt,
  };
};

export default useHappyHourActive;
