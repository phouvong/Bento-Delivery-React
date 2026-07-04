import React from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import { useRouter } from "next/router";

// ─── Helpers ───────────────────────────────────────────────────────────────

const parseHref = (href = "") => {
  const [pathname, search] = href.split("?");
  const query = Object.fromEntries(new URLSearchParams(search || ""));
  return { pathname, query };
};

// ─── Component ─────────────────────────────────────────────────────────────

const CustomPageBreadCrumb = ({ items = [], color }) => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const fontSize = isMobile ? "12px" : "14px";
  const iconSize = isMobile ? "12px" : "14px";

  if (!items.length) return null;

  const navigate = (href) => router.push(parseHref(href));

  const resolvedColor = color || theme.palette.neutral?.[600] || "#757575";

  const baseStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize,
    fontWeight: 500,
    lineHeight: 1.1,
    letterSpacing: "-0.48px",
    color: resolvedColor,
    whiteSpace: "nowrap",
  };

  const linkStyle = {
    ...baseStyle,
    cursor: "pointer",
    userSelect: "none",
    textDecoration: "none",
  };

  const iconStyle = {
    display: "flex",
    alignItems: "center",
    lineHeight: 1,
    flexShrink: 0,
  };

  return (
    <nav
      aria-label="breadcrumb"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "4px",
        flexWrap: "nowrap",
        minWidth: 0,
      }}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        const iconEl = item.icon ? (
          <span style={iconStyle}>{item.icon}</span>
        ) : null;

        const sep =
          index > 0 ? (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                flexShrink: 0,
                color: color || theme.palette.neutral?.[500] || "#9CA3AF",
              }}
            >
              <i
                className="fi fi-rs-angle-small-right"
                style={{ fontSize: iconSize, display: "flex", lineHeight: 1 }}
              />
            </span>
          ) : null;

        if (isLast) {
          return (
            <React.Fragment key={item.key}>
              {sep}
              <span
                style={{
                  ...baseStyle,
                  maxWidth: "200px",
                  overflow: "hidden",
                }}
              >
                {iconEl}
                <span
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    display: "block",
                  }}
                >
                  {item.label}
                </span>
              </span>
            </React.Fragment>
          );
        }

        const handleClick = item.onRedirect
          ? () => navigate(item.onRedirect)
          : typeof item.onClick === "function"
          ? item.onClick
          : undefined;

        const handleKeyDown = handleClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleClick();
              }
            }
          : undefined;

        return (
          <React.Fragment key={item.key}>
            {sep}
            <span
              role={item.onRedirect ? "link" : "button"}
              tabIndex={0}
              onClick={handleClick}
              onKeyDown={handleKeyDown}
              style={linkStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = theme.palette.primary.main;
                const underline =
                  e.currentTarget.querySelector(".bcl-underline");
                if (underline)
                  underline.style.backgroundColor = theme.palette.primary.main;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = baseStyle.color;
                const underline =
                  e.currentTarget.querySelector(".bcl-underline");
                if (underline)
                  underline.style.backgroundColor = baseStyle.color;
              }}
            >
              {iconEl}
              <span style={{ position: "relative" }}>
                {item.label}
                <span
                  className="bcl-underline"
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: "-2px",
                    height: "1px",
                    backgroundColor: resolvedColor,
                  }}
                />
              </span>
            </span>
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default CustomPageBreadCrumb;
