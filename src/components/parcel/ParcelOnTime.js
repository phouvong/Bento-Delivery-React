import React, { useEffect } from "react";
import { Box, Skeleton, useMediaQuery, useTheme } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import NextImage from "components/NextImage";
import useGetOtherBanners from "../../api-manage/hooks/react-query/useGetOtherBanners";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "../../styled-components/CustomStyles.style";
import { HomeComponentsWrapper } from "../home/HomePageComponents";

const ParcelOnTime = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const bannerHeight = isMobile ? 133 : 212;
  const { data, isLoading, refetch } = useGetOtherBanners();

  useEffect(() => {
    refetch();
  }, []);

  const settings = {
    dots: true,
    infinite: data?.banners?.length > 3,
    slidesToShow: 3,
    cssEase: "ease-in-out",
    autoplay: true,
    speed: 800,
    autoplaySpeed: 4000,
    variableHeight: true,
    initialSlide: 0,
    centerMode: false,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          infinite: data?.banners?.length > 2,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1.1,
          slidesToScroll: 1,
          swipeToSlide: true,
          infinite: false,
          dots: false,
        },
      },
    ],
  };

  if (!isLoading && !data?.banners?.length) {
    return null;
  }

  return (
    <HomeComponentsWrapper
      sx={{
        // Reserve space inside each slide for a gap, then pull the track
        // edges back in by the same amount so the row still aligns flush.
        ".slick-list": {
          marginInline: "-8px",
        },
        ".slick-slide > div": {
          paddingInline: "8px",
          boxSizing: "border-box",
        },
        ".slick-slide": {
          padding: "0 0px",
        },
      }}
    >
      <CustomStackFullWidth
        alignItems="center"
        justifyContent="center"
        spacing={1}
      >
        <CustomBoxFullWidth
          sx={{
            ".slick-dots": { mt: 0 },
            ".slick-track ": {
              marginLeft: "0px",
              marginRight: "0px",
            },
          }}
        >
          {isLoading ? (
            <Slider {...settings}>
              {[...Array(4)].map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rounded"
                  height={bannerHeight}
                  width={400}
                />
              ))}
            </Slider>
          ) : (
            <Slider {...settings}>
              {data?.banners?.map((item, index) => (
                <Box key={index} sx={{ img: { width: "100%" } }}>
                  <NextImage
                    src={item?.value_full_url || ""}
                    width={400}
                    maxWidth="100%"
                    height={bannerHeight}
                    bg="#ddd"
                    borderRadius={20}
                    objectFit="cover"
                  />
                </Box>
              ))}
            </Slider>
          )}
        </CustomBoxFullWidth>
      </CustomStackFullWidth>
    </HomeComponentsWrapper>
  );
};

export default ParcelOnTime;
