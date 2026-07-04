import { IconButton, Skeleton, Stack, styled, Typography } from "@mui/material";
import useGetPopularItemsNearby from "api-manage/hooks/react-query/useGetPopularItemsNearby";
import NewProductCard from "components/cards/newCard/NewProductCard";
import ProductCardSimmer from "components/Shimmer/ProductCardSimmer";
import { HomeComponentsWrapper } from "components/home/HomePageComponents";
import SliderSectionHeader from "components/common/SliderSectionHeader";
import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";

const SliderWrapper = styled(CustomBoxFullWidth)(({ theme }) => ({
  "& .slick-list": {
    overflowX: "hidden",
    overflowY: "visible",
    padding: "8px 0",
  },
  "& .slick-track": { marginLeft: 0, marginRight: "auto" },
  "& .slick-slide": { paddingRight: "20px" },
  "& .slick-slide:first-child": { paddingLeft: 0 },
  [theme.breakpoints.down("sm")]: {
    "& .slick-slide": { paddingRight: "12px" },
  },
}));

const TrendingItemsSection = () => {
  const { t } = useTranslation();
  const slider = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data, isLoading } = useGetPopularItemsNearby({
    offset: 1,
    type: "all",
  });
  const products = data?.products ?? [];

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    swipeToSlide: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1450,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: false,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
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
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
          swipeToSlide: true,
        },
      },
    ],
  };

  if (!isLoading && !products.length) return null;

  return (
    <HomeComponentsWrapper sx={{ gap: "1rem" }}>
      <SliderSectionHeader
        sliderRef={slider}
        currentSlide={currentSlide}
        totalSlides={products.length}
        slidesToShow={3}
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
              {t("Trending Items")}
            </Typography>
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
            ? [...Array(3)].map((_, i) => (
                <ProductCardSimmer key={i} variant="horizontal" />
              ))
            : products.map((item) => (
                <div key={item?.id}>
                  <NewProductCard variant="horizontal" item={item} />
                </div>
              ))}
        </Slider>
      </SliderWrapper>
    </HomeComponentsWrapper>
  );
};

export default TrendingItemsSection;
