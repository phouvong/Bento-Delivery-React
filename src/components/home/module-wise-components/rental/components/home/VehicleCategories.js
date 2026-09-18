import { useState, useRef } from "react";
import { Button, Skeleton, Typography } from "@mui/material";
import Slider from "react-slick";
import { getLanguage } from "helper-functions/getLanguage";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import { HomeComponentsWrapper } from "../../../../HomePageComponents";
import { Box } from "@mui/system";
import H2 from "components/typographies/H2";
import { useTranslation } from "react-i18next";
import {
  NextFood,
  PrevFood,
} from "components/home/best-reviewed-items/SliderSettings";

import RentalCategory from "../global/RentalCategory";
import { useGetCategoryVehicleLists } from "../../rental-api-manage/hooks/react-query/category/useGetCategoryLists";
import { useRouter } from "next/router";

const VehicleCategories = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isHover, setIsHover] = useState(false);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const sliderRef = useRef(null); // Ref for the slider
  const {
    data: categories,
    isFetching,
    isLoading,
  } = useGetCategoryVehicleLists();

  console.log("categories", categories);

  // Update arrow visibility based on the current slide
  const updateArrowVisibility = (currentSlide) => {
    const totalSlides = categories.length;
    const slidesToShow =
      window.innerWidth >= 1400
        ? 4
        : window.innerWidth >= 1200
        ? 3
        : window.innerWidth >= 992
        ? 2
        : 1;

    setShowLeftArrow(currentSlide > 0);
    setShowRightArrow(currentSlide < totalSlides - slidesToShow);
  };

  const handleSeeAllClick = () => {
    router.push({
      pathname: "/rental/vehicle-search",
      query: {
        all_category: 1,
        ...(router.query.module ? { module: router.query.module } : {}),
      },
    });
  };

  const settings = {
    dots: false,
    infinite: false,
    slidesToShow: 6.5,
    cssEase: "ease-in-out",
    autoplay: false,
    speed: 800,
    autoplaySpeed: 4000,
    variableHeight: true,
    swipeToSlide: true,
    prevArrow: isHover && showLeftArrow && <PrevFood displayNoneOnMobile />,
    nextArrow: isHover && showRightArrow && <NextFood displayNoneOnMobile />,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 2,
          swipeToSlide: true,
        },
      },
    ],
    afterChange: (current) => {
      updateArrowVisibility(current);
    },
  };

  return (
    <>
      {isLoading ? (
        <HomeComponentsWrapper
          sx={{
            mt: "-4S0px",
            cursor: "pointer",
            ".slick-slide": {
              padding: "10px",
              ".MuiBox-root": {
                overflow: "visible",
              },
            },
          }}
        >
          <CustomStackFullWidth
            alignItems="center"
            justyfyContent="center"
            spacing={1}
          >
            <CustomStackFullWidth
              alignItems="center"
              justifyContent="space-between"
              direction="row"
            >
              <Skeleton variant="text" width="110px" />
              <Skeleton width="100px" variant="80px" />
            </CustomStackFullWidth>

            <CustomBoxFullWidth>
              <Slider {...settings}>
                {[...Array(4)].map((item, index) => {
                  return (
                    <Skeleton
                      key={index}
                      variant="rounded"
                      height={180}
                      width={400}
                    />
                  );
                })}
              </Slider>
            </CustomBoxFullWidth>
          </CustomStackFullWidth>
        </HomeComponentsWrapper>
      ) : categories?.vehicles?.length > 0 ? (
        <HomeComponentsWrapper
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          sx={{
            cursor: "pointer",
            pl: 0,
            ".slick-list": {
              marginLeft: "-10px",
            },
            ".slick-slide": {
              padding: "10px",
              ".MuiBox-root": {
                overflow: "visible",
              },
            },
          }}
        >
          <CustomStackFullWidth
            alignItems="center"
            justyfyContent="center"
            spacing={1}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
          >
            <CustomStackFullWidth
              alignItems="center"
              justifyContent="space-between"
              direction="row"
            >
              <Typography
                sx={{
                  fontSize: { xs: "18px", md: "24px" },
                  fontWeight: 700,
                  color: "neutral.1050",
                  lineHeight: 1.1,
                  letterSpacing: "-1.2px",
                  whiteSpace: "nowrap",
                }}
              >
                {t("Vehicle Categories")}
              </Typography>

              <Button
                variant="text"
                onClick={handleSeeAllClick}
                sx={{
                  transition: "all ease 0.5s",
                  textTransform: "capitalize",
                  "&:hover": {
                    letterSpacing: "0.03em",
                  },
                }}
              >
                {t("See all")}
              </Button>
            </CustomStackFullWidth>

            <CustomBoxFullWidth
              sx={{
                ".slick-track ": {
                  marginLeft: "0px",
                  marginRight: "0px",
                },
              }}
            >
              <Slider ref={sliderRef} {...settings}>
                {categories?.vehicles?.map((item, index) => (
                  <Box key={index}>
                    <RentalCategory data={item} />
                  </Box>
                ))}
              </Slider>
            </CustomBoxFullWidth>
          </CustomStackFullWidth>
        </HomeComponentsWrapper>
      ) : null}
    </>
  );
};

export default VehicleCategories;
