import {
  Box,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import useGetPopularItemsNearby from "api-manage/hooks/react-query/useGetPopularItemsNearby";
import NewProductCard from "components/cards/newCard/NewProductCard";
import SliderSectionHeader from "components/common/SliderSectionHeader";
import { HomeComponentsWrapper } from "components/home/HomePageComponents";
import { t } from "i18next";
import { useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";

// ─── Styled ────────────────────────────────────────────────────────────────

const SectionWrapper = styled(Box)({
  width: "100%",
});

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
  [theme.breakpoints.down("sm")]: {
    "& .slick-slide": { paddingRight: "12px" },
  },
}));

// ─── Main ──────────────────────────────────────────────────────────────────

const TrendingDishes = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const slider = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // same hooks will call for getting popular items result
  const { data } = useGetPopularItemsNearby({ offset: 1, type: "all" });
  const dishes = data?.products ?? [];

  const enhancedSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    swipeToSlide: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1450,
        settings: { slidesToShow: 3, slidesToScroll: 1, infinite: false , swipeToSlide: true},
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2, slidesToScroll: 1, infinite: false , swipeToSlide: true},
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1, slidesToScroll: 1, infinite: false , swipeToSlide: true},
      },
      {
        breakpoint: 450,
        settings: { slidesToShow: 1.3, slidesToScroll: 1, infinite: false , swipeToSlide: true},
      },
      {
        breakpoint: 320,
        settings: { slidesToShow: 1, slidesToScroll: 1, infinite: false , swipeToSlide: true},
      },
    ],
  };

  if (!dishes.length) return null;

  return (
    <SectionWrapper>
      <HomeComponentsWrapper sx={{ gap: "1rem" }}>
        <SliderSectionHeader
          sliderRef={slider}
          currentSlide={currentSlide}
          totalSlides={dishes.length}
          slidesToShow={3}
          sx={{ mb: "1rem" }}
          heading={
            <Typography
              sx={{
                fontSize: { xs: "18px", md: "24px" },
                fontWeight: 700,
                color: "neutral.1050",
                lineHeight: 1.1,
                letterSpacing: "-1.2px",
              }}
            >
              {t("Trending Dishes")}
            </Typography>
          }
        />
        <SliderWrapper>
          <Slider
            {...enhancedSettings}
            ref={slider}
            afterChange={(idx) => setCurrentSlide(idx)}
          >
            {dishes.map((item) => (
              <div key={item.id}>
                <NewProductCard
                  max_width={isMobile ? "300px" : undefined}
                  variant="horizontal"
                  item={item}
                />
              </div>
            ))}
          </Slider>
        </SliderWrapper>
      </HomeComponentsWrapper>
    </SectionWrapper>
  );
};

export default TrendingDishes;
