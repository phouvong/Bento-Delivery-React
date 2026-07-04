import {
  Box,
  Skeleton,
  Stack,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import { useGetCommonConditions } from "api-manage/hooks/react-query/common-conditions/useGetCommonConditions";
import useGetCommonConditionProducts from "api-manage/hooks/react-query/common-conditions/useGetCommonConditionProducts";
import NewProductCard from "components/cards/newCard/NewProductCard";
import ProductCardSimmer from "components/Shimmer/ProductCardSimmer";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";

const ItemSliderWrapper = styled(CustomBoxFullWidth)(() => ({
  "& .slick-track": { marginLeft: 0 },
  "& .slick-slide": { paddingRight: "20px" },
}));

const CommonConditions = ({ title }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const slider = useRef(null);
  // Separate refs for mobile and desktop tab strips
  const mobileTabsRef = useRef(null);
  const desktopTabsRef = useRef(null);
  const queryClient = useQueryClient();

  const [tabAtStart, setTabAtStart] = useState(true);
  const [tabAtEnd, setTabAtEnd] = useState(true);
  const [selected, setSelected] = useState(0);
  const [conditionId, setConditionId] = useState(null);
  const [conditionData, setConditionData] = useState([]);

  const page_limit = "20";
  const offset = 1;

  const {
    data: conditions,
    refetch: conditionRefetch,
    isLoading: conditionsLoading,
  } = useGetCommonConditions();

  const { refetch, isLoading } = useGetCommonConditionProducts(
    { conditionId, page_limit, offset },
    (res) => setConditionData(res),
  );

  useEffect(() => {
    conditionRefetch();
  }, []);

  useEffect(() => {
    if (conditions?.data?.[0]?.id) {
      setConditionId(conditions.data[0].id);
    }
  }, [conditions]);

  const handleCheckData = useCallback(() => {
    const queryState = queryClient.getQueryState(
      `[common-condition-products-${conditionId}]`,
    );
    if (!queryState || queryState.isStale) {
      refetch();
    } else {
      setConditionData(queryState?.data);
    }
  }, [conditionId]);

  useEffect(() => {
    if (conditionId) handleCheckData();
  }, [conditionId]);

  const handleTabClick = (id, index) => {
    setSelected(index);
    setConditionId(id);
  };

  // Pick the active tab container depending on viewport width
  const getActiveTabsEl = () => {
    if (typeof window !== "undefined" && window.innerWidth < 900) {
      return mobileTabsRef.current;
    }
    return desktopTabsRef.current;
  };

  const updateTabBoundary = () => {
    const el = getActiveTabsEl();
    if (!el) return;
    setTabAtStart(el.scrollLeft <= 0);
    setTabAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
  };

  useEffect(() => {
    if (!conditions?.data?.length) return;
    const timer = setTimeout(updateTabBoundary, 100);
    return () => clearTimeout(timer);
  }, [conditions]);

  const scrollTabs = (dir) => {
    const el = getActiveTabsEl();
    if (!el) return;
    el.scrollBy({ left: dir * 200, behavior: "smooth" });
    setTimeout(updateTabBoundary, 350);
  };

  // Item slider settings
  const itemSliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5.1,
    slidesToScroll: 1,
    swipeToSlide: true,
    arrows: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 4, slidesToScroll: 1 , swipeToSlide: true} },
      { breakpoint: 760, settings: { slidesToShow: 3, slidesToScroll: 2 , swipeToSlide: true} },
      { breakpoint: 480, settings: { slidesToShow: 2.4, slidesToScroll: 1 , swipeToSlide: true} },
      { breakpoint: 400, settings: { slidesToShow: 2.1, slidesToScroll: 1 , swipeToSlide: true} },
      {
        breakpoint: 360,
        settings: { slidesToShow: 1.8, slidesToScroll: 1, infinite: false , swipeToSlide: true},
      },
      { breakpoint: 340, settings: { slidesToShow: 1.8, slidesToScroll: 1 , swipeToSlide: true} },
    ],
  };

  const products = conditionData?.products ?? [];

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
  const tabItemsJsx = conditions?.data?.map((item, index) => {
    const isActive = selected === index;
    return (
      <Box
        key={item.id}
        onClick={() => handleTabClick(item.id, index)}
        sx={{
          height: "40px",
          px: "4px",
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          flexShrink: 0,
          borderBottom: isActive
            ? `3px solid ${theme.palette.primary.main}`
            : "3px solid transparent",
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "13px", md: "18px" },
            fontWeight: isActive ? 700 : 400,
            color: isActive ? "primary.main" : "neutral.1050",
            lineHeight: 1.1,
            letterSpacing: { xs: "-0.3px", md: "-0.54px" },
            whiteSpace: "nowrap",
            transition: "color 0.2s ease",
          }}
        >
          {item.name}
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
    <Stack gap="16px">

      {/* ══ MOBILE layout (xs only) ══════════════════════════════════════════ */}

      {/* Row 1: title + both arrows (right-aligned) */}
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
          {t(title)}
        </Typography>

        {/* Arrows sit in the title row — no space wasted in the tab strip */}
        <Stack direction="row" gap="8px" sx={{ ml: "auto", flexShrink: 0 }}>
          <Box onClick={() => scrollTabs(-1)} sx={arrowSx(!tabAtStart)}>
            <i
              className="fi fi-rs-angle-small-left"
              style={{ fontSize: "16px", lineHeight: 1, display: "flex", color: theme.palette.neutral[1050] }}
            />
          </Box>
          <Box onClick={() => scrollTabs(1)} sx={arrowSx(!tabAtEnd)}>
            <i
              className="fi fi-rs-angle-small-right"
              style={{ fontSize: "16px", lineHeight: 1, display: "flex", color: theme.palette.neutral[1050] }}
            />
          </Box>
        </Stack>
      </Stack>

      {/* Row 2: full-width scrollable tabs (no arrows) */}
      {conditionsLoading ? (
        <Box sx={{ display: { xs: "block", md: "none" } }}>{loadingSkeletonJsx}</Box>
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
          <Stack direction="row" alignItems="center" gap="20px" sx={{ width: "max-content" }}>
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
        sx={{ display: { xs: "none", md: "flex" }, width: "100%", minWidth: 0 }}
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
          {t(title)}
        </Typography>

        <Stack
          direction="row"
          alignItems="center"
          gap="8px"
          sx={{ ml: "auto", minWidth: 0, maxWidth: "65%" }}
        >
          <Box onClick={() => scrollTabs(-1)} sx={{ ...arrowSx(!tabAtStart), mt: "-4px" }}>
            <i
              className="fi fi-rs-angle-small-left"
              style={{ fontSize: "16px", lineHeight: 1, display: "flex", color: theme.palette.neutral[1050] }}
            />
          </Box>

          {conditionsLoading ? loadingSkeletonJsx : (
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
              <Stack direction="row" alignItems="center" gap="20px" sx={{ width: "max-content" }}>
                {tabItemsJsx}
              </Stack>
            </Box>
          )}

          <Box onClick={() => scrollTabs(1)} sx={{ ...arrowSx(!tabAtEnd), mt: "-4px" }}>
            <i
              className="fi fi-rs-angle-small-right"
              style={{ fontSize: "16px", lineHeight: 1, display: "flex", color: theme.palette.neutral[1050] }}
            />
          </Box>
        </Stack>
      </Stack>

      {/* ── Item slider ── */}
      <ItemSliderWrapper
        sx={{ opacity: isLoading ? 0.5 : 1, transition: "opacity 0.3s ease" }}
      >
        <Slider key={conditionId} {...itemSliderSettings} ref={slider}>
          {isLoading
            ? [...Array(5)].map((_, i) => <ProductCardSimmer key={i} />)
            : products.map((item) => (
                <div key={item?.id}>
                  <NewProductCard
                    variant="vertical"
                    item={item}
                    isPharmacy
                    cardWidth={{ xs: "150px", md: "180px" }}
                  />
                </div>
              ))}
        </Slider>
      </ItemSliderWrapper>
    </Stack>
  );
};

CommonConditions.propTypes = {};

export default CommonConditions;
