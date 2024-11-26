import { Skeleton, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useGetAdds } from "api-manage/hooks/react-query/useGetAds";
import SpecialOfferCardShimmer from "components/Shimmer/SpecialOfferCardSimmer";
import {
  NextFood,
  PrevFood,
} from "components/home/best-reviewed-items/SliderSettings";
import AdsCard from "components/home/paid-ads/AdsCard";
import Subtitle1 from "components/typographies/Subtitle1";
import { getModuleId } from "helper-functions/getModuleId";
import { t } from "i18next";
import { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import {
  CustomStackFullWidth,
  SliderCustom,
} from "styled-components/CustomStyles.style";

const PaidAds = () => {
  const theme = useTheme();
  const sliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeSlideData, setActiveSlideData] = useState(null);
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const { data, isLoading, refetch, isFetching } = useGetAdds();
  useEffect(() => {
    refetch();
  }, [getModuleId()]);

  const settings = {
    autoplay: true,
    infinite: data?.length > 3 && true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    prevArrow: <PrevFood />,
    nextArrow: <NextFood />,
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
    afterChange: (currentSlide) => {
      setCurrentSlide(currentSlide);
      const activeSlideIndex =
        sliderRef?.current?.innerSlider?.state?.currentSlide;
      const activeSlide = data[activeSlideIndex || 0];
      setActiveSlideData(activeSlide);
      if (activeSlide?.add_type === "video_promotion") {
        sliderRef?.current?.slickPause?.();
      } else {
      }
    },
    responsive: [
      {
        breakpoint: 2000,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: data?.length > 3 && true,
        },
      },
      {
        breakpoint: 1600,
        settings: {
          // autoplay: true,
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: data?.length > 3 && true,
        },
      },
      {
        breakpoint: 1340,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: data?.length > 3 && true,
        },
      },
      {
        breakpoint: 1075,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: data?.length > 3 && true,
        },
      },
      {
        breakpoint: 999,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 850,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 770,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 670,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 540,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 495,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 460,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 400,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 370,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
        },
      },
    ],
  };
  const SliderShouldPlay = () => {
    if (data && data.length > 0) {
      const firstSlide = data[0];
      const secondSlide = data[1];
      const thirdSlide = data[2];
      setActiveSlideData(firstSlide);
      if (firstSlide.add_type === "video_promotion") {
        sliderRef?.current?.slickPause?.();
        //setIsAutoPlay(false);
      } else if (
        secondSlide?.add_type === "video_promotion" &&
        firstSlide.add_type !== "video_promotion"
      ) {
        sliderRef?.current?.slickPause?.();
        sliderRef?.current?.slickNext?.();
        setActiveSlideData(secondSlide);
      } else if (
        thirdSlide?.add_type === "video_promotion" &&
        secondSlide.add_type !== "video_promotion"
      ) {
        sliderRef?.current?.slickPause?.();
        sliderRef?.current?.slickNext?.();
        setTimeout(() => {
          sliderRef?.current?.slickPause?.();
          sliderRef?.current?.slickNext?.();
          setActiveSlideData(thirdSlide);
        }, 500);
      }
    }
  };

  useEffect(() => {
    SliderShouldPlay();
  }, [data]);
  return (
    <>
      {!isFetching ? (
        <>
          {data?.length > 0 && (
            <Box
              sx={{
                backgroundImage: "url('/static/paidAdds.png')",
                marginTop: "10px",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                borderRadius: "10px",
              }}
            >
              <Box
                sx={{
                  background: `linear-gradient(0deg, rgba(255, 255, 255, 0.00) 0%, ${theme.palette.neutral[100]} 100%)`,
                  borderRadius: "inherit",
                }}
              >
                <Stack padding="20px 20px 0px 20px">
                  <Typography
                    fontSize={{ xs: "16px", md: "20px" }}
                    fontWeight={{ xs: "500", md: "700" }}
                    mb="5px"
                    component="h2"
                  >
                    {t("Highlights for you")}
                  </Typography>
                  <Subtitle1
                    textAlign="left"
                    text="See our most popular restaurant and foods"
                    component="p"
                  />
                </Stack>
                <CustomStackFullWidth>
                  <CustomStackFullWidth>
                    <SliderCustom padding={isSmall ? "5px" : "16px"}>
                      <Slider {...settings} ref={sliderRef}>
                        {data?.map((item, index) => (
                          <AdsCard
                            key={item?.id}
                            data={data}
                            activeSlideData={activeSlideData}
                            itemLength={data?.length}
                            item={item}
                            index={index}
                            sliderRef={sliderRef}
                          />
                        ))}
                      </Slider>
                    </SliderCustom>
                  </CustomStackFullWidth>
                </CustomStackFullWidth>
              </Box>
            </Box>
          )}
        </>
      ) : (
        <CustomStackFullWidth>
          <CustomStackFullWidth>
            <Stack spacing={2}>
              <Skeleton variant="rectangular" width="40%" height="20px" />
              <Skeleton variant="rectangular" width="10%" height="20px" />
              <SliderCustom gap="12px">
                <Slider {...settings}>
                  <SpecialOfferCardShimmer width="380px" />
                  <SpecialOfferCardShimmer width="380px" />
                  <SpecialOfferCardShimmer width="380px" />
                </Slider>
              </SliderCustom>
            </Stack>
          </CustomStackFullWidth>
        </CustomStackFullWidth>
      )}
    </>
  );
};

export default PaidAds;
