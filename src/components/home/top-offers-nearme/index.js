/* eslint-disable react-hooks/exhaustive-deps */
import { alpha, Button, Skeleton, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Slider from "react-slick";
import { getLanguage } from "helper-functions/getLanguage";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
  SliderCustom,
} from "styled-components/CustomStyles.style";
import { RTL } from "../../rtl";
import SpecialOfferCardShimmer from "../../Shimmer/SpecialOfferCardSimmer";
import H2 from "../../typographies/H2";
import { NextFood, PrevFood } from "../best-reviewed-items/SliderSettings";
import { HomeComponentsWrapper } from "../HomePageComponents";
import CustomContainer from "components/container";
import useGetTopOffers from "api-manage/hooks/react-query/product-details/useGetTopOffers";
import CustomImageContainer from "components/CustomImageContainer";
import fire_image from "../../../assets/fire.svg";
import StoreCard from "components/cards/StoreCard";
import Link from "next/link";

const TopOffersNearMe = ({ title }) => {
  const { t } = useTranslation();

  const { data, refetch, isLoading, isFetching } = useGetTopOffers();

  const [isHover, setIsHover] = useState(false);
  const lanDirection = getLanguage() ? getLanguage() : "ltr";
  useEffect(() => {
    refetch();
  }, []);
  const settings = {
    dots: false,
    infinite: data?.stores?.length > 3 ? true : false,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0, // Ensure it always starts from the first slide
    autoplay: true,
    speed: 800,
    autoplaySpeed: 4000,
    variableHeight: true,
    prevArrow: isHover && <PrevFood displayNoneOnMobile />,
    nextArrow: isHover && <NextFood displayNoneOnMobile />,
    responsive: [
      {
        breakpoint: 2000,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: data?.stores?.length > 4 ? true : false,
        },
      },
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: data?.stores?.length > 4 ? true : false,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: data?.stores?.length > 4 ? true : false,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3.5,
          infinite: data?.stores?.length > 3 ? true : false,
        },
      },
      {
        breakpoint: 821,
        settings: {
          slidesToShow: 3.2,
          infinite: data?.stores?.length > 3 ? true : false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          infinite: data?.stores?.length > 3 ? true : false,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          infinite: data?.stores?.length > 2 ? true : false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          infinite: data?.stores?.length > 1 ? true : false,
        },
      },
      {
        breakpoint: 360, // Add a new breakpoint for smaller devices
        settings: {
          slidesToShow: 1,
          infinite: data?.stores?.length > 1 ? true : false,
        },
      },
    ],
  };

  return (
    <>
      {data?.stores?.length > 0 && (
        <HomeComponentsWrapper
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          sx={{
            cursor: "pointer",
            ".slick-slide": {
              padding: "0 5px",
            },
          }}
        >
          <CustomStackFullWidth
            alignItems="center"
            justyfyContent="center"
            sx={{
              paddingTop: { xs: "0px", sm: "20px" },
              borderRadius: "10px",
              backgroundColor: (theme) =>
                alpha(theme.palette.primary.main, 0.1),
            }}
            mb="10px"
            spacing={1}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
          >
            <CustomContainer>
              <CustomStackFullWidth
                alignItems="center"
                justifyContent="space-between"
                direction="row"
                marginTop={{ xs: "10px" }}
              >
                {isFetching ? (
                  <Skeleton variant="text" width="110px" />
                ) : (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CustomImageContainer
                      src={fire_image.src}
                      width="26px"
                      height="26px"
                    />
                    <H2 text={title ? title : t("Special Offer")} />
                  </Stack>
                )}
                {isFetching ? (
                  <Skeleton width="100px" variant="80px" />
                ) : (
                  <Link
                    href={{
                      pathname: "/store/top-offer-nearby",
                    }}
                  >
                    <Button
                      sx={{
                        transition: "all ease 0.5s",
                        textTransform: "capitalize",
                        "&:hover": {
                          letterSpacing: "0.03em",
                        },
                        padding: { xs: "0px 0px", md: "9px 16px" },
                      }}
                    >
                      {t("See all")}
                    </Button>
                  </Link>
                )}
              </CustomStackFullWidth>
            </CustomContainer>
            <RTL direction={lanDirection}>
              <CustomBoxFullWidth
                sx={{
                  padding: {
                    xs: "10px 10px 10px 10px",
                    md: "5px 20px 20px 20px",
                  },
                }}
              >
                <>
                  {isFetching ? (
                    <Slider {...settings}>
                      {[...Array(5)].map((item, index) => {
                        return <SpecialOfferCardShimmer key={index} />;
                      })}
                    </Slider>
                  ) : (
                    <SliderCustom>
                      <Slider {...settings}>
                        {data?.stores?.map((item, index) => {
                          return (
                            <StoreCard
                              key={index}
                              item={item}
                              specialCard="true"
                              topoffer
                              imageUrl={item?.cover_photo_full_url}
                            />
                          );
                        })}
                      </Slider>
                    </SliderCustom>
                  )}
                </>
              </CustomBoxFullWidth>
            </RTL>
          </CustomStackFullWidth>
        </HomeComponentsWrapper>
      )}
    </>
  );
};

export default TopOffersNearMe;
