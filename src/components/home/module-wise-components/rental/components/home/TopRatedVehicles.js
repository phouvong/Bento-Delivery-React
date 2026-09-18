import { useState, useRef } from "react";
import { Button, Skeleton, Typography, useTheme } from "@mui/material";
import Slider from "react-slick";
import { getLanguage } from "helper-functions/getLanguage";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import { RTL } from "components/rtl";
import { HomeComponentsWrapper } from "../../../../HomePageComponents";
import { Box } from "@mui/system";
import NewProductCard from "components/cards/newCard/NewProductCard";
import H2 from "components/typographies/H2";
import { useTranslation } from "react-i18next";
import {
  NextFood,
  PrevFood,
} from "components/home/best-reviewed-items/SliderSettings";
import { useGetTopRatedVehicleLists } from "../../rental-api-manage/hooks/top-rated/useGetTopRatedVehicleLists";
import { useRouter } from "next/router";
import CarCard from "../global/CarCard";

const TopRatedVehicles = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const theme = useTheme();
  const {
    data: topRatedVehicles,
    isFetching,
    isLoading,
  } = useGetTopRatedVehicleLists();
  const lanDirection = getLanguage() ? getLanguage() : "ltr";
  const [isHover, setIsHover] = useState(false);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const sliderRef = useRef(null);

  // Update arrow visibility based on current slide
  const updateArrowVisibility = (currentSlide) => {
    const totalSlides = topRatedVehicles?.vehicles?.length;
    const slidesToShow =
      window.innerWidth >= 992 ? 4 : window.innerWidth >= 576 ? 2 : 1;

    setShowLeftArrow(currentSlide > 0);
    setShowRightArrow(currentSlide < totalSlides - slidesToShow);
  };

  const handleSeemoreClick = () => {
    router.push({
      pathname: "/rental/vehicle-search",
      query: {
        top_rated: 1,
        ...(router.query.module ? { module: router.query.module } : {}),
      },
    });
  };

  // With fractional `slidesToShow`, infinite mode renders clones on the left
  // edge, which produces an unwanted half-slide peek on the left. Keeping
  // `infinite: false` here forces the peek to appear only on the right (the
  // direction the user can swipe further).
  const settings = {
    dots: false,
    infinite: false,
    slidesToShow: 4.5,
    cssEase: "ease-in-out",
    autoplay: true,
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
          infinite: false,
        },
      },
      {
        breakpoint: 780,
        settings: {
          slidesToShow: 3.2,
          swipeToSlide: true,
          infinite: false,
        },
      },
      {
        breakpoint: 760,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: false,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2.2,
          slidesToScroll: 1,
          infinite: false,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1.4,
          slidesToScroll: 1,
          swipeToSlide: true,
          initialSlide: 1,
          infinite: false,
        },
      },
      {
        breakpoint: 400,
        settings: {
          slidesToShow: 1.2,
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
    afterChange: (current) => {
      updateArrowVisibility(current);
    },
  };

  return (
    <>
      {isLoading ? (
        <HomeComponentsWrapper
          sx={{
            cursor: "pointer",
            mb: "50px",
            ".slick-slide": {
              padding: "10px",
              ".MuiBox-root": {
                overflow: "visible",
              },
            },
            ".slick-dots li button:before": {
              opacity: 1,
              color: (theme) => theme.palette.neutral[700],
            },
          }}
        >
          <CustomStackFullWidth
            alignItems="center"
            justyfyContent="center"
            mb={3}
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

            <RTL direction={lanDirection}>
              <CustomBoxFullWidth>
                <Slider {...settings}>
                  {[...Array(4)].map((item, index) => {
                    return (
                      <Skeleton
                        key={index}
                        variant="rounded"
                        height={383}
                        width={400}
                      />
                    );
                  })}
                </Slider>
              </CustomBoxFullWidth>
            </RTL>
          </CustomStackFullWidth>
        </HomeComponentsWrapper>
      ) : topRatedVehicles?.vehicles?.length > 0 ? (
        <HomeComponentsWrapper
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          sx={{
            cursor: "pointer",
            backgroundColor: theme.palette.background.paper,
            borderRadius: { xs: 0, md: "20px" },
            padding: 0,
            paddingBottom: { xs: 0, md: "3px" },
            ".slick-slide": {
              padding: "10px",
              ".MuiBox-root": {
                overflow: "visible",
              },
            },
            ".slick-dots li button:before": {
              opacity: 1,
              color: (theme) => theme.palette.neutral[700],
            },
          }}
        >
          <CustomStackFullWidth
            alignItems="center"
            justyfyContent="center"
            mb={3}
            spacing={1.2}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
          >
            <CustomStackFullWidth
              alignItems="flex-start"
              justifyContent="flex-start"
              direction="column"
              spacing={0.5}
              sx={{
                px: { xs: "16px", md: "20px" },
                pt: { xs: "16px", md: "16px" },
              }}
            >
              <Typography
                component="h2"
                sx={{
                  fontSize: { xs: "20px", md: "24px" },
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  fontFamily: "'DM Sans', sans-serif",
                  lineHeight: 1.2,
                  letterSpacing: "-0.5px",
                }}
              >
                {t("Discover Local Favorites")}
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "13px", md: "14px" },
                  fontWeight: 400,
                  color: theme.palette.neutral[500],
                  fontFamily: "'DM Sans', sans-serif",
                  lineHeight: 1.4,
                }}
              >
                {t("Most trusted vehicles chosen by thousands of users.")}
              </Typography>
            </CustomStackFullWidth>

            <RTL direction={lanDirection}>
              <CustomBoxFullWidth
                sx={{
                  pl: { xs: "16px", md: "20px" },
                  ".slick-track ": {
                    marginLeft: "0px",
                    marginRight: "0px",
                  },
                }}
              >
                <Slider ref={sliderRef} {...settings}>
                  {topRatedVehicles?.vehicles?.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        img: {
                          borderRadius: ".5rem",
                        },
                      }}
                    >
                      <CarCard data={item} />
                    </Box>
                  ))}
                </Slider>
              </CustomBoxFullWidth>
            </RTL>
          </CustomStackFullWidth>
        </HomeComponentsWrapper>
      ) : null}
    </>
  );
};

export default TopRatedVehicles;
