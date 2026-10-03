import { Box, Skeleton, Stack, styled, Typography } from "@mui/material";
import BundleProductCard from "components/cards/newCard/BundleProductCard";
import SliderSectionHeader from "components/common/SliderSectionHeader";
import useGetBundleHome from "api-manage/hooks/react-query/bundle/useGetBundleHome";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";

const Container = styled(Box)(({ theme }) => ({
  width: "100%",
  backgroundColor: theme.palette.background.paper,
  borderRadius: "16px",
  boxShadow: "0px 1px 4px 0px rgba(0,0,0,0.05)",
  paddingTop: "24px",
  paddingBottom: "24px",
  overflow: "hidden",
  [theme.breakpoints.down("sm")]: {
    paddingTop: "16px",
    paddingBottom: "16px",
    borderRadius: "12px",
  },
}));

const SliderWrapper = styled(CustomBoxFullWidth)(({ theme }) => ({
  paddingLeft: "32px",
  "& .slick-track": { marginLeft: 0 },
  "& .slick-slide": { paddingRight: "24px" },
  "& .slick-slide:first-child": { paddingLeft: 0 },
  // .slick-list clips flush against the first/last slide's edge, cutting off
  // the card's left/right drop shadow. Give it a small buffer and pull the
  // same amount back with negative margin, so the shadow has room without
  // changing the slider's layout width. Container above still clips the
  // slider's own overflow, so nothing escapes the section.
  "& .slick-list": {
    padding: "0 8px",
    margin: "0 -8px",
  },
  [theme.breakpoints.down("sm")]: {
    paddingLeft: "16px",
    "& .slick-slide": { paddingRight: "16px" },
  },
}));

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
        slidesToScroll: 2,
        infinite: false,
        swipeToSlide: true,
      },
    },
    {
      breakpoint: 360,
      settings: {
        slidesToShow: 1.8,
        slidesToScroll: 2,
        infinite: false,
        swipeToSlide: true,
      },
    },
    {
      breakpoint: 340,
      settings: {
        slidesToShow: 1.7,
        slidesToScroll: 2,
        infinite: false,
        swipeToSlide: true,
      },
    },
  ],
};

const BundleCardShimmer = () => (
  <Stack gap="12px">
    <Skeleton variant="rounded" height={190} sx={{ borderRadius: "12px" }} />
    <Skeleton variant="text" width="60%" />
    <Skeleton variant="text" width="80%" />
    <Skeleton variant="text" width="40%" />
  </Stack>
);

/**
 * Shared "Bundle Items" home section — one horizontal slider of bundle cards,
 * used by every module that sells bundles. GET /bundle/home is public (no
 * token/guest_id) and returns one thumbnail per bundle, not a per-item image
 * set, so every card here renders via BundleProductCard's single-image path.
 */
const BundleItemsSection = ({ title }) => {
  const { t } = useTranslation();
  const slider = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data, isLoading, isFetched } = useGetBundleHome({ limit: 10 });
  const bundles = data?.bundles ?? [];

  if (isFetched && !bundles.length) return null;

  return (
    <Container>
      <Stack gap="16px">
        <Box px={{ xs: "16px", sm: "32px" }}>
          <SliderSectionHeader
            sliderRef={slider}
            currentSlide={currentSlide}
            totalSlides={bundles.length}
            slidesToShow={5}
            heading={
              isLoading ? (
                <Skeleton variant="text" width="160px" height="32px" />
              ) : (
                <Typography
                  sx={{
                    fontSize: { xs: "20px", sm: "24px" },
                    fontWeight: 700,
                    color: "neutral.1050",
                    lineHeight: 1.1,
                    letterSpacing: "-1.2px",
                  }}
                >
                  {title || t("Bundle Items")}
                </Typography>
              )
            }
          />
        </Box>

        <SliderWrapper>
          <Slider
            {...sliderSettings}
            ref={slider}
            afterChange={(idx) => setCurrentSlide(idx)}
          >
            {isLoading
              ? [...Array(5)].map((_, i) => (
                  <div key={i}>
                    <BundleCardShimmer />
                  </div>
                ))
              : bundles.map((item) => (
                  <div key={item?.id}>
                    <BundleProductCard
                      variant="vertical"
                      item={item}
                      images={item?.items?.map((i) => i?.image_full_url) ?? []}
                      cardWidth="100%"
                    />
                  </div>
                ))}
          </Slider>
        </SliderWrapper>
      </Stack>
    </Container>
  );
};

export default BundleItemsSection;
