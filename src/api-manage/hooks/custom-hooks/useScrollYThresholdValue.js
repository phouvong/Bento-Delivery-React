import { useEffect, useRef, useState } from "react";

/**
 * Returns a value based on whether window.scrollY has crossed a threshold.
 *
 * @param {Object} params
 * @param {number} params.threshold - ScrollY threshold (default: 300)
 * @param {*} params.belowValue - Value when scrollY is <= threshold
 * @param {*} params.aboveValue - Value when scrollY is > threshold
 * @returns {*} The current value based on scroll position
 */
const useScrollYThresholdValue = ({
  threshold = 300,
  belowValue,
  aboveValue,
}) => {
  const getInitialValue = () => {
    if (typeof window === "undefined") return belowValue;
    return window.scrollY > threshold ? aboveValue : belowValue;
  };

  const [value, setValue] = useState(getInitialValue);
  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const getValue = () => (window.scrollY > threshold ? aboveValue : belowValue);

    const handleScroll = () => {
      const nextValue = getValue();
      if (nextValue !== valueRef.current) {
        valueRef.current = nextValue;
        setValue(nextValue);
      }
    };

    handleScroll(); // sync on mount / when deps change
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold, belowValue, aboveValue]);

  return value;
};

export default useScrollYThresholdValue;

