import { useRef, useState } from "react";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import { Skeleton, Typography, styled } from "@mui/material";
import { t } from "i18next";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import NewStoreCardSkeleton from "components/Shimmer/NewStoreCardSkeleton";
import { HomeComponentsWrapper } from "components/home/HomePageComponents";
import SliderSectionHeader from "components/common/SliderSectionHeader";
import NewStoreCard from "components/cards/newCard/NewStoreCard";
import useGetTopOffers from "api-manage/hooks/react-query/product-details/useGetTopOffers";

const SliderWrapper = styled(CustomBoxFullWidth)(({ theme }) => ({
  "& .slick-track": {
    marginLeft: 0,
    marginRight: "auto",
  },
  "& .slick-slide": {
    paddingRight: "20px",
  },
  "& .slick-slide:first-child": {
    paddingLeft: 0,
  },
  "& .slick-slide > div > *": {
    width: "100% !important",
  },
  [theme.breakpoints.down("sm")]: {
    "& .slick-slide": { paddingRight: "12px" },
  },
}));

const TopOffersNearMe = ({ title }) => {
  const slider = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { data, isLoading: popularIsLoading } = useGetTopOffers("", "", "");

  const enhancedSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    swipeToSlide: true,
    arrows: false,
    responsive: [
      { breakpoint: 1450, settings: { slidesToShow: 4, slidesToScroll: 1, infinite: false , swipeToSlide: true} },
      { breakpoint: 1024, settings: { slidesToShow: 4, slidesToScroll: 1, infinite: false , swipeToSlide: true} },
      { breakpoint: 760,  settings: { slidesToShow: 3, slidesToScroll: 2, infinite: false , swipeToSlide: true} },
      { breakpoint: 695,  settings: { slidesToShow: 2, slidesToScroll: 2, initialSlide: 2, infinite: false , swipeToSlide: true} },
      { breakpoint: 600,  settings: { slidesToShow: 2, slidesToScroll: 2, initialSlide: 2, infinite: false , swipeToSlide: true} },
      { breakpoint: 480,  settings: { slidesToShow: 1.4, slidesToScroll: 1, initialSlide: 1, infinite: false , swipeToSlide: true} },
      { breakpoint: 340,  settings: { slidesToShow: 1.2, slidesToScroll: 1, initialSlide: 1, infinite: false , swipeToSlide: true} },
    ],
  };

  const stores = data?.stores ?? [];

  if (!popularIsLoading && !stores.length) return null;

  return (
    <HomeComponentsWrapper sx={{ gap: "1rem" }}>
      <SliderSectionHeader
        sliderRef={slider}
        currentSlide={currentSlide}
        totalSlides={stores.length}
        slidesToShow={4}
        sx={{ mb: "1rem" }}
        heading={
          popularIsLoading ? (
            <Skeleton variant="text" width="160px" />
          ) : (
            <Typography sx={{ fontSize: { xs: "18px", md: "24px" }, fontWeight: 700, color: "neutral.1050", lineHeight: 1.1, letterSpacing: "-1.2px" }}>
              {title ? t(title) : t("Top Picks Near You")}
            </Typography>
          )
        }
      />
      <SliderWrapper>
        <Slider {...enhancedSettings} ref={slider} afterChange={(idx) => setCurrentSlide(idx)}>
          {popularIsLoading
            ? [...Array(4)].map((_, i) => <NewStoreCardSkeleton key={i} />)
            : stores.map((item, index) => (
                <NewStoreCard key={index} variant="normal" item={item} imageUrl={item?.cover_photo_full_url} />
              ))}
        </Slider>
      </SliderWrapper>
    </HomeComponentsWrapper>
  );
};

export default TopOffersNearMe;
