import { Stack, alpha } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import Slider from "react-slick";
import {
  CustomStackFullWidth,
  SliderCustom,
} from "styled-components/CustomStyles.style";
import CustomImageContainer from "../CustomImageContainer";
import CustomContainer from "../container";

const Banners = ({ landingPageData, isSmall }) => {
  const infiniteManage = () => {
    if (isSmall) {
      if (landingPageData?.promotion_banners?.length === 1) {
        return false;
      } else {
        return true;
      }
    } else {
      if (landingPageData?.promotion_banners?.length > 3) {
        return true;
      } else {
        return false;
      }
    }
  };

  const slidesToShowManage = () => {
    if (isSmall) {
      return 1;
    } else {
      if (landingPageData?.promotion_banners?.length > 2) {
        return 3;
      } else if (landingPageData?.promotion_banners?.length === 2) {
        return 2;
      } else {
        return 1;
      }
    }
  };
  const twoItemManage = () => {
    return (
      <CustomStackFullWidth
        justifyContent="center"
        flexDirection="row"
        gap="20px"
      >
        {/* <Grid container spacing={2}> */}
        {landingPageData?.promotion_banners_full_url?.map((item, index) => {
          return (
            <Box
              key={index}
              sx={{
                border: (theme) =>
                  `0.828571px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                position: "relative",
                height: "175px",
                width: { sm: "100%", md: "395px" },
                borderRadius: "5px",
                overflow: "hidden",
                "&:hover": {
                  img: {
                    transform: "scale(1.1)",
                    transition: "transform .8s ease-in-out",
                  },
                },
              }}
            >
              <CustomImageContainer
                src={item}
                alt="banners"
                height="100%"
                width="100%"
                objectfit="cover"
                borderRadius="5px"
              />
            </Box>
          );
        })}
      </CustomStackFullWidth>
    );
  };
  const sliderManage = () => {
    return (
      <SliderCustom
        sx={{
          "& .slick-slider": {
            "& .slick-slide": {
              padding: { xs: "5px", md: "11px" },
            },
          },
        }}
      >
        <Slider {...settings}>
          {landingPageData?.promotion_banners_full_url?.map((item, index) => {
            return (
              <Box
                key={index}
                sx={{
                  border: (theme) =>
                    `0.828571px solid ${alpha(
                      theme.palette.primary.main,
                      0.15
                    )}`,
                  position: "relative",
                  height: "175px",
                  width: "100%",
                  borderRadius: "5px",
                  overflow: "hidden",
                  "&:hover": {
                    img: {
                      transform: "scale(1.1)",
                      transition: "transform 0.8s ease-in-out",
                    },
                  },
                }}
              >
                <CustomImageContainer
                  src={item}
                  alt="banners"
                  height="100%"
                  width="100%"
                  objectfit="cover"
                  borderRadius="5px"
                />
              </Box>
            );
          })}
        </Slider>
      </SliderCustom>
    );
  };
  const settings = {
    dots: false,
    infinite: infiniteManage(),
    slidesToShow: slidesToShowManage(),
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  const singleImageManage = () => {
    return (
      <Stack
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            border: (theme) =>
              `0.828571px solid ${alpha(theme.palette.primary.main, 0.15)}`,
            position: "relative",
            height: "175px",
            borderRadius: "5px",
          }}
        >
          <CustomImageContainer
            src={landingPageData?.promotion_banners_full_url[0]}
            alt="banners"
            height="100%"
            width="100%"
            objectfit="cover"
            borderRadius="5px"
          />
        </Box>
      </Stack>
    );
  };
  const handleContent = () => {
    if (isSmall) {
      if (landingPageData?.promotion_banners?.length === 1) {
        return <>{singleImageManage()}</>;
      } else {
        return <>{sliderManage()}</>;
      }
    } else {
      if (landingPageData?.promotion_banners?.length === 1) {
        return <>{singleImageManage()}</>;
      } else if (landingPageData?.promotion_banners?.length === 2) {
        return <>{twoItemManage()}</>;
      } else {
        return <>{sliderManage()}</>;
      }
    }
  };
  return (
    <CustomContainer>
      <Stack sx={{ marginY: isSmall ? "22px" : "40px" }}>
        {handleContent()}
      </Stack>
    </CustomContainer>
  );
};

export default Banners;
