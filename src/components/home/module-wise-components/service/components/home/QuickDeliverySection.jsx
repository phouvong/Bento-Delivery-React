import { useRef, useState } from "react";
import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";
import { Skeleton, Stack, Typography, useTheme, styled } from "@mui/material";
import { Box } from "@mui/system";
import { t } from "i18next";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import SpecialOfferCardShimmer from "components/Shimmer/SpecialOfferCardSimmer";
import { HomeComponentsWrapper } from "components/home/HomePageComponents";
import SliderSectionHeader from "components/common/SliderSectionHeader";
import ExpressStoreCard from "components/cards/newCard/ExpressStoreCard";
import { useGetQuickEmergencyExperts } from "../../service-api-manage/hooks/react-query/quick-emergency-experts";
import NewStoreCardSkeleton from "components/Shimmer/NewStoreCardSkeleton";

const SliderWrapper = styled(CustomBoxFullWidth)(({ theme }) => ({
  // clip horizontal overflow but allow vertical for box-shadow
  "& .slick-list": {
    overflowX: "hidden",
    overflowY: "visible",
    padding: "0",
  },
  "& .slick-track": {
    marginLeft: 0,
    marginRight: "auto",
  },
  "& .slick-slide": {
    paddingRight: "20px",
  },
  "& .slick-slide:first-child": {
    paddingLeft: 0,
  },
  // NewStoreCard has fixed width:300px — override to fill slide
  "& .slick-slide > div > *": {
    width: "100% !important",
  },
  [theme.breakpoints.down("sm")]: {
    "& .slick-slide": {
      paddingRight: "12px",
    },
  },
}));

const QuickDeliverySection = ({ title, subtitle, cardVariant = "" }) => {
  const theme = useTheme();
  const slider = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { data, isLoading } = useGetQuickEmergencyExperts({
    offset: 1,
    preview_count: 4,
  });
  const stores = data?.data ?? data?.providers ?? data?.experts ?? [];

  if (!isLoading && !stores.length) return null;

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 2.8,
    slidesToScroll: 1,
    swipeToSlide: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1450,
        settings: {
          slidesToShow: 2.8,
          slidesToScroll: 1,
          infinite: false,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2.5,
          slidesToScroll: 1,
          infinite: false,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 760,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: false,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1,
          infinite: false,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1.2,
          slidesToScroll: 1,
          swipeToSlide: true,
          initialSlide: 1,
          infinite: false,
        },
      },
      {
        breakpoint: 400,
        settings: {
          slidesToShow: 1.1,
          slidesToScroll: 1,
          swipeToSlide: true,
          initialSlide: 1,
          infinite: false,
        },
      },
      {
        breakpoint: 340,
        settings: {
          slidesToShow: 1.1,
          slidesToScroll: 1,
          swipeToSlide: true,
          initialSlide: 1,
          infinite: false,
        },
      },
    ],
  };

  return (
    <HomeComponentsWrapper sx={{ gap: "1rem" }}>
      <SliderSectionHeader
        sliderRef={slider}
        currentSlide={currentSlide}
        totalSlides={stores.length}
        slidesToShow={cardVariant === "withItems" ? 3 : 4}
        sx={{ mb: "1rem" }}
        heading={
          isLoading ? (
            <Skeleton variant="text" width="140px" />
          ) : (
            <Stack direction="row" alignItems="center" gap="12px">
              <Stack sx={{ gap: "2px" }}>
                <Typography
                  sx={{
                    fontSize: { xs: "18px", md: "24px" },
                    fontWeight: 700,
                    color: "neutral.1050",
                    lineHeight: 1.1,
                    letterSpacing: "-1.2px",
                  }}
                >
                  {t(title ?? "Expert at Work")}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "neutral.500",
                    lineHeight: 1.3,
                    display: { xs: "none", md: "block" },
                  }}
                >
                  {t(
                    subtitle ?? "Discover professionals solving real problems",
                  )}
                </Typography>
              </Stack>
            </Stack>
          )
        }
      />
      <SliderWrapper>
        <Slider
          {...sliderSettings}
          ref={slider}
          afterChange={(idx) => setCurrentSlide(idx)}
        >
          {isLoading
            ? [...Array(4)].map((_, i) => <NewStoreCardSkeleton key={i} />)
            : stores.map((item, index) => (
                <ExpressStoreCard
                  key={index}
                  store={item}
                  items={(
                    item?.top_items ??
                    item?.top_services ??
                    item?.services ??
                    []
                  ).map((service) => ({
                    ...service,
                    module_type: "service",
                  }))}
                />
              ))}
        </Slider>
      </SliderWrapper>
    </HomeComponentsWrapper>
  );
};

export default QuickDeliverySection;
