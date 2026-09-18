import { Typography, Box, Stack, Skeleton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { t } from "i18next";
import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import AllServices from "./AllServices";
import { HomeComponentsWrapper } from "components/home/HomePageComponents";
import { useGetCategories } from "api-manage/hooks/react-query/all-category/all-categorys";

// ─── Main ──────────────────────────────────────────────────────────────────

const Services = ({ title }) => {
  const [selectedMenuIndex, setSelectedMenuIndex] = useState(0);
  const [filteredData, setFilteredData] = useState("all");
  const [totalDataCount, setTotalDataCount] = useState(null);
  const { configData } = useSelector((state) => state.configData);
  const theme = useTheme();

  // Separate refs for mobile and desktop tab strips
  const mobileTabsRef = useRef(null);
  const desktopTabsRef = useRef(null);

  const [tabAtStart, setTabAtStart] = useState(true);
  const [tabAtEnd, setTabAtEnd] = useState(true);

  const { data: categoriesResponse, isLoading: categoriesLoading } =
    useGetCategories();

  const menus = [
    { label: t("All"), value: "all" },
    ...(categoriesResponse?.data || []).map((cat) => ({
      label: cat.name,
      value: cat.id,
    })),
  ];

  // Pick the active tab container depending on viewport width
  const getActiveTabsEl = () => {
    if (typeof window !== "undefined" && window.innerWidth < 900) {
      return mobileTabsRef.current;
    }
    return desktopTabsRef.current;
  };

  const handleTabClick = (value, index) => {
    setSelectedMenuIndex(index);
    setFilteredData(value);
    const container = getActiveTabsEl();
    const tabEl = container?.firstElementChild?.children?.[index];
    tabEl?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  const updateTabBoundary = () => {
    const el = getActiveTabsEl();
    if (!el) return;
    // scrollLeft runs 0 → negative in RTL; absolute distance keeps the
    // start/end detection direction-agnostic.
    const scrolled = Math.abs(el.scrollLeft);
    setTabAtStart(scrolled <= 0);
    setTabAtEnd(scrolled + el.clientWidth >= el.scrollWidth - 1);
  };

  useEffect(() => {
    if (!menus?.length) return;
    const timer = setTimeout(updateTabBoundary, 100);
    return () => clearTimeout(timer);
  }, [categoriesResponse]);

  const scrollTabs = (dir) => {
    const el = getActiveTabsEl();
    if (!el) return;
    // Forward (dir=1) means scrollLeft decreasing in RTL — invert the delta.
    const rtl = theme.direction === "rtl";
    el.scrollBy({ left: (rtl ? -dir : dir) * 200, behavior: "smooth" });
    setTimeout(updateTabBoundary, 350);
  };

  const arrowSx = (visible) => ({
    width: 28,
    height: 28,
    borderRadius: "50%",
    backgroundColor: "background.paper",
    display: "flex",
    visibility: visible ? "visible" : "hidden",
    pointerEvents: visible ? "auto" : "none",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    flexShrink: 0,
    boxShadow: "0px 1px 4px rgba(0,0,0,0.15)",
  });

  // Tab items JSX — shared between mobile and desktop renders
  const tabItemsJsx = menus.map((item, index) => {
    const isActive = selectedMenuIndex === index;
    return (
      <Box
        key={index}
        onClick={() => handleTabClick(item.value, index)}
        sx={{
          height: "40px",
          px: { xs: "12px", md: "14px" },
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          flexShrink: 0,
          borderRadius: "8px",
          backgroundColor: isActive
            ? theme.palette.primary.main
            : "transparent",
          transition: "background-color 0.2s ease",
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "12px", md: "14px" },
            fontWeight: isActive ? 700 : 400,
            color: isActive ? "common.white" : "neutral.1050",
            lineHeight: 1.1,
            letterSpacing: { xs: "-0.3px", md: "-0.54px" },
            whiteSpace: "nowrap",
            transition: "color 0.2s ease",
          }}
        >
          {item.label}
        </Typography>
      </Box>
    );
  });

  const loadingSkeletonJsx = (
    <Stack
      direction="row"
      gap="20px"
      sx={{ overflow: "hidden", height: "40px", alignItems: "center", flex: 1 }}
    >
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} width={60} height={24} />
      ))}
    </Stack>
  );

  return (
    <HomeComponentsWrapper>
      {/* Header */}
      <CustomStackFullWidth
        py="10px"
        sx={{
          position: "sticky",
          top: { xs: "55px", md: "63px" },
          zIndex: 100,
          background: (theme) => theme.palette.background.default,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {/* ══ MOBILE layout (xs only) ══════════════════════════════════════════ */}
        <Stack
          direction="row"
          alignItems="center"
          sx={{ display: { xs: "flex", md: "none" }, width: "100%" }}
        >
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: 700,
              color: "neutral.1050",
              lineHeight: 1.1,
              letterSpacing: "-1.2px",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {t(title ?? "Explore Services")}
          </Typography>

          <Stack direction="row" gap="8px" sx={{ ml: "auto", flexShrink: 0 }}>
            <Box onClick={() => scrollTabs(-1)} sx={arrowSx(!tabAtStart)}>
              <i
                className="fi fi-rs-angle-small-left"
                style={{
                  fontSize: "16px",
                  lineHeight: 1,
                  display: "flex",
                  color: theme.palette.neutral?.[1050] || "inherit", transform: theme.direction === "rtl" ? "scaleX(-1)" : "none", }}
              />
            </Box>
            <Box onClick={() => scrollTabs(1)} sx={arrowSx(!tabAtEnd)}>
              <i
                className="fi fi-rs-angle-small-right"
                style={{
                  fontSize: "16px",
                  lineHeight: 1,
                  display: "flex",
                  color: theme.palette.neutral?.[1050] || "inherit", transform: theme.direction === "rtl" ? "scaleX(-1)" : "none", }}
              />
            </Box>
          </Stack>
        </Stack>

        {/* Row 2: full-width scrollable tabs (no arrows) */}
        {categoriesLoading ? (
          <Box sx={{ display: { xs: "block", md: "none" } }}>
            {loadingSkeletonJsx}
          </Box>
        ) : (
          <Box
            ref={mobileTabsRef}
            onScroll={updateTabBoundary}
            sx={{
              display: { xs: "block", md: "none" },
              overflowX: "scroll",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              gap="0px"
              sx={{ width: "max-content" }}
            >
              {tabItemsJsx}
            </Stack>
          </Box>
        )}

        {/* ══ DESKTOP layout (md+) ═════════════════════════════════════════════ */}
        {/* Single row: title + prev + tabs + next */}
        <Stack
          direction="row"
          alignItems="center"
          gap="24px"
          sx={{
            display: { xs: "none", md: "flex" },
            width: "100%",
            minWidth: 0,
          }}
        >
          <Typography
            sx={{
              fontSize: "24px",
              fontWeight: 700,
              color: "neutral.1050",
              lineHeight: 1.1,
              letterSpacing: "-1.2px",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {t(title ?? "Explore Services")}
          </Typography>

          <Stack
            direction="row"
            alignItems="center"
            gap="8px"
            sx={{ ml: "auto", minWidth: 0, maxWidth: "65%" }}
          >
            <Box
              onClick={() => scrollTabs(-1)}
              sx={{ ...arrowSx(!tabAtStart), mt: "-4px" }}
            >
              <i
                className="fi fi-rs-angle-small-left"
                style={{
                  fontSize: "16px",
                  lineHeight: 1,
                  display: "flex",
                  color: theme.palette.neutral?.[1050] || "inherit", transform: theme.direction === "rtl" ? "scaleX(-1)" : "none", }}
              />
            </Box>

            {categoriesLoading ? (
              loadingSkeletonJsx
            ) : (
              <Box
                ref={desktopTabsRef}
                onScroll={updateTabBoundary}
                sx={{
                  flex: 1,
                  minWidth: 0,
                  overflowX: "scroll",
                  scrollbarWidth: "none",
                  "&::-webkit-scrollbar": { display: "none" },
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  gap="0px"
                  sx={{ width: "max-content" }}
                >
                  {tabItemsJsx}
                </Stack>
              </Box>
            )}

            <Box
              onClick={() => scrollTabs(1)}
              sx={{ ...arrowSx(!tabAtEnd), mt: "-4px" }}
            >
              <i
                className="fi fi-rs-angle-small-right"
                style={{
                  fontSize: "16px",
                  lineHeight: 1,
                  display: "flex",
                  color: theme.palette.neutral?.[1050] || "inherit", transform: theme.direction === "rtl" ? "scaleX(-1)" : "none", }}
              />
            </Box>
          </Stack>
        </Stack>
      </CustomStackFullWidth>

      {/* Cards */}
      <CustomBoxFullWidth
        key={filteredData}
        sx={{ minHeight: "20vh", paddingTop: "1rem" }}
      >
        <AllServices
          filteredData={filteredData}
          setTotalDataCount={setTotalDataCount}
        />
      </CustomBoxFullWidth>
    </HomeComponentsWrapper>
  );
};

export default Services;
