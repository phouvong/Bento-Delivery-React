import { Box, Skeleton, Stack, styled, Typography } from "@mui/material";
import NewProductCard from "components/cards/newCard/NewProductCard";
import ProductCardSimmer from "components/Shimmer/ProductCardSimmer";
import SliderSectionHeader from "components/common/SliderSectionHeader";
import useGetMostReviewed from "api-manage/hooks/react-query/useGetMostReviewed";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";
import { styled as muiStyled } from "@mui/material/styles";

const SliderWrapper = muiStyled(CustomBoxFullWidth)(() => ({
  "& .slick-track": { marginLeft: 0 },
  "& .slick-slide": { paddingRight: "20px" },
}));

const SelfCareOTCSection = () => {
  const { t } = useTranslation();
  const slider = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data, refetch, isLoading } = useGetMostReviewed({ type: "all" });

  useEffect(() => {
    refetch();
  }, []);

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5.2,
    slidesToScroll: 1,
    swipeToSlide: true,
    arrows: false,
    responsive: [
      { breakpoint: 1450, settings: { slidesToShow: 5.2, slidesToScroll: 1 , swipeToSlide: true} },
      { breakpoint: 1024, settings: { slidesToShow: 4, slidesToScroll: 1 , swipeToSlide: true} },
      { breakpoint: 760, settings: { slidesToShow: 3, slidesToScroll: 2 , swipeToSlide: true} },
      { breakpoint: 480, settings: { slidesToShow: 2.4, slidesToScroll: 1 , swipeToSlide: true} },
      { breakpoint: 400, settings: { slidesToShow: 2.1, slidesToScroll: 1 , swipeToSlide: true} },
      { breakpoint: 340, settings: { slidesToShow: 1.7, slidesToScroll: 1 , swipeToSlide: true} },
    ],
  };

  const products = data?.products ?? [];

  if (!isLoading && !products.length) return null;

  return (
    <Stack gap="16px">
      <SliderSectionHeader
        sliderRef={slider}
        currentSlide={currentSlide}
        totalSlides={products.length}
        slidesToShow={5}
        heading={
          isLoading ? (
            <Box>
              <Skeleton width={240} height={32} />
              <Skeleton width={160} height={18} />
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
                {t("Self-Care Medicines")}
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
            ? [...Array(5)].map((_, i) => <ProductCardSimmer key={i} />)
            : products.map((item) => (
                <div key={item?.id}>
                  <NewProductCard
                    variant="vertical"
                    item={item}
                    isPharmacy
                    cardWidth={{ xs: "150px", md: "170px" }}
                  />
                </div>
              ))}
        </Slider>
      </SliderWrapper>
    </Stack>
  );
};

export default SelfCareOTCSection;
