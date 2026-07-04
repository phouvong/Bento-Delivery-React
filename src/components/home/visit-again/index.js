import {
  alpha,
  useMediaQuery,
  useTheme,
  Card,
  Skeleton,
  Box,
  Grid,
  Typography,
} from "@mui/material";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { getToken } from "helper-functions/getToken";
import { ModuleTypes } from "helper-functions/moduleTypes";
import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Slider from "react-slick";
import {
  CustomStackFullWidth,
  SliderCustom,
  CustomBoxFullWidth,
} from "styled-components/CustomStyles.style";
import H1 from "../../typographies/H1";
import Subtitle1 from "../../typographies/Subtitle1";
import ExpressStoreCard from "components/cards/newCard/ExpressStoreCard";
import SliderSectionHeader from "components/common/SliderSectionHeader";

const VisitAgainShimmerCard = () => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Card
      sx={{
        background: theme.palette.neutral[100],
        padding: "10px",
        width: { xs: "220px", md: "280px" },
      }}
    >
      <Box
        sx={{
          borderRadius: "10px",
          position: "relative",
          height: { xs: "100px", md: "132px" },
          width: "100%",
        }}
      >
        <Skeleton
          variant="rectangular"
          height="100%"
          width="100%"
          sx={{ borderRadius: "10px" }}
        />
      </Box>
      <CustomBoxFullWidth sx={{ mt: "10px" }}>
        <Grid container spacing={1.5}>
          <Grid item xs={8.5} md={9}>
            <Skeleton variant="text" width="80%" height={20} />
            <Skeleton variant="text" width="100%" height={40} />
          </Grid>
          <Grid item xs={3.5} md={3}>
            <Skeleton variant="text" width="100%" height={20} />
          </Grid>
        </Grid>
      </CustomBoxFullWidth>
    </Card>
  );
};

const VisitAgain = ({ configData, visitedStores, isVisited, isLoading }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const token = getToken();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);

  // Re-render slider when data changes
  useEffect(() => {
    if (sliderRef.current && !isLoading) {
      setTimeout(() => {
        sliderRef.current?.slickGoTo?.(0);
      }, 0);
    }
  }, [isLoading, visitedStores]);

  const getModuleWiseData = () => {
    switch (getCurrentModuleType()) {
      case ModuleTypes.GROCERY:
        return {
          mainPosition: "flex-start",
          heading: isVisited ? t("Visit Again!") : t("Whats New"),
          subHeading: t(
            "Get your recent purchase from the shop you recently ordered",
          ),
          bgColor: "transparent",
          titleSx: {
            fontSize: { xs: "18px", md: "24px" },
            color: "neutral.1050",
            lineHeight: 1.1,
            letterSpacing: "-1.2px",
          },
        };
      case ModuleTypes.PHARMACY:
        return {
          mainPosition: !isVisited ? "flex-start" : "center",
          heading: isVisited ? t("Visit Again!") : t("Whats New"),
          subHeading: t(
            "Get your recent medicine from the store you recently ordered",
          ),
          bgColor: "transparent",
          titleSx: {
            fontSize: { xs: "18px", md: "24px" },
            color: "neutral.1050",
            lineHeight: 1.1,
            letterSpacing: "-1.2px",
          },
        };
      case ModuleTypes.ECOMMERCE:
        return {
          mainPosition: "flex-start",
          heading: isVisited ? t("Visit Again!") : t("Whats New"),
          subHeading: t(
            "Get your recent purchase from the shop you recently ordered",
          ),
          bgColor: "transparent",
          titleSx: {
            fontSize: { xs: "18px", md: "24px" },
            color: "neutral.1050",
            lineHeight: 1.1,
            letterSpacing: "-1.2px",
          },
        };
      case ModuleTypes.FOOD:
        return {
          mainPosition: "flex-start",
          heading: isVisited ? t("Wanna Try  Again!!") : t("Whats New"),
          subHeading: t(
            "Get your recent food from the restaurant you recently ordered",
          ),
          bgColor: "transparent",
          titleSx: {
            fontSize: { xs: "18px", md: "24px" },
            color: "neutral.1050",
            lineHeight: 1.1,
            letterSpacing: "-1.2px",
          },
        };
    }
  };
  // Don't render the section if not loading and no visited stores
  if (!isLoading && (!visitedStores || visitedStores.length === 0) && !token) {
    return null;
  }

  const enhancedSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3.3,
    slidesToScroll: 1,
    swipeToSlide: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1450,
        settings: {
          slidesToShow: 3.3,
          slidesToScroll: 1,
          swipeToSlide: true,
          infinite: false,
        },
      },
      {
        breakpoint: 1250,
        settings: {
          slidesToShow: 2.8,
          slidesToScroll: 1,
          swipeToSlide: true,
          infinite: false,
        },
      },
      {
        breakpoint: 1150,
        settings: {
          slidesToShow: 3.1,
          slidesToScroll: 1,
          swipeToSlide: true,
          infinite: false,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2.2,
          slidesToScroll: 2,
          swipeToSlide: true,
          infinite: false,
        },
      },
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 2.5,
          slidesToScroll: 2,
          swipeToSlide: true,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2.1,
          slidesToScroll: 2,
          swipeToSlide: true,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 479,
        settings: {
          slidesToShow: 1.4,
          slidesToScroll: 1,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 450,
        settings: {
          slidesToShow: 1.3,
          slidesToScroll: 1,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 375,
        settings: {
          slidesToShow: 1.15,
          slidesToScroll: 1,
          swipeToSlide: true,
        },
      },

      {
        breakpoint: 350,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          swipeToSlide: true,
        },
      },
    ],
  };

  const moduleData = getModuleWiseData?.();

  return (
    <CustomStackFullWidth
      alignItems="flex-start"
      spacing={{ xs: 1.5, md: 1 }}
      paddingX={{ xs: 0, md: 0 }}
    >
      <SliderSectionHeader
        sliderRef={sliderRef}
        currentSlide={currentSlide}
        totalSlides={visitedStores?.length ?? 0}
        slidesToShow={3.2}
        heading={
          <Box>
            <H1
              text={moduleData?.heading}
              component="h2"
              sx={{ ...moduleData?.titleSx, textAlign: "left" }}
            />
            {isVisited && (
              <Subtitle1
                textAlign="left"
                text={moduleData?.subHeading}
                component="p"
              />
            )}
          </Box>
        }
      />
      <SliderCustom
        nopadding="true"
        sx={{
          "& .slick-track": { marginLeft: 0 },
          "& .slick-slide": { paddingRight: "16px" },
          "& .slick-slide:first-child": { paddingLeft: 0 },
        }}
      >
        <Slider
          ref={sliderRef}
          {...enhancedSettings}
          afterChange={(idx) => setCurrentSlide(idx)}
        >
          {isLoading
            ? [...Array(5)].map((_, index) => (
                <VisitAgainShimmerCard key={index} />
              ))
            : visitedStores?.map((item, index) => (
                <ExpressStoreCard
                  key={index}
                  store={item}
                  showProducts={false}
                  width="100%"
                  noShadow
                />
              ))}
        </Slider>
      </SliderCustom>
    </CustomStackFullWidth>
  );
};

VisitAgain.propTypes = {};

export default VisitAgain;
