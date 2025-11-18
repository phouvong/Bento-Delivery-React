import { alpha, useMediaQuery, useTheme, Card, Skeleton, Box, Grid, Typography } from "@mui/material";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { getToken } from "helper-functions/getToken";
import { ModuleTypes } from "helper-functions/moduleTypes";
import React, { useState } from "react";
import Slider from "react-slick";
import {
  CustomStackFullWidth,
  SliderCustom,
  CustomBoxFullWidth,
} from "styled-components/CustomStyles.style";
import VisitAgainCard from "../../cards/VisitAgainCard";
import CustomContainer from "../../container";
import H1 from "../../typographies/H1";
import Subtitle1 from "../../typographies/Subtitle1";
import { createEnhancedArrows } from "../../common/EnhancedSliderArrows";

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
  const theme = useTheme();
  const token = getToken();
  const isSmallScreen = useMediaQuery('(min-width:600px)');
  const [isSliderHovered, setIsSliderHovered] = useState(false);

  const getModuleWiseData = () => {
    switch (getCurrentModuleType()) {
      case ModuleTypes.GROCERY:
        return {
          mainPosition: "flex-start",
          heading: isVisited ? "Visit Again!" : "Whats New",
          subHeading:
            "Get your recent purchase from the shop you recently ordered",
          bgColor:
            theme.palette.mode === "dark"
              ? "rgba(3, 157, 85, 0.05)"
              : alpha(theme.palette.primary.main, 0.2),
        };
      case ModuleTypes.PHARMACY:
        return {
          mainPosition: !isVisited ? "flex-start" : "center",
          heading: isVisited ? "Visit Again!" : "Whats New",
          subHeading:
            "Get your recent medicine from the store you recently ordered",
          bgColor:
            theme.palette.mode === "dark"
              ? "rgba(3, 157, 85, 0.05)"
              : alpha(theme.palette.primary.main, 0.2),
        };
      case ModuleTypes.ECOMMERCE:
        return {
          mainPosition: "flex-start",
          heading: isVisited ? "Visit Again!" : "Whats New",
          subHeading:
            "Get your recent purchase from the shop you recently ordered",
          bgColor:
            theme.palette.mode === "dark"
              ? "rgba(3, 157, 85, 0.05)"
              : alpha(theme.palette.primary.main, 0.2),
        };
      case ModuleTypes.FOOD:
        return {
          mainPosition: "flex-start",
          heading: isVisited ? "Wanna Try  Again!!" : "Whats New",
          subHeading:
            "Get your recent food from the restaurant you recently ordered",
          bgColor:
            theme.palette.mode === "dark"
              ? "rgba(3, 157, 85, 0.05)"
              : alpha(theme.palette.primary.main, 0.2),
        };
    }
  };
  // Don't render the section if not loading and no visited stores
  if (!isLoading && (!visitedStores || visitedStores.length === 0) && !token) {
    return null;
  }

  // Enhanced slider settings with hover arrows
  const enhancedSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    ...createEnhancedArrows(isSliderHovered, { 
      displayNoneOnMobile: true,
      variant: "white"
    }),
    responsive: [
      {
        breakpoint: 1450,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 3,
          infinite: false,
        },
      },
      {
        breakpoint: 1250,
        settings: {
          slidesToShow: 3.5,
          slidesToScroll: 2,
          infinite: false,
        },
      },
      {
        breakpoint: 1150,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: false,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2.7,
          slidesToScroll: 2,
          infinite: false,
        },
      },
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 2.5,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2.1,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 479,
        settings: {
          slidesToShow: 1.8,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 450,
        settings: {
          slidesToShow: 1.8,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 400,
        settings: {
          slidesToShow: 1.6,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 350,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 310,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      <CustomStackFullWidth
          alignItems={getModuleWiseData?.()?.mainPosition}
          justyfyContent={getModuleWiseData?.()?.mainPosition}
          mt={isSmallScreen ? "2px" : "16px"}
          spacing={{ xs: 2, md: 1 }}
         
        >
          {isSmallScreen ? (
            <CustomContainer>
              <CustomStackFullWidth
                alignItems={getModuleWiseData?.()?.mainPosition}
                justyfyContent={getModuleWiseData?.()?.mainPosition}
                mt="10px"
                spacing={1}
              >
                <H1 text={getModuleWiseData?.()?.heading} component="h2" />
                {isVisited && (
                  <Subtitle1
                    textAlign={getModuleWiseData?.()?.mainPosition}
                    text={getModuleWiseData?.()?.subHeading}
                    component="p"
                  />
                )}
              </CustomStackFullWidth>
            </CustomContainer>
          ) : (
            <>
              <H1 text={getModuleWiseData?.()?.heading} component="h2" />
              {isVisited && (
                <Subtitle1
                  text={getModuleWiseData?.()?.subHeading}
                  component="p"
                />
              )}
            </>
          )}
          <SliderCustom
            nopadding="true"
            sx={{
              backgroundColor: getModuleWiseData?.()?.bgColor,
              padding: { xs: "0px", md: "17px" },
               minHeight:"200px"
            }}
            onMouseEnter={() => setIsSliderHovered(true)}
            onMouseLeave={() => setIsSliderHovered(false)}
          >
            <Slider {...enhancedSettings}>
              {isLoading ? (
                [...Array(5)].map((_, index) => (
                  <VisitAgainShimmerCard key={index} />
                ))
              ) : (
                visitedStores?.map((item, index) => {
                  return (
                    <VisitAgainCard
                      key={index}
                      item={item}
                      configData={configData}
                      isVisited={isVisited}
                    />
                  );
                })
              )}
            </Slider>
          </SliderCustom>
        </CustomStackFullWidth>
    </>
  );
};

VisitAgain.propTypes = {};

export default VisitAgain;
