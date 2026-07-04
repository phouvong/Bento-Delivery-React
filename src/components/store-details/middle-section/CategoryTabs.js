import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Box, IconButton, Skeleton, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const ALL_TAB_ID = "__all__";

const CategoryTabs = ({ categories, selectedId, onSelect, isLoading }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const scrollRef = useRef(null);
  const tabRefs = useRef({});
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const updateArrowVisibility = () => {
    const el = scrollRef.current;
    if (!el) return;
    const overflow = el.scrollWidth - el.clientWidth;
    setShowLeft(el.scrollLeft > 4);
    setShowRight(overflow > 4 && el.scrollLeft < overflow - 4);
  };

  useEffect(() => {
    updateArrowVisibility();
  }, [categories]);

  // Whenever the selected tab changes (via click OR scroll-spy), make sure
  // it's visible inside the horizontal tabs strip.
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const activeKey = selectedId == null ? ALL_TAB_ID : selectedId;
    const tabEl = tabRefs.current[activeKey];
    if (!tabEl) return;

    const containerRect = container.getBoundingClientRect();
    const tabRect = tabEl.getBoundingClientRect();
    const fullyVisible =
      tabRect.left >= containerRect.left &&
      tabRect.right <= containerRect.right;
    if (fullyVisible) return;

    // Center the tab in the container horizontally
    const tabCenter = tabEl.offsetLeft + tabEl.offsetWidth / 2;
    const target = tabCenter - container.clientWidth / 2;
    container.scrollTo({
      left: Math.max(0, target),
      behavior: "smooth",
    });
  }, [selectedId]);

  const handleScroll = () => updateArrowVisibility();

  const handleNudge = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 200, behavior: "smooth" });
  };

  const tabs = [
    { id: ALL_TAB_ID, name: t("Most Popular") },
    ...(categories || []).map((c) => ({ id: c?.id, name: c?.name })),
  ];

  return (
    <Box
      sx={{
        position: "relative",
        flex: "1 1 0",
        minWidth: 0,
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box
        ref={scrollRef}
        onScroll={handleScroll}
        sx={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          alignItems: "center",
          gap: 2.5,
          overflowX: "auto",
          overflowY: "hidden",
          scrollBehavior: "smooth",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {isLoading
          ? [...Array(6)].map((_, i) => (
              <Skeleton
                key={i}
                variant="text"
                width={70 + (i % 3) * 24}
                height={28}
                sx={{ flexShrink: 0 }}
              />
            ))
          : tabs.map((tab) => {
              const active =
                tab.id === ALL_TAB_ID ? !selectedId : selectedId === tab.id;
              return (
                <Box
                  key={tab.id}
                  ref={(el) => {
                    if (el) tabRefs.current[tab.id] = el;
                    else delete tabRefs.current[tab.id];
                  }}
                  role="button"
                  tabIndex={0}
                  onClick={() =>
                    onSelect(tab.id === ALL_TAB_ID ? null : tab.id)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelect(tab.id === ALL_TAB_ID ? null : tab.id);
                    }
                  }}
                  sx={{
                    flexShrink: 0,
                    cursor: "pointer",
                    height: 40,
                    px: 0.5,
                    py: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderBottom: active
                      ? `3px solid ${theme.palette.primary.main}`
                      : "3px solid transparent",
                    transition: "border-color 120ms ease, color 120ms ease",
                  }}
                >
                  <Typography
                    sx={{
                      whiteSpace: "nowrap",
                      fontSize: { xs: "15px", md: "16px" },
                      fontWeight: active ? 700 : 400,
                      letterSpacing: active ? "-0.48px" : "-0.32px",
                      lineHeight: 1.2,
                      color: active
                        ? theme.palette.primary.main
                        : theme.palette.text.primary,
                      "&:hover": {
                        color: theme.palette.primary.main,
                      },
                    }}
                  >
                    {tab.name}
                  </Typography>
                </Box>
              );
            })}
      </Box>

      {/* Left scroll arrow */}
      {showLeft && (
        <>
          <Box
            sx={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 60,
              pointerEvents: "none",
              background: `linear-gradient(to left, rgba(247,247,247,0), ${theme.palette.background.default})`,
              zIndex: 1,
            }}
          />
          <IconButton
            onClick={() => handleNudge(-1)}
            size="small"
            aria-label={t("Scroll categories left")}
            sx={{
              position: "absolute",
              left: -4,
              top: "50%",
              transform: "translateY(-50%)",
              width: 28,
              height: 28,
              borderRadius: "50%",
              backgroundColor: "#fff",
              boxShadow: "0px 1px 4px rgba(0,0,0,0.15)",
              "&:hover": { backgroundColor: "#fff" },
              zIndex: 2,
            }}
          >
            <ChevronLeftIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </>
      )}

      {/* Right gradient fade + arrow */}
      {showRight && (
        <>
          <Box
            sx={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: 60,
              pointerEvents: "none",
              background: `linear-gradient(to right, rgba(247,247,247,0), ${theme.palette.background.default})`,
              zIndex: 1,
            }}
          />
          <IconButton
            onClick={() => handleNudge(1)}
            size="small"
            aria-label={t("Scroll categories right")}
            sx={{
              position: "absolute",
              right: -4,
              top: "50%",
              transform: "translateY(-50%)",
              width: 28,
              height: 28,
              borderRadius: "50%",
              backgroundColor: "#fff",
              boxShadow: "0px 1px 4px rgba(0,0,0,0.15)",
              "&:hover": { backgroundColor: "#fff" },
              zIndex: 2,
            }}
          >
            <ChevronRightIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </>
      )}
    </Box>
  );
};

export default CategoryTabs;
