import { useEffect, useRef, useState } from "react";

/**
 * Custom hook to detect if text content is truncated with ellipsis
 * @param {string} text - The text content to monitor
 * @param {number} tolerance - Pixel tolerance for comparison (default: 1)
 * @returns {Object} - { ref, isEllipsed } - ref to attach to element, boolean indicating if text is truncated
 */
const useTextEllipsis = (text, tolerance = 1) => {
    const [isEllipsed, setIsEllipsed] = useState(false);
    const ref = useRef(null);

    const checkEllipsis = () => {
        const el = ref.current;
        if (!el) {
            setIsEllipsed(false);
            return;
        }

        // Wait for element to be fully rendered
        const scrollW = el.scrollWidth;
        const clientW = el.clientWidth;
        const scrollH = el.scrollHeight;
        const clientH = el.clientHeight;

        // Only consider it ellipsed if there's actual overflow
        // Use a more conservative check - must have actual content and overflow
        const hasWidthOverflow = scrollW > clientW + tolerance;
        const hasHeightOverflow = scrollH > clientH + tolerance;

        setIsEllipsed(hasWidthOverflow || hasHeightOverflow);
    };

    useEffect(() => {
        // Add a small delay to ensure styles are applied
        const timeoutId = setTimeout(() => {
            requestAnimationFrame(checkEllipsis);
        }, 100);

        // Use ResizeObserver for robust updates
        let ro;
        if (typeof ResizeObserver !== "undefined" && ref.current) {
            ro = new ResizeObserver(() => {
                requestAnimationFrame(checkEllipsis);
            });
            ro.observe(ref.current);
        } else {
            // Fallback to window resize
            const onResize = () => requestAnimationFrame(checkEllipsis);
            window.addEventListener("resize", onResize);
            return () => {
                window.removeEventListener("resize", onResize);
                clearTimeout(timeoutId);
            };
        }

        return () => {
            if (ro) {
                ro.disconnect();
            }
            clearTimeout(timeoutId);
        };
    }, [text, tolerance]);

    return { ref, isEllipsed };
};

export default useTextEllipsis;
