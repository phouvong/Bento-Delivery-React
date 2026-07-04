import React, { useEffect, useState } from "react";
import { handleStoreRedirect } from "helper-functions/handleStoreRedirect";

import { Grid, Skeleton, styled, useMediaQuery, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import useGetBanners from "../../../api-manage/hooks/react-query/useGetBanners";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { getModuleId } from "helper-functions/getModuleId";
import { ModuleTypes } from "helper-functions/moduleTypes";
import { setBanners } from "redux/slices/storedData";
import {
  CustomStackFullWidth,
  SliderCustom,
} from "styled-components/CustomStyles.style";
import CustomImageContainer from "../../CustomImageContainer";
import FoodDetailModal from "../../food-details/foodDetail-modal/FoodDetailModal";
import NextImage from "components/NextImage";
import { handleProductRedirect } from "helper-functions/handleProductRedirect";

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

const Banners = ({ feature }) => {
  const router = useRouter();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isExtraSmallScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const { selectedModule } = useSelector((state) => state.utilsData);
  const { banners } = useSelector((state) => state.storedData);
  const {
    data,
    refetch: refetchBannerData,
    isFetched,
  } = useGetBanners(feature);
  const [bannersData, setBannersData] = useState([]);
  const [foodBanner, setFoodBanner] = useState();
  const [openModal, setOpenModal] = useState(false);
  const { configData } = useSelector((state) => state.configData);
  const dispatch = useDispatch();
  useEffect(() => {
    if (banners?.banners?.length === 0) {
      refetchBannerData();
    }
  }, [banners]);
  console.log({ data, bannersData });
  useEffect(() => {
    if (data) {
      dispatch(setBanners(data));
    }
  }, [data]);
  useEffect(() => {
    if (banners) {
      handleBannersData();
    }
  }, [banners]);

  const handleBannersData = () => {
    let mergedBannerData = [];

    if (getCurrentModuleType() === "food") {
      if (banners?.banners?.length > 0) {
        banners?.banners?.forEach((item) => mergedBannerData.push(item));
      }
      if (banners?.campaigns?.length > 0) {
        banners?.campaigns?.forEach((item) =>
          mergedBannerData.push({ ...item, isCampaign: true }),
        );
      }
      setBannersData(mergedBannerData);
    } else {
      if (banners?.banners?.length > 0) {
        banners?.banners?.forEach((item) => mergedBannerData.push({ ...item }));
      }
      setBannersData(mergedBannerData);
    }
  };
  const handleBannerClick = (banner) => {
    if (banner?.isCampaign) {
      router
        .push(
          {
            pathname: "/campaigns/[id]",
            query: { id: `${banner?.slug || banner?.id}` },
          },
          undefined,
          { scroll: false }, // Disable Next.js auto scroll
        )
        .then(() => {
          // Add slight delay to ensure new page is mounted
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }, 100); // delay helps after DOM updates
        });
    } else if (banner?.type === "default") {
      window.open(banner?.link, "_blank");
    } else {
      if (banner?.type === "store_wise") {
        handleStoreRedirect(banner?.store, router);
      } else {
        if (banner?.type === "item_wise") {
          if (selectedModule?.module_type !== "ecommerce") {
            setFoodBanner(banner?.item);
            setOpenModal(true);
          } else {
            handleProductRedirect(banner?.item, router);
          }
        }
      }
    }
  };
  const handleModalClose = () => {
    setOpenModal(false);
  };

  const getModuleWiseBanners = () => {
    switch (getCurrentModuleType()) {
      case ModuleTypes.GROCERY:
        if (bannersData.length === 1) {
          return 1;
        } else if (bannersData.length === 2) {
          return 2;
        } else {
          return 3.1;
        }
      case ModuleTypes.PHARMACY:
        if (bannersData.length === 1) {
          return 1;
        } else if (bannersData.length === 2) {
          return 2;
        } else {
          return 3.2;
        }
      case ModuleTypes.ECOMMERCE:
        if (bannersData.length === 1) {
          return 1;
        } else if (bannersData.length === 2) {
          return 2;
        } else {
          return 3.2;
        }
      case ModuleTypes.FOOD:
        if (bannersData.length === 1) {
          return 1;
        } else if (bannersData.length === 2) {
          return 2;
        } else {
          return 3.2;
        }
      case ModuleTypes.RIDE:
        if (bannersData.length === 1) {
          return 1;
        } else if (bannersData.length === 2) {
          return 2;
        } else {
          return 3.1;
        }
    }
  };

  const settings = {
    dots: true,
    infinite: false,
    slidesToShow: getModuleWiseBanners(),
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
  return (
    <>
      <CustomStackFullWidth
        sx={{
          mt: { xs: 0, sm: "10px" },
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
        {!isFetched ? (
          <Slider {...settings}>
            {[...Array(2)].map((_, index) => (
              <BannersWrapper key={index}>
                <Skeleton variant="rectangular" height="100%" width="100%" />
              </BannersWrapper>
            ))}
          </Slider>
        ) : (
          bannersData?.length > 0 && (
            <SliderCustom padding="0px">
              <Slider {...settings}>
                {bannersData.map((item, index) => (
                  <BannersWrapper
                    key={index}
                    onClick={
                      item?.type === "default" && item?.link === null
                        ? undefined
                        : () => handleBannerClick(item)
                    }
                    sx={{
                      cursor:
                        item?.type === "default" && item?.link === null
                          ? "default"
                          : "pointer",
                    }}
                  >
                    <NextImage
                      src={item?.image_full_url}
                      alt={item?.title}
                      height={isSmallScreen ? "160" : "150"}
                      width={300}
                      objectFit="cover"
                      borderRadius="16px"
                    />
                  </BannersWrapper>
                ))}
              </Slider>
            </SliderCustom>
          )
        )}
      </CustomStackFullWidth>

      {openModal && foodBanner && (
        <FoodDetailModal
          product={foodBanner}
          image={`${configData?.base_urls?.item_image_url}/${foodBanner?.image}`}
          open={openModal}
          handleModalClose={handleModalClose}
          setOpen={setOpenModal}
        />
      )}
    </>
  );
};

Banners.propTypes = {};

export default Banners;
