import {
  Box,
  IconButton,
  Skeleton,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { useGetFlashSales } from "api-manage/hooks/react-query/useGetFlashSales";
import NewProductCard from "components/cards/newCard/NewProductCard";
import ProductCardSimmer from "components/Shimmer/ProductCardSimmer";
import SliderSectionHeader from "components/common/SliderSectionHeader";
import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";
import { useEffect, useRef, useState } from "react";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import Countdown from "react-countdown";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import { useRouter } from "next/router";
import moment from "moment";

const FLASH_BG_URL = "/static/mart-shop-flash-sales-bg.svg";

// ─── Styled ────────────────────────────────────────────────────────────────

const Container = styled(Box)(({ theme }) => ({
  width: "100%",
  position: "relative",
  overflow: "hidden",
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.background.paper : "#ebf3ff",
  borderRadius: "16px",
  paddingTop: "24px",
  paddingBottom: "24px",
  boxShadow: "0px 1px 4px 0px rgba(0,0,0,0.05)",
  [theme.breakpoints.down("sm")]: {
    paddingTop: "16px",
    paddingBottom: "16px",
  },
}));

// absolute bg image overlay — avoids ::before emotion issues
const BgOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundImage: `url(${FLASH_BG_URL})`,
  backgroundRepeat: "repeat-x",
  backgroundPosition: "top center",
  backgroundSize: "auto 100%",
  opacity: theme.palette.mode === "dark" ? 0.06 : 0.8,
  pointerEvents: "none",
  zIndex: 0,
}));

const Inner = styled(Box)({
  position: "relative",
  zIndex: 1,
});

const SliderWrapper = styled(CustomBoxFullWidth)(({ theme }) => ({
  paddingLeft: "24px",
  [theme.breakpoints.down("sm")]: {
    paddingLeft: "16px",
  },
  "& .slick-list": {
    overflowX: "hidden",
    overflowY: "visible",
    padding: "8px 0",
  },
  "& .slick-track": { marginLeft: 0, marginRight: "auto" },
  "& .slick-slide": { paddingRight: "20px" },
  "& .slick-slide:first-child": { paddingLeft: 0 },
}));

const CountBox = styled(Box)(({ theme }) => ({
  width: 36,
  height: 36,
  borderRadius: "4px",
  backgroundColor: theme.palette.info.main,
  border: "1px solid #ffffff",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "1px",
  [theme.breakpoints.up("sm")]: {
    width: 44,
    height: 44,
  },
}));

// ─── Countdown renderer ────────────────────────────────────────────────────

const timerRenderer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) return null;
  const numSx = {
    fontSize: { xs: "11px", sm: "14px" },
    fontWeight: 600,
    color: "#fff",
    lineHeight: 1,
    letterSpacing: "-0.42px",
    fontVariantNumeric: "tabular-nums",
  };
  const labelSx = {
    fontSize: { xs: "8px", sm: "10px" },
    fontWeight: 400,
    color: "rgba(255,255,255,0.95)",
    lineHeight: 1,
  };

  return (
    <Stack direction="row" alignItems="center" gap="4px" flexShrink={0}>
      <CountBox>
        <Typography sx={numSx}>{String(days).padStart(2, "0")}</Typography>
        <Typography sx={labelSx}>{t("Days")}</Typography>
      </CountBox>
      <CountBox>
        <Typography sx={numSx}>
          {String(hours * 60 + minutes).padStart(2, "0")}
        </Typography>
        <Typography sx={labelSx}>{t("Min")}</Typography>
      </CountBox>
      <CountBox>
        <Typography sx={numSx}>{String(seconds).padStart(2, "0")}</Typography>
        <Typography sx={labelSx}>{t("Sec")}</Typography>
      </CountBox>
    </Stack>
  );
};

// ─── Flash Sale Icon ────────────────────────────────────────────────────────

const FlashIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M31.1439 4.13759C32.6173 2.41408 35.885 -1.37143 38.3592 0.513226C40.7712 2.35073 36.7666 7.31152 35.4046 8.8743C35.1929 9.11727 34.6133 9.66415 34.5325 9.90421C34.6726 10.5866 34.9235 11.8079 35.06 12.6357C35.3552 14.4264 36.7562 18.9168 36.22 20.4757C36.0984 20.8292 33.6399 23.1857 33.2096 23.6053L28.9041 27.8527C26.4713 30.2737 24.053 32.709 21.6492 35.1587C20.297 36.5251 18.9416 37.9148 17.5486 39.2391C17.2377 39.5327 16.975 39.7151 16.5499 39.8142C16.1559 39.9061 15.7489 39.737 15.4378 39.5083C14.362 38.7175 13.522 37.6265 12.5635 36.7001C12.2016 36.3504 11.8286 35.9765 11.4926 35.5994C11.1815 35.8033 10.5582 36.4022 10.2226 36.6632C9.00583 37.6091 7.41883 39.1335 6.16571 39.9457C6.48872 39.2726 7.32317 38.154 7.74838 37.4688C8.43112 36.3685 9.12018 35.2521 9.81549 34.1611C9.35221 33.6076 8.83545 33.1341 8.3216 32.6048C6.31954 30.5428 4.16784 28.5613 2.23417 26.4431C1.51017 25.6501 1.81187 24.7127 2.52452 24.0029C3.78062 22.7518 5.0601 21.4666 6.32338 20.2018L14.4989 12.0274L18.3625 8.15868C19.2651 7.25705 20.2446 5.99092 21.5474 5.79732C24.2086 5.40172 26.8247 4.77203 29.4851 4.37537C30.0684 4.28844 30.5428 4.15442 31.1439 4.13759ZM34.2031 8.54675C34.4542 8.33297 34.8859 7.79675 35.1065 7.52388C36.404 5.91955 37.6033 4.28091 38.1063 2.25399C37.253 -0.876333 33.4066 3.03049 32.5081 4.27019C33.4953 4.88212 33.6455 5.36287 33.8462 6.5057C33.9638 7.17551 34.0779 7.87715 34.2031 8.54675Z"
      fill="#436BD8"
    />
    <path
      d="M8.49982 24.9724C9.89386 24.0049 22.9998 13.6383 23.2704 13.6693C23.2876 13.7987 23.2755 13.846 23.2172 13.964C21.746 16.9377 20.2707 19.9461 18.937 22.9833C20.8213 23.4341 22.977 24.2003 24.7711 24.5861C23.7404 25.5726 22.1836 26.7788 21.0591 27.7044L14.6036 33.0288C14.0606 33.4783 11.8432 35.2201 11.4929 35.6002C11.1818 35.8041 10.5586 36.403 10.2229 36.664C9.00614 37.6099 7.41914 39.1343 6.16602 39.9465C6.48903 39.2734 7.32347 38.1548 7.74869 37.4696C8.43143 36.3693 9.12049 35.253 9.8158 34.1619C10.3789 33.616 11.6702 31.4191 12.1245 30.6712C12.9047 29.387 13.751 28.0596 14.5225 26.7758C12.4778 26.1973 10.4998 25.5471 8.49982 24.9724Z"
      fill="#FEC107"
    />
    <path
      d="M29.8062 8.76661C32.4172 9.67095 31.9345 13.8667 28.7535 14.0891C27.9668 14.1425 27.1919 13.8762 26.6043 13.3503C26.0248 12.8323 25.6756 12.1046 25.6342 11.3283C25.5971 10.5602 25.8733 9.80994 26.3995 9.24907C27.1207 8.46789 27.8113 8.37088 28.7869 8.32208L28.3685 9.34495C28.2413 9.87095 27.8786 10.9918 28.1742 11.4318C28.2555 11.5511 28.3835 11.6302 28.5265 11.6496C29.2328 11.744 29.2422 10.305 29.4415 9.74346C29.5432 9.33849 29.6376 9.13955 29.8062 8.76661Z"
      fill="#C3D3FF"
    />
    <path
      d="M29.4416 9.74333C31.5711 11.0565 29.7427 13.736 27.8586 12.8269C27.3923 12.6063 27.0343 12.2076 26.865 11.7204C26.436 10.4786 27.2911 9.72763 28.3686 9.34482C28.2413 9.87081 27.8787 10.9917 28.1743 11.4317C28.2555 11.5509 28.3836 11.63 28.5265 11.6494C29.2329 11.7439 29.2422 10.3048 29.4416 9.74333Z"
      fill="#FEFEFE"
    />
  </svg>
);

// ─── Main ──────────────────────────────────────────────────────────────────

const FlashSalesSection = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const slider = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const {
    data: flashSales,
    isLoading,
    refetch,
  } = useGetFlashSales({ limit: 10, offset: 1 });

  useEffect(() => {
    refetch();
  }, [refetch]);

  const products = flashSales?.active_products ?? [];
  const endDate = flashSales?.end_date
    ? moment(flashSales.end_date).toDate()
    : null;

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5.2,
    slidesToScroll: 1,
    swipeToSlide: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1450,
        settings: {
          slidesToShow: 5.2,
          slidesToScroll: 1,
          infinite: false,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: false,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 760,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: false,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: false,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2.3,
          slidesToScroll: 1,
          infinite: false,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 400,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: false,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 360,
        settings: {
          slidesToShow: 1.8,
          slidesToScroll: 1,
          infinite: false,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 340,
        settings: {
          slidesToShow: 1.7,
          slidesToScroll: 1,
          infinite: false,
          swipeToSlide: true,
        },
      },
    ],
  };

  if (!isLoading && !products.length) return null;

  const handleViewAll = () => {
    if (flashSales?.id) {
      router.push({ pathname: "/flash-sales", query: { id: flashSales.id } });
    }
  };

  return (
    <Container>
      <BgOverlay />
      <Inner>
        <Stack gap="20px">
          <Box px={{ xs: "16px", sm: "24px" }}>
            <SliderSectionHeader
              sliderRef={slider}
              currentSlide={currentSlide}
              totalSlides={products.length}
              slidesToShow={5}
              heading={
                <Stack
                  direction="row"
                  alignItems="center"
                  gap={{ xs: "8px", sm: "12px" }}
                >
                  <Box
                    sx={{
                      display: { xs: "none", sm: "block" },
                      flexShrink: 0,
                      lineHeight: 0,
                    }}
                  >
                    <FlashIcon />
                  </Box>
                  <Stack gap="2px">
                    {isLoading ? (
                      <>
                        <Skeleton variant="text" width="120px" height="28px" />
                        <Skeleton variant="text" width="200px" height="18px" />
                      </>
                    ) : (
                      <>
                        <Typography
                          sx={{
                            fontSize: { xs: "16px", sm: "20px", md: "24px" },
                            fontWeight: 700,
                            color: "info.dark",
                            lineHeight: 1.1,
                            letterSpacing: { xs: "-0.8px", md: "-1.2px" },
                            whiteSpace: "nowrap",
                          }}
                        >
                          {t("Flash Sale")}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: { xs: "11px", sm: "13px", md: "14px" },
                            fontWeight: 400,
                            color: "info.dark",
                            lineHeight: 1.3,
                          }}
                        >
                          {t("Grab The Offer Before End The Time.")}
                        </Typography>
                      </>
                    )}
                  </Stack>
                </Stack>
              }
              trailing={
                isLoading ? (
                  <Stack direction="row" gap="8px">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton
                        key={i}
                        variant="rectangular"
                        width={44}
                        height={44}
                        sx={{ borderRadius: "4px" }}
                      />
                    ))}
                  </Stack>
                ) : endDate ? (
                  <Countdown date={endDate} renderer={timerRenderer} />
                ) : null
              }
            />
          </Box>

          {/* Slider */}
          <SliderWrapper>
            <Slider
              {...sliderSettings}
              ref={slider}
              afterChange={(idx) => setCurrentSlide(idx)}
            >
              {isLoading
                ? [...Array(5)].map((_, i) => <ProductCardSimmer key={i} />)
                : products.map((flashItem, index) => (
                    <div key={flashItem?.id ?? index}>
                      <NewProductCard
                        variant="vertical"
                        item={flashItem?.item}
                        cardWidth={{ xs: "150px", md: "170px" }}
                      />
                    </div>
                  ))}
            </Slider>
          </SliderWrapper>
        </Stack>
      </Inner>
    </Container>
  );
};

export default FlashSalesSection;
