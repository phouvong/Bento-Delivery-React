import { useEffect, useState } from "react";

export const getRemainingTime = (expireAt) => {
  if (!expireAt) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }
  const difference = new Date(expireAt).getTime() - Date.now();
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }
  const totalSeconds = Math.floor(difference / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    expired: false,
  };
};

export const pad = (value) => String(value).padStart(2, "0");

const useCountdown = (expireAt, onExpire) => {
  const [remainingTime, setRemainingTime] = useState(() =>
    getRemainingTime(expireAt),
  );

  useEffect(() => {
    setRemainingTime(getRemainingTime(expireAt));
    if (!expireAt) return;

    const interval = setInterval(() => {
      const remaining = getRemainingTime(expireAt);
      setRemainingTime(remaining);
      if (remaining.expired) {
        clearInterval(interval);
        onExpire?.();
      }
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expireAt]);

  return remainingTime;
};

export default useCountdown;
