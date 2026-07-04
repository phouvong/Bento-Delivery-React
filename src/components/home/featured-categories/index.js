import React, { useRef, useState } from "react";
import { t } from "i18next";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import {
  CustomBoxFullWidth,
  SliderCustom,
} from "styled-components/CustomStyles.style";
import { Skeleton, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import Slider from "react-slick";
import { useGetFeaturedCategories } from "api-manage/hooks/react-query/all-category/all-categorys";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { ModuleTypes } from "helper-functions/moduleTypes";
import FoodCategoryCard from "../../cards/FoodCategoryCard";
import { HomeComponentsWrapper } from "../HomePageComponents";
import SliderSectionHeader from "components/common/SliderSectionHeader";

const FeaturedCategories = () => {
  const { featuredCategories } = useSelector((state) => state.storedData);
  const slider = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { data, isLoading } = useGetFeaturedCategories();

  const totalSlides = data?.data?.length ?? 0;

  const foodCategorySliderSettings = {
    dots: false,
    infinite: featuredCategories.length >= 7,
    speed: 300,
    slidesToShow: 8.4,
    slidesToScroll: 3,
    swipeToSlide: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1450,
        settings: {
          slidesToShow: 8.4,
          slidesToScroll: 3,
          swipeToSlide: true,
          infinite: featuredCategories.length >= 8,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 7.8,
          slidesToScroll: 3,
          swipeToSlide: true,
          infinite: false,
        },
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 4.5,
          slidesToScroll: 1,
          swipeToSlide: true,
          infinite: false,
        },
      },
      {
        breakpoint: 400,
        settings: {
          slidesToShow: 4.5,
          slidesToScroll: 1,
          swipeToSlide: true,
          infinite: false,
        },
      },
      {
        breakpoint: 350,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          swipeToSlide: true,
          infinite: false,
        },
      },
    ],
  };

  const sliderSx = {
    "& .slick-slider": {
      "& .slick-list": {
        margin: { xs: "0", md: "0 -6px" },
      },
      "& .slick-slide": {
        padding: { xs: "0px", md: "6px" },
        paddingBottom: { xs: "5px", sm: "10px" },
      },
    },
  };

  const sectionTitle = {
    [ModuleTypes.FOOD]: t("Find Your Flavour"),
    [ModuleTypes.GROCERY]: t("Shop by Categories"),
    [ModuleTypes.PHARMACY]: t("Shop by Categories"),
    [ModuleTypes.ECOMMERCE]: t("Explore Categories"),
  }[getCurrentModuleType()] ?? t("Find Your Flavour");

  return (
    <CustomBoxFullWidth>
      {isLoading ? (
        <HomeComponentsWrapper>
          <SliderCustom sx={sliderSx}>
            <Slider {...foodCategorySliderSettings} ref={slider}>
              {[...Array(9)]?.map((_, index) => (
                <FoodCategoryCard key={index} onlyshimmer />
              ))}
            </Slider>
          </SliderCustom>
        </HomeComponentsWrapper>
      ) : (
        data?.data &&
        data?.data.length > 0 && (
          <HomeComponentsWrapper sx={{ gap: "1rem" }}>
            <SliderSectionHeader
              sliderRef={slider}
              currentSlide={currentSlide}
              totalSlides={totalSlides}
              slidesToShow={8.4}
              heading={
                <Typography
                  sx={{
                    fontSize: { xs: "14px", md: "24px" },
                    fontWeight: 700,
                    color: "neutral.1050",
                    lineHeight: 1.1,
                    letterSpacing: "-0.48px",
                    display: { xs: "none", sm: "block" },
                  }}
                >
                  {sectionTitle}
                </Typography>
              }
            />
            <SliderCustom sx={sliderSx}>
              <Slider
                {...foodCategorySliderSettings}
                ref={slider}
                afterChange={(idx) => setCurrentSlide(idx)}
              >
                {data?.data?.map((item) => (
                  <FoodCategoryCard
                    key={item?.id}
                    id={item?.id}
                    categoryImage={item?.image}
                    name={item?.name}
                    slug={item?.slug}
                    categoryImageUrl={item?.image_full_url}
                    height="40px"
                  />
                ))}
              </Slider>
            </SliderCustom>
          </HomeComponentsWrapper>
        )
      )}
    </CustomBoxFullWidth>
  );
};

export default FeaturedCategories;
