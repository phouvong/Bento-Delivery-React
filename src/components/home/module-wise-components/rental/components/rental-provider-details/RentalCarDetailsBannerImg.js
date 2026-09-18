import { alpha, Stack, Typography } from "@mui/material";
import CustomImageContainer from "components/CustomImageContainer";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import React from "react";
import Slider from "react-slick";
import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";

const RentalCarDetailsBannerImg = ({
  cover_photo_url,
  bannerData,
  bannerLoading,
  data,
}) => {
  const tempBanner = bannerData
    ? [
        ...bannerData,
        {
          image_full_url: cover_photo_url,
        },
      ]
    : [
        {
          image_full_url: cover_photo_url,
        },
      ];

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
    autoplay: true,
    speed: 800,
    autoplaySpeed: 3000,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          swipeToSlide: true,
        },
      },
    ],
  };

  const handleBannerClick = (link) => {
    if (link) {
      window.open(link, "_blank");
    }
  };

  return (
    <>
      <CustomBoxFullWidth
        sx={{
          borderRadius: "10px",
          height: { xs: "200px", sm: "265px", position: "relative" },
        }}
      >
        {tempBanner?.length ? (
          <Slider {...settings}>
            {tempBanner?.map((banner) => {
              return (
                <Stack
                  key={banner?.id}
                  onClick={
                    banner?.link
                      ? () => handleBannerClick(banner?.link)
                      : undefined
                  }
                  sx={{
                    cursor: banner?.link ? "pointer" : "default",
                    borderRadius: "10px",
                    height: { xs: "200px", sm: "265px" },
                  }}
                >
                  <CustomImageContainer
                    src={banner?.image_full_url}
                    width="100%"
                    height="100%"
                    borderRadius="10px"
                  />
                </Stack>
              );
            })}
          </Slider>
        ) : (
          <CustomImageContainer
            width="100%"
            height="100%"
            borderRadius="10px"
            src={cover_photo_url}
          />
        )}
        {data?.discount ? (
          <Stack
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: (theme) =>
                alpha(theme.palette.primary.main, 0.7),
              color: (theme) => theme.palette.neutral[100],
              padding: "10px",
              borderRadius: "10px",
            }}
          >
            <Typography fontSize="13px" fontWeight="600" textAlign="center">
              {`${data?.discount?.discount}% discount will be applicable when booking amount is more than ${getAmountWithSign(
                data?.discount?.min_purchase
              )} max ${getAmountWithSign(
                data?.discount?.max_discount
              )} discount is applicable.`}

            </Typography>
          </Stack>
        ) : null}
      </CustomBoxFullWidth>
    </>
  );
};

export default RentalCarDetailsBannerImg;
