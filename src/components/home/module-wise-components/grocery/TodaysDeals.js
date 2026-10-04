import {
  Box,
  IconButton,
  Skeleton,
  Stack,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import useGetDiscountedItems from "api-manage/hooks/react-query/product-details/useGetDiscountedItems";
import NewProductCard from "components/cards/newCard/NewProductCard";
import ProductCardSimmer from "components/Shimmer/ProductCardSimmer";
import SliderSectionHeader from "components/common/SliderSectionHeader";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";
import useGetPopularItemsNearby from "api-manage/hooks/react-query/useGetPopularItemsNearby";

const Container = styled(Box)(({ theme }) => ({
  width: "100%",
  backgroundColor: theme.palette.warning.lighter,
  borderRadius: "16px",
  paddingTop: "24px",
  paddingBottom: "24px",
  overflow: "hidden",
  boxShadow: "0px 1px 4px 0px rgba(0,0,0,0.05)",
  [theme.breakpoints.down("sm")]: {
    paddingTop: "16px",
    paddingBottom: "16px",
  },
}));

const SliderWrapper = styled(CustomBoxFullWidth)(({ theme }) => ({
  paddingLeft: "24px",
  [theme.breakpoints.down("sm")]: {
    paddingLeft: "16px",
  },
  "& .slick-track": { marginLeft: 0 },
  "& .slick-slide": { paddingRight: "20px" },
  "& .slick-slide:first-child": { paddingLeft: 0 },
}));

const TodaysDeals = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const slider = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { data, isFetched } = useGetPopularItemsNearby({
    offset: 1,
    type: "all",
  });
  const products = data?.products ?? [];

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5.2,
    slidesToScroll: 1,
    swipeToSlide: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1450,
        settings: { slidesToShow: 5.2, slidesToScroll: 1, infinite: false , swipeToSlide: true},
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: 4, slidesToScroll: 1, infinite: false , swipeToSlide: true},
      },
      {
        breakpoint: 760,
        settings: { slidesToShow: 3, slidesToScroll: 2, infinite: false , swipeToSlide: true},
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 2, slidesToScroll: 1, infinite: false , swipeToSlide: true},
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 2.3, slidesToScroll: 1, infinite: false , swipeToSlide: true},
      },
      {
        breakpoint: 400,
        settings: { slidesToShow: 2, slidesToScroll: 1, infinite: false , swipeToSlide: true},
      },

      {
        breakpoint: 360,
        settings: { slidesToShow: 1.8, slidesToScroll: 1, infinite: false , swipeToSlide: true},
      },
      {
        breakpoint: 340,
        settings: { slidesToShow: 1.7, slidesToScroll: 1, infinite: false , swipeToSlide: true},
      },
    ],
  };

  if (isFetched && !products.length) return null;

  return (
    <Container>
      <Stack gap="24px">
        <Box px={{ xs: "16px", sm: "24px" }}>
          <SliderSectionHeader
            sliderRef={slider}
            currentSlide={currentSlide}
            totalSlides={products.length}
            slidesToShow={5}
            heading={
              !isFetched ? (
                <Box>
                  <Skeleton variant="text" width="160px" height="32px" />
                  <Skeleton variant="text" width="220px" height="20px" />
                </Box>
              ) : (
                <Box>
                  <Typography
                    sx={{
                      fontSize: { xs: "20px", sm: "24px" },
                      fontWeight: 700,
                      color: "warning.secondary",
                      lineHeight: 1.1,
                      letterSpacing: "-1.2px",
                    }}
                  >
                    {t("Todays Deals")}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: 400,
                      color: "warning.secondary",
                      lineHeight: 1.3,
                    }}
                  >
                    {t("Grab The Offer Before End The Time.")}
                  </Typography>
                </Box>
              )
            }
          />
        </Box>

        <SliderWrapper>
          <Slider
            {...sliderSettings}
            ref={slider}
            afterChange={(idx) => setCurrentSlide(idx)}
          >
            {!isFetched
              ? [...Array(5)].map((_, i) => <ProductCardSimmer key={i} />)
              : products.map((item) => (
                  <div key={item?.id}>
                    <NewProductCard
                      variant="vertical"
                      item={item}
                      cardWidth={{ xs: "150px", md: "170px" }}
                    />
                  </div>
                ))}
          </Slider>
        </SliderWrapper>
      </Stack>
    </Container>
  );
};

export default TodaysDeals;
