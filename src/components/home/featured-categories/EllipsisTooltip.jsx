import { Tooltip } from "@mui/material";
import { useRef, useState, useEffect } from "react";

const EllipsisTooltip = ({ title, children }) => {
    const wrapperRef = useRef(null);
    const textRef = useRef(null);
    const [isEllipsed, setIsEllipsed] = useState(false);

    const checkEllipsis = () => {
        if (!textRef.current) return;
        const el = textRef.current;

        // scrollWidth > offsetWidth means text is overflowing
        setIsEllipsed(el.scrollWidth > el.offsetWidth + 1);
    };

    useEffect(() => {
        // run after DOM paint
        requestAnimationFrame(checkEllipsis);

        let ro;
        if (typeof ResizeObserver !== "undefined") {
            ro = new ResizeObserver(() => requestAnimationFrame(checkEllipsis));
            if (wrapperRef.current) ro.observe(wrapperRef.current);
            if (textRef.current) ro.observe(textRef.current);
        } else {
            const onResize = () => requestAnimationFrame(checkEllipsis);
            window.addEventListener("resize", onResize);
            return () => window.removeEventListener("resize", onResize);
        }

        return () => {
            if (ro) ro.disconnect();
        };
    }, [title, children]);

    return (
        <Tooltip
            title={isEllipsed ? title : ""}
            placement="bottom"
            arrow
            disableHoverListener={!isEllipsed}
        >
            <div
                ref={wrapperRef}
                style={{
                    width: "100%",
                    minWidth: 0,
                }}
            >
                <div
                    ref={textRef}
                    style={{
                        display: "inline-block",
                        width: "100%",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        verticalAlign: "middle",
                    }}
                >
                    {children}
                </div>
            </div>
        </Tooltip>
    );
};

export default EllipsisTooltip;
