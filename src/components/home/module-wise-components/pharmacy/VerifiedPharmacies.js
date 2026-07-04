import { Box, Skeleton, Stack, styled, Typography } from "@mui/material";
import useGetSearchPageData from "api-manage/hooks/react-query/search/useGetSearchPageData";
import NewStoreCard from "components/cards/newCard/NewStoreCard";
import SliderSectionHeader from "components/common/SliderSectionHeader";
import NewStoreCardSkeleton from "components/Shimmer/NewStoreCardSkeleton";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";

const SliderWrapper = styled(CustomBoxFullWidth)(({ theme }) => ({
  "& .slick-track": { marginLeft: 0 },
  "& .slick-slide": { paddingRight: "20px" },
  "& .slick-slide > div > *": { width: "100% !important" },
  [theme.breakpoints.down("sm")]: {
    "& .slick-slide": { paddingRight: "12px" },
  },
}));

const VerifiedPharmacies = () => {
  const { t } = useTranslation();
  const slider = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data: storesData, isLoading } = useGetSearchPageData(
    // confirm by BE to use combined api
    {
      offset: 1,
      currentTab: 1,
      page_limit: 20,
      quick_action: "verified_seller",
    },
    () => {},
    true,
  );

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    swipeToSlide: true,
    arrows: false,
    responsive: [
      { breakpoint: 1450, settings: { slidesToShow: 4, slidesToScroll: 1 , swipeToSlide: true} },
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 1 , swipeToSlide: true} },
      { breakpoint: 760, settings: { slidesToShow: 2, slidesToScroll: 1 , swipeToSlide: true} },
      { breakpoint: 480, settings: { slidesToShow: 1.4, slidesToScroll: 1 , swipeToSlide: true} },
      { breakpoint: 340, settings: { slidesToShow: 1.2, slidesToScroll: 1 , swipeToSlide: true} },
    ],
  };

  const stores = storesData?.pages?.[0]?.stores ?? [];

  if (!isLoading && !stores.length) return null;

  return (
    <Stack gap="16px">
      <SliderSectionHeader
        sliderRef={slider}
        currentSlide={currentSlide}
        totalSlides={stores.length}
        slidesToShow={4}
        heading={
          isLoading ? (
            <Box>
              <Skeleton width={200} height={32} />
              <Skeleton width={180} height={18} />
            </Box>
          ) : (
            <Box>
              <Typography
                sx={{
                  fontSize: { xs: "18px", md: "24px" },
                  fontWeight: 700,
                  color: "neutral.1050",
                  lineHeight: 1.1,
                  letterSpacing: "-1.2px",
                }}
              >
                {t("Verified Pharmacies")}
              </Typography>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "neutral.500",
                  lineHeight: 1.3,
                  mt: "4px",
                }}
              >
                {t("Trust & secure buying experience.")}
              </Typography>
            </Box>
          )
        }
      />

      <SliderWrapper>
        <Slider
          {...sliderSettings}
          ref={slider}
          afterChange={(idx) => setCurrentSlide(idx)}
        >
          {isLoading
            ? [...Array(4)].map((_, i) => (
                <NewStoreCardSkeleton key={i} />
              ))
            : stores.map((item, index) => (
                <NewStoreCard
                  key={index}
                  variant="normal"
                  item={item}
                  imageUrl={item?.cover_photo_full_url}
                />
              ))}
        </Slider>
      </SliderWrapper>
    </Stack>
  );
};

export default VerifiedPharmacies;
