import { Box, Stack, Typography, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useGetAdds } from "api-manage/hooks/react-query/useGetAds";
import NewStoreCard from "components/cards/newCard/NewStoreCard";
import { t } from "i18next";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { ModuleTypes } from "helper-functions/moduleTypes";
import announcementIcon from "assets/img/announcementIcon.png";
import NextImage from "components/NextImage";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import SliderSectionHeader from "components/common/SliderSectionHeader";
import { useRef, useState, useEffect } from "react";

// ─── Background SVG (concentric circles, theme-aware) ─────────────────────

const BgCircles = ({ color }) => (
  <svg
    width="364"
    height="387"
    viewBox="0 0 364 387"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ position: "absolute", top: -2, right: -2, pointerEvents: "none" }}
  >
    <g opacity="0.3">
      <circle
        opacity="0.05"
        cx="327.862"
        cy="40.0012"
        r="327.362"
        stroke={color}
      />
      <circle
        opacity="0.05"
        cx="327.862"
        cy="40.0013"
        r="301.949"
        stroke={color}
      />
      <circle
        opacity="0.1"
        cx="327.862"
        cy="40.0009"
        r="280.166"
        stroke={color}
      />
      <circle
        opacity="0.15"
        cx="327.862"
        cy="40.001"
        r="257.657"
        stroke={color}
      />
      <circle
        opacity="0.2"
        cx="327.862"
        cy="40.001"
        r="234.956"
        stroke={color}
      />
      <circle
        opacity="0.25"
        cx="327.862"
        cy="40.0005"
        r="212.5"
        stroke={color}
      />
      <circle
        opacity="0.3"
        cx="327.862"
        cy="40.0007"
        r="186.973"
        stroke={color}
      />
      <circle
        opacity="0.3"
        cx="327.862"
        cy="40.0002"
        r="161.202"
        stroke={color}
      />
      <circle
        opacity="0.35"
        cx="327.862"
        cy="40.0001"
        r="133.956"
        stroke={color}
      />
      <circle
        opacity="0.4"
        cx="327.862"
        cy="40.0002"
        r="107.044"
        stroke={color}
      />
      <circle
        opacity="0.45"
        cx="327.862"
        cy="40.0001"
        r="80.9561"
        stroke={color}
      />
      <circle
        opacity="0.5"
        cx="327.862"
        cy="40.0004"
        r="55.0795"
        stroke={color}
      />
    </g>
  </svg>
);

// ─── Styled ────────────────────────────────────────────────────────────────

const Container = styled(Box)(({ theme }) => ({
  width: "100%",
  backgroundColor: theme.palette.info.tertiary,
  border: `2px solid ${theme.palette.background.paper}`,
  borderRadius: "16px",
  paddingTop: "16px",
  paddingBottom: "20px",
  paddingLeft: 0,
  paddingRight: 0,
  position: "relative",
  [theme.breakpoints.up("md")]: {
    paddingTop: "22px",
    paddingBottom: "26px",
    paddingLeft: 0,
    paddingRight: 0,
  },
}));

const SponsoredPill = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: 9999,
  padding: "2px 8px",
  display: "inline-flex",
  alignItems: "center",
  flexShrink: 0,
}));

// ─── Shimmer ───────────────────────────────────────────────────────────────

const CardShimmer = () => (
  <Box
    sx={{
      width: "min(300px, calc(100vw - 40px))",
      flexShrink: 0,
      borderRadius: "12px",
      backgroundColor: "background.paper",
      overflow: "hidden",
      border: "1px solid",
      borderColor: "divider",
    }}
  >
    <Box
      sx={{
        width: "100%",
        height: "185px",
        backgroundColor: "background.secondary",
      }}
    />
    <Box
      sx={{ p: "16px", display: "flex", flexDirection: "column", gap: "8px" }}
    >
      <Box
        sx={{
          height: 16,
          width: "60%",
          borderRadius: 4,
          backgroundColor: "background.secondary",
        }}
      />
      <Box
        sx={{
          height: 12,
          width: "40%",
          borderRadius: 4,
          backgroundColor: "background.secondary",
        }}
      />
      <Box
        sx={{
          mt: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            height: 12,
            width: "35%",
            borderRadius: 4,
            backgroundColor: "background.secondary",
          }}
        />
        <Box
          sx={{
            height: 36,
            width: "90px",
            borderRadius: 8,
            backgroundColor: "background.secondary",
          }}
        />
      </Box>
    </Box>
  </Box>
);

// ─── Main ──────────────────────────────────────────────────────────────────

const CARD_WIDTH = 300; // fixed card width (px)
const GAP = 16; // px gap between cards

const PaidAds = () => {
  const theme = useTheme();
  const slider = useRef(null);
  const listRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const { data, isFetched, isLoading } = useGetAdds();
  const ads = Array.isArray(data) ? data : [];
  const hasMore = ads.length > 1;

  // Cap card width at 300px, but shrink to the container's real available
  // width on small screens (e.g. 320px) so the whole card — including the
  // badge that overhangs to the right — stays visible. Measuring the actual
  // container (not 100vw) keeps this correct regardless of page margins.
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const compute = () => {
      const cs = window.getComputedStyle(el);
      const padX =
        (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);
      const avail = el.clientWidth - padX;
      if (avail <= 0) return;
      // Cap by BOTH the container's real width AND the viewport, so the card
      // can never exceed the screen even if some ancestor is wider than the
      // viewport (page-level horizontal overflow). 32 = left inset + breathing.
      const viewportCap = window.innerWidth - 32;
      setCardWidth(Math.max(0, Math.min(CARD_WIDTH, avail - GAP, viewportCap)));
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    window.addEventListener("resize", compute);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, [ads.length]);

  if (isFetched && ads.length === 0) return null;

  // variableWidth lets react-slick lay slides out by their real pixel width, so
  // however many fit in the container show up (with a natural partial "peek")
  // — and infinite + autoplay stay perfectly aligned at any screen size.
  const sliderSettings = {
    dots: false,
    arrows: false,
    infinite: hasMore,
    autoplay: hasMore,
    autoplaySpeed: 3000,
    speed: 500,
    slidesToShow: 1, // ignored for layout when variableWidth is on
    slidesToScroll: 1,
    variableWidth: true,
    swipeToSlide: true,
  };

  return (
    <Container>
      <BgCircles color={theme.palette.info.blue} />

      <SliderSectionHeader
        sliderRef={slider}
        currentSlide={currentSlide}
        totalSlides={ads.length}
        slidesToShow={3}
        sx={{
          mb: "16px",
          position: "relative",
          zIndex: 1,
          px: { xs: "16px", md: "26px" },
        }}
        trailingAfterArrows
        heading={
          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems={{ xs: "flex-start", md: "center" }}
            gap={{ xs: "4px", md: "8px" }}
          >
            <Typography
              sx={{
                fontSize: { xs: "18px", md: "24px" },
                fontWeight: 700,
                color: "neutral.1050",
                lineHeight: 1.1,
                letterSpacing: { xs: "-0.54px", md: "-1.2px" },
                whiteSpace: "nowrap",
              }}
            >
              {getCurrentModuleType() === ModuleTypes.FOOD
                ? t("Featured Restaurants")
                : t("Featured Stores")}
            </Typography>
            <SponsoredPill>
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 400,
                  color: "customColor.deliveryText",
                  lineHeight: 1.2,
                  letterSpacing: "-0.36px",
                  whiteSpace: "nowrap",
                }}
              >
                {t("Sponsored")}
              </Typography>
            </SponsoredPill>
          </Stack>
        }
        trailing={
          <Box sx={{ width: 40, height: 40, flexShrink: 0 }}>
            <NextImage
              src={announcementIcon.src}
              alt=""
              width={40}
              height={40}
              objectFit="contain"
            />
          </Box>
        }
      />

      {/* Cards row */}
      <Box
        ref={listRef}
        sx={{
          overflow: "hidden",
          position: "relative",
          zIndex: 1,
          pl: { xs: "16px", md: "26px" },
          "& .slick-track": { display: "flex", alignItems: "stretch" },
          "& .slick-slide": { height: "auto" },
          "& .slick-slide > div": { height: "100%" },
        }}
      >
        {isLoading ? (
          <Stack direction="row" gap="16px" sx={{ overflowX: "hidden" }}>
            {[1, 2, 3].map((i) => (
              <CardShimmer key={i} />
            ))}
          </Stack>
        ) : (
          <Slider
            key={`ads-slider-${cardWidth}`}
            {...sliderSettings}
            ref={slider}
            afterChange={(idx) => setCurrentSlide(idx)}
          >
            {ads.map((ad) => {
              const w = cardWidth || CARD_WIDTH;
              return (
                <div
                  key={ad?.store?.id ?? ad?.id}
                  style={{ width: `${w + GAP}px` }}
                >
                  <Box sx={{ width: `${w}px` }}>
                    <NewStoreCard variant="ads" ad={ad} />
                  </Box>
                </div>
              );
            })}
          </Slider>
        )}
      </Box>
    </Container>
  );
};

export default PaidAds;
