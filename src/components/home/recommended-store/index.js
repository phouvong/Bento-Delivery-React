import { useRef, useState } from "react";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import H2 from "../../typographies/H2";
import { Skeleton, styled } from "@mui/material";
import { t } from "i18next";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import SpecialOfferCardShimmer from "../../Shimmer/SpecialOfferCardSimmer";
import { HomeComponentsWrapper } from "../HomePageComponents";
import { createEnhancedArrows } from "../../common/EnhancedSliderArrows";
import StoreCard from "components/cards/StoreCard";
import {useGetRecommendStores} from "api-manage/hooks/react-query/store/useGetRecommendStores";



const SliderWrapper = styled(CustomBoxFullWidth)(({ theme }) => ({
  "& .slick-slide": {
    padding: "0 10px", // Set the desired padding value
  },
  [theme.breakpoints.down("sm")]: {
    "& .slick-slide": {
      padding: "0px", // Set the desired padding value
    },
  },
}));

const RecommendedStore = () => {
  const slider = useRef(null);
  const [isSliderHovered, setIsSliderHovered] = useState(false);
  const {
    data: popularData,
    isLoading:popularIsLoading ,
  } = useGetRecommendStores();

  // Enhanced slider settings
  const enhancedSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    ...createEnhancedArrows(isSliderHovered, { 
      displayNoneOnMobile: true,
      variant: "primary"
    }),
    responsive: [
      {
        breakpoint: 1450,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: false,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: false,
        },
      },
      {
        breakpoint: 760,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: false,
        },
      },
      {
        breakpoint: 695,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
          infinite: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
          infinite: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1.4,
          slidesToScroll: 1,
          initialSlide: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 340,
        settings: {
          slidesToShow: 1.2,
          slidesToScroll: 1,
          initialSlide: 1,
          infinite: true,
        },
      },
    ],
  };
  
  const sliderItems = (
    <SliderWrapper
      sx={{
        "& .slick-slide": {
          paddingRight: { xs: "10px", sm: "20px" },
          paddingY: "10px",
        },
      }}
      onMouseEnter={() => setIsSliderHovered(true)}
      onMouseLeave={() => setIsSliderHovered(false)}
    >
      {popularIsLoading ? (
        <Slider {...enhancedSettings}>
          {[...Array(6)].map((_, index) => {
            return <SpecialOfferCardShimmer key={index} width={290} />;
          })}
        </Slider>
      ) : (
        <>
          { popularData?.stores?.length>0 &&  (
            <Slider {...enhancedSettings} ref={slider}>
              {popularData?.stores?.map((item, index) => {
                return (
                  <StoreCard
                    key={index}
                    imageUrl={item?.cover_photo_full_url}
                    item={item}
                  />
                );
              })}
            </Slider>
          )}
        </>
      )}
    </SliderWrapper>
  );

  const getLayout = () => {
    return (

          <>
            <CustomStackFullWidth
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              {popularIsLoading ? (
                <Skeleton variant="text" width="110px" />
              ) : (
                <H2 text={t("Recommended Store")} component="h2" />
              )}
            </CustomStackFullWidth>
            {sliderItems}

          </>

    );
  };

  return (
    <HomeComponentsWrapper sx={{ paddingTop: "5px", gap: "1rem" }}>
      {getLayout()}
    </HomeComponentsWrapper>
  );
};

export default RecommendedStore

