import { alpha, Skeleton, Typography } from "@mui/material";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Slider from "react-slick";
import useGetDiscountedItems from "../../../api-manage/hooks/react-query/product-details/useGetDiscountedItems";
import { getLanguage } from "helper-functions/getLanguage";
import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";
import NewProductCard from "components/cards/newCard/NewProductCard";
import { RTL } from "../../rtl";
import ProductCardSimmer from "components/Shimmer/ProductCardSimmer";
import SliderSectionHeader from "../../common/SliderSectionHeader";
import { HomeComponentsWrapper } from "../HomePageComponents";

const SpecialFoodOffers = ({ title }) => {
  const { t } = useTranslation();
  const params = { offset: 1, limit: 15 };
  const { data, isLoading, isFetching } = useGetDiscountedItems(params);
  const slider = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const lanDirection = getLanguage() ? getLanguage() : "ltr";
  const products = data?.products ?? [];

  const settings = {
    dots: false,
    infinite: false,
    slidesToShow: 5.2,
    swipeToSlide: true,
    slidesToScroll: 2,
    cssEase: "ease-in-out",
    speed: 800,
    arrows: false,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          swipeToSlide: true,
          infinite: data?.products?.length > 4,
        },
      },

      {
        breakpoint: 821,
        settings: {
          slidesToShow: 4,
          infinite: data?.products?.length > 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3.6,
          infinite: false,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 2,
          infinite: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2.3,
          infinite: false,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 400,
        settings: {
          slidesToShow: 2.1,
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
  if (!isFetching && !products.length) return null;

  return (
    <RTL direction={lanDirection}>
      <CustomBoxFullWidth
        sx={{
          padding: { xs: "16px 0px 16px 16px", md: "20px 0px 20px 24px" },
          backgroundColor: (theme) => alpha(theme.palette.neutral[400], 0.1),
          borderRadius: { xs: "12px", md: "16px" },
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <SliderSectionHeader
          sliderRef={slider}
          currentSlide={currentSlide}
          totalSlides={products.length}
          slidesToShow={5}
          sx={{ pr: { xs: "16px", md: "24px" } }}
          heading={
            isFetching ? (
              <Skeleton variant="text" width="110px" />
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
                {t(title ?? "Special Offer")}
              </Typography>
            )
          }
        />
        <CustomBoxFullWidth
          sx={{
            ".slick-slider .slick-track": { marginY: "10px" },
            "& .slick-slide": { padding: "0 5px" },
          }}
        >
          <Slider
            {...settings}
            ref={slider}
            afterChange={(idx) => setCurrentSlide(idx)}
          >
            {isFetching
              ? [...Array(5)].map((_, i) => (
                  <ProductCardSimmer key={i} variant="vertical" />
                ))
              : products.map((item, i) => (
                  <NewProductCard
                    key={i}
                    item={item}
                    variant="vertical"
                    cardWidth={{ xs: "150px", md: "170px" }}
                  />
                ))}
          </Slider>
        </CustomBoxFullWidth>
      </CustomBoxFullWidth>
    </RTL>
  );
};

export default SpecialFoodOffers;
