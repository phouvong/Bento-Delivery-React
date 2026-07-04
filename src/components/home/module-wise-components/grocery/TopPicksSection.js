import { Box, Skeleton, styled, Typography } from "@mui/material";
import NewProductCard from "components/cards/newCard/NewProductCard";
import ProductCardSimmer from "components/Shimmer/ProductCardSimmer";
import { HomeComponentsWrapper } from "components/home/HomePageComponents";
import SliderSectionHeader from "components/common/SliderSectionHeader";
import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import useGetMostReviewed from "api-manage/hooks/react-query/useGetMostReviewed";

const SliderWrapper = styled(CustomBoxFullWidth)(({ theme }) => ({
  "& .slick-list": {
    overflowX: "hidden",
    overflowY: "visible",
    padding: "8px 0",
  },
  "& .slick-track": {
    marginLeft: 0,
    marginRight: "auto",
  },
  "& .slick-slide": {
    paddingRight: "24px",
  },
  "& .slick-slide:first-child": {
    paddingLeft: 0,
  },
  [theme.breakpoints.down("sm")]: {
    "& .slick-slide": {
      paddingRight: "12px",
    },
  },
}));

const sliderSettings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 5.4,
  slidesToScroll: 1,
  swipeToSlide: true,
  arrows: false,
  responsive: [
    {
      breakpoint: 1025,
      settings: {
        slidesToShow: 5,
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
        slidesToShow: 2.8,
        slidesToScroll: 1,
        infinite: false,
        swipeToSlide: true,
      },
    },
    {
      breakpoint: 480,
      settings: { slidesToShow: 2.4, slidesToScroll: 1, swipeToSlide: true },
    },
    {
      breakpoint: 400,
      settings: { slidesToShow: 2.1, slidesToScroll: 1, swipeToSlide: true },
    },
    {
      breakpoint: 340,
      settings: { slidesToShow: 1.7, slidesToScroll: 1, swipeToSlide: true },
    },
  ],
};

const TopPicksSection = () => {
  const { t } = useTranslation();
  const slider = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data, isLoading } = useGetMostReviewed({ type: "all" });
  const products = data?.products ?? [];

  if (!isLoading && !products.length) return null;

  return (
    <HomeComponentsWrapper sx={{ gap: "1rem" }}>
      <SliderSectionHeader
        sliderRef={slider}
        currentSlide={currentSlide}
        totalSlides={products.length}
        slidesToShow={5}
        sx={{ mb: "1rem" }}
        heading={
          isLoading ? (
            <Skeleton variant="text" width="140px" height="32px" />
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
              {t("Top Picks")}
            </Typography>
          )
        }
      />

      <SliderWrapper>
        {isLoading ? (
          <Slider {...sliderSettings}>
            {[...Array(5)].map((_, i) => (
              <ProductCardSimmer key={i} />
            ))}
          </Slider>
        ) : (
          <Slider
            {...sliderSettings}
            ref={slider}
            afterChange={(idx) => setCurrentSlide(idx)}
          >
            {products.map((item) => (
              <div key={item?.id}>
                <NewProductCard
                  variant="vertical"
                  item={item}
                  cardWidth={{ xs: "150px", md: "170px" }}
                />
              </div>
            ))}
          </Slider>
        )}
      </SliderWrapper>
    </HomeComponentsWrapper>
  );
};

export default TopPicksSection;
