import { useEffect, useState } from "react";

/**
 * Tracks scroll direction and offset.
 * Returns { direction: "up" | "down", scrollY } where `direction` only flips
 * after `threshold` px of consecutive movement to avoid jitter.
 *
 * Usage:
 *   const { direction, scrollY } = useScrollDirection({ threshold: 8 });
 *   const isScrolled = scrollY > 40;
 *   const isScrollingDown = direction === "down" && isScrolled;
 */
const useScrollDirection = ({
  threshold = 8,
  bottomBuffer = 120,
  collapseAt = 120,
  expandAt = 40,
} = {}) => {
  // `direction` and `scrollY` are kept for backward compatibility, but the
  // collapse decision is now driven by hysteresis thresholds and ref state so
  // tiny scroll jitter (mobile URL-bar bounce, trackpad micro-scrolls, layout
  // shifts at the footer) can't flip the value back and forth.
  const [direction, setDirection] = useState("up");
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let lastY = window.scrollY;
    let ticking = false;
    let collapsed = false;
    let currentDirection = "up";

    const update = () => {
      const currentY = window.scrollY;
      const diff = currentY - lastY;
      const maxScroll =
        (document.documentElement.scrollHeight || 0) - window.innerHeight;
      const nearBottom = maxScroll - currentY <= bottomBuffer;

      // Hysteresis: enter the "down/collapsed" state only after a real
      // downward scroll past `collapseAt`; exit only after scrolling back
      // above `expandAt`. The gap between the two values is a dead zone that
      // absorbs jitter (trackpad micro-scrolls, URL-bar bounce). Freeze
      // entirely near the footer so end-of-page wobble can't toggle it.
      if (!nearBottom) {
        let nextDirection = currentDirection;
        if (!collapsed && currentY > collapseAt && diff > threshold) {
          collapsed = true;
          nextDirection = "down";
        } else if (collapsed && currentY < expandAt) {
          collapsed = false;
          nextDirection = "up";
        }
        if (nextDirection !== currentDirection) {
          currentDirection = nextDirection;
          setDirection(nextDirection);
        }
        lastY = currentY;
      }
      setScrollY(currentY);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold, bottomBuffer, collapseAt, expandAt]);

  return { direction, scrollY };
};

export default useScrollDirection;
