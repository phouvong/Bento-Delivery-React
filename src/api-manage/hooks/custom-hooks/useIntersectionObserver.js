import { useEffect, useRef, useState } from "react";

/**
 * Custom hook for intersection observer
 * @param {Object} options - Intersection observer options
 * @param {number} options.threshold - Threshold for intersection (default: 0.2)
 * @param {string} options.rootMargin - Root margin for intersection observer
 * @param {boolean} options.triggerOnce - Whether to trigger only once (default: true)
 * @returns {Object} - { ref, isIntersecting, hasTriggered }
 */
export const useIntersectionObserver = (options = {}) => {
  const {
    threshold = 0.2,
    rootMargin = "0px",
    triggerOnce = true,
  } = options;

  const ref = useRef(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          
          if (!hasTriggered) {
            setHasTriggered(true);
          }
          
          // Disconnect if triggerOnce is true
          if (triggerOnce) {
            observer.disconnect();
          }
        } else {
          setIsIntersecting(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, hasTriggered]);

  return {
    ref,
    isIntersecting,
    hasTriggered,
  };
};
