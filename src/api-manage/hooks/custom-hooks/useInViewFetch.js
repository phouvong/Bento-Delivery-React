import { useEffect, useRef, useState } from "react";

export const useInViewFetch = (fetchFn, options = {}) => {
  const ref = useRef(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && !triggered) {
          setTriggered(true);
          fetchFn?.(); // Call refetch() only when visible
        }
      },
      { threshold: 0.1, ...options }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [fetchFn, triggered, options]);

  return { ref };
};