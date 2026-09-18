import React from "react";
import { Skeleton, styled, useMediaQuery, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import Slider from "react-slick";
import Link from "next/link";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import {
  CustomStackFullWidth,
  SliderCustom,
} from "styled-components/CustomStyles.style";
import NextImage from "components/NextImage";
import { useGetVehicleBannerList } from "../../rental-api-manage/hooks/react-query/banner/useGetVehicleBannerList";

// Same wrapper/UI as the shared Banners component
// (src/components/home/banners/index.js)
export const BannersWrapper = styled(Box)(({ theme }) => ({
  cursor: "pointer",
  borderRadius: "16px",
  width: "100%",
  height: "150px",
  position: "relative",
  overflow: "hidden",
  img: {
    width: "100%",
    height: "100%",
  },

  "&:hover": {
    img: {
      transform: "scale(1.04)",
    },
  },

  [theme.breakpoints.down("sm")]: {
    height: "160px",
  },
}));

const RentalBanner = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { data: bannerLists, isLoading } = useGetVehicleBannerList();

  const banners = bannerLists?.banners ?? [];

  // Count-based slidesToShow — same approach as Banners.
  const getBannerCount = () => {
    if (banners.length === 1) return 1;
    if (banners.length === 2) return 2;
    return 3.1;
  };

  const settings = {
    dots: true,
    infinite: false,
    slidesToShow: getBannerCount(),
    slidesToScroll: 1,
    swipeToSlide: true,
    autoplay: true,
    speed: 800,
    autoplaySpeed: 4000,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1.15,
          slidesToScroll: 1,
          swipeToSlide: true,
          infinite: false,
          autoplay: false,
        },
      },
    ],
  };

  // ── Business logic preserved (unchanged from the original RentalBanner) ──
  //   store_wise → rental provider page
  //   link       → external/internal link
  //   else       → no redirect
  const renderBanner = (item, index) => {
    const isClickable = item?.type === "store_wise" || !!item?.link;

    const banner = (
      <BannersWrapper sx={{ cursor: isClickable ? "pointer" : "default" }}>
        <NextImage
          src={item?.image_full_url}
          alt={item?.title}
          height={isSmallScreen ? "160" : "150"}
          width={300}
          objectFit="cover"
          borderRadius="16px"
        />
      </BannersWrapper>
    );

    if (item?.type === "store_wise") {
      return (
        <Link
          key={index}
          href={`/rental/provider/${item?.slug || item?.provider_id}`}
        >
          {banner}
        </Link>
      );
    }

    if (item?.link) {
      return (
        <Link key={index} href={item?.link || ""}>
          {banner}
        </Link>
      );
    }

    return <Box key={index}>{banner}</Box>;
  };

  return (
    <CustomStackFullWidth
      sx={{
        mt: { xs: 0, sm: "10px" },
        pl: { xs: "16px", sm: "20px", md: "10px" },
        "& .slick-track": { marginLeft: 0 },
        "& .slick-list": {
          marginRight: "-16px",
        },
        "& .slick-slide": {
          paddingRight: "16px !important",
        },
        "& .slick-dots": {
          position: "static",
          marginTop: { xs: 0, sm: "10px" },
          display: "flex !important",
          justifyContent: "center",
          alignItems: "center",
          gap: "6px",
          "& li": {
            width: 8,
            height: 8,
            margin: 0,
            display: "flex",
          },
          "& li button": {
            width: 8,
            height: 8,
            padding: 0,
          },
          "& li button:before": {
            content: '""',
            width: 8,
            height: 8,
            top: 0,
            left: 0,
            borderRadius: "50%",
            backgroundColor: (theme) =>
              theme.palette.action?.disabled || "#C7C7CC",
            opacity: 1,
            fontSize: 0,
            lineHeight: 0,
          },
          "& li.slick-active button:before": {
            backgroundColor: "primary.main",
            opacity: 1,
            transform: "scale(1.1)",
          },
        },
        marginInlineStart: { xs: 0, sm: "-8px" },
      }}
    >
      {isLoading ? (
        <Slider {...settings}>
          {[...Array(2)].map((_, index) => (
            <BannersWrapper key={index}>
              <Skeleton variant="rectangular" height="100%" width="100%" />
            </BannersWrapper>
          ))}
        </Slider>
      ) : (
        banners?.length > 0 && (
          <SliderCustom padding="0px">
            <Slider {...settings}>
              {banners.map((item, index) => renderBanner(item, index))}
            </Slider>
          </SliderCustom>
        )
      )}
    </CustomStackFullWidth>
  );
};

export default RentalBanner;
