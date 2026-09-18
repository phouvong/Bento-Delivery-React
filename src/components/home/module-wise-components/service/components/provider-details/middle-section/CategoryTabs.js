import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { alpha, Box, IconButton, Skeleton, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const ALL_TAB_ID = "__all__";

const CategoryTabs = ({
  categories,
  selectedId,
  onSelect,
  isLoading,
  showAllTab = true,
}) => {
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
    // scrollLeft runs 0 → negative in RTL; absolute distance keeps the
    // boundary checks direction-agnostic.
    const scrolled = Math.abs(el.scrollLeft);
    setShowLeft(scrolled > 4);
    setShowRight(overflow > 4 && scrolled < overflow - 4);
  };

  useEffect(() => {
    updateArrowVisibility();
  }, [categories]);

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

    // Center the tab in the container horizontally. offsetLeft is physical
    // (from the left edge), while RTL scrollLeft runs 0 → -max — convert the
    // physical offset into the direction-correct scroll position.
    const tabCenter = tabEl.offsetLeft + tabEl.offsetWidth / 2;
    const target = tabCenter - container.clientWidth / 2;
    const maxScroll = container.scrollWidth - container.clientWidth;
    const clamped = Math.min(Math.max(0, target), Math.max(0, maxScroll));
    const rtl = theme.direction === "rtl";
    container.scrollTo({
      left: rtl ? clamped - maxScroll : clamped,
      behavior: "smooth",
    });
  }, [selectedId]);

  const handleScroll = () => updateArrowVisibility();

  const handleNudge = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    // Forward (dir=1) means scrollLeft decreasing in RTL — invert the delta.
    const rtl = theme.direction === "rtl";
    el.scrollBy({ left: (rtl ? -dir : dir) * 200, behavior: "smooth" });
  };

  const tabs = [
    ...(showAllTab ? [{ id: ALL_TAB_ID, name: t("Most Popular") }] : []),
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
            backgroundColor: (theme) => theme.palette.background.paper,
            boxShadow: (theme) => `0px 1px 4px ${alpha(theme.palette.text.primary, 0.15)}`,
            "&:hover": { backgroundColor: (theme) => theme.palette.background.paper },
            zIndex: 2,
          }}
        >
          <ChevronLeftIcon
            sx={{
              fontSize: 18,
              transform: theme.direction === "rtl" ? "scaleX(-1)" : "none",
            }}
          />
        </IconButton>
      )}

      {/* Right gradient fade + arrow */}
      {showRight && (
        <>
          <Box
            sx={{
              position: "absolute",
              right: 32,
              top: 0,
              bottom: 0,
              width: 40,
              pointerEvents: "none",
              background: (theme) => `linear-gradient(to right, transparent, ${theme.palette.background.default})`,
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
              backgroundColor: (theme) => theme.palette.background.paper,
              boxShadow: (theme) => `0px 1px 4px ${alpha(theme.palette.text.primary, 0.15)}`,
              "&:hover": { backgroundColor: (theme) => theme.palette.background.paper },
              zIndex: 2,
            }}
          >
            <ChevronRightIcon
              sx={{
                fontSize: 18,
                transform: theme.direction === "rtl" ? "scaleX(-1)" : "none",
              }}
            />
          </IconButton>
        </>
      )}
    </Box>
  );
};

export default CategoryTabs;
