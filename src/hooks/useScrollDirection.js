import { useEffect, useState } from "react";

/**
 * Tracks scroll direction and collapse state for scroll-away headers.
 *
 * Returns { direction, isCollapsed, isPastThreshold }:
 *  - direction:        "up" | "down" — flips with hysteresis (see below)
 *  - isCollapsed:      true after a real downward scroll past `collapseAt`,
 *                      false again only above `expandAt` (dead zone between
 *                      the two absorbs jitter: URL-bar bounce, micro-scrolls)
 *  - isPastThreshold:  true once scrolled past `pastThresholdAt` (for
 *                      scroll-to-top buttons and similar)
 *
 * PERFORMANCE: this hook deliberately does NOT expose a live `scrollY`.
 * State updates fire only when one of the booleans flips — a handful of
 * times per gesture instead of every scrolled pixel. A previous version
 * returned `scrollY` from state, which re-rendered every subscribed
 * component (layout, navbar) on every frame and made the header
 * collapse/expand animation stutter on mobile. Don't add it back; if a
 * consumer needs continuous position, give it its own rAF listener.
 *
 * Usage:
 *   const { isCollapsed } = useScrollDirection({ threshold: 8 });
 */
// Shared rAF-throttled scroll watcher. Fires the callbacks only when a
// boolean flips, never per-pixel. Returns a cleanup function.
const startScrollWatcher = ({
  threshold,
  bottomBuffer,
  collapseAt,
  expandAt,
  pastThresholdAt,
  onCollapseChange,
  onPastThresholdChange,
}) => {
  let lastY = window.scrollY;
  let ticking = false;
  let collapsed = false;
  let pastThreshold = window.scrollY > pastThresholdAt;
  onPastThresholdChange?.(pastThreshold);

  const update = () => {
    const currentY = window.scrollY;
    const diff = currentY - lastY;
    const maxScroll =
      (document.documentElement.scrollHeight || 0) - window.innerHeight;
    const nearBottom = maxScroll - currentY <= bottomBuffer;

    // Hysteresis: enter the "down/collapsed" state only after a real
    // downward scroll past `collapseAt`; exit only after scrolling back
    // above `expandAt`. The gap between the two is a dead zone that absorbs
    // jitter (URL-bar bounce, micro-scrolls). Freeze entirely near the
    // footer so end-of-page wobble can't toggle it.
    if (!nearBottom) {
      if (!collapsed && currentY > collapseAt && diff > threshold) {
        collapsed = true;
        onCollapseChange?.(true);
      } else if (collapsed && currentY < expandAt) {
        collapsed = false;
        onCollapseChange?.(false);
      }
      lastY = currentY;
    }

    const nextPast = currentY > pastThresholdAt;
    if (nextPast !== pastThreshold) {
      pastThreshold = nextPast;
      onPastThresholdChange?.(nextPast);
    }
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
};

const useScrollDirection = ({
  threshold = 8,
  bottomBuffer = 120,
  collapseAt = 120,
  expandAt = 40,
  pastThresholdAt = 300,
} = {}) => {
  const [direction, setDirection] = useState("up");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPastThreshold, setIsPastThreshold] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    return startScrollWatcher({
      threshold,
      bottomBuffer,
      collapseAt,
      expandAt,
      pastThresholdAt,
      onCollapseChange: (collapsed) => {
        setIsCollapsed(collapsed);
        setDirection(collapsed ? "down" : "up");
      },
      onPastThresholdChange: setIsPastThreshold,
    });
  }, [threshold, bottomBuffer, collapseAt, expandAt, pastThresholdAt]);

  return { direction, isCollapsed, isPastThreshold };
};

/**
 * CSS-driven variant: toggles `className` on <html> instead of touching any
 * React state, so scrolling and collapsing cause ZERO React renders. Style
 * the collapse purely in CSS, e.g.:
 *
 *   "html.mobile-nav-collapsed &": { transform: "translateY(-116px)" }
 *
 * Animate `transform`/`opacity` only (compositor-friendly) — never
 * max-height or margins, which reflow the page on every animation frame.
 */
export const useScrollCollapseClass = (
  className = "mobile-nav-collapsed",
  { threshold = 8, bottomBuffer = 120, collapseAt = 120, expandAt = 40, enabled = true } = {}
) => {
  useEffect(() => {
    const root = document.documentElement;
    // When disabled (e.g. on section/category pages), ensure any stale
    // collapse class is removed so the header stays fully visible.
    if (!enabled || typeof window === "undefined") {
      root.classList.remove(className);
      return;
    }
    const stop = startScrollWatcher({
      threshold,
      bottomBuffer,
      collapseAt,
      expandAt,
      pastThresholdAt: Infinity,
      onCollapseChange: (collapsed) =>
        root.classList.toggle(className, collapsed),
    });
    return () => {
      stop();
      root.classList.remove(className);
    };
  }, [className, threshold, bottomBuffer, collapseAt, expandAt, enabled]);
};

export default useScrollDirection;
