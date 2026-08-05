import {
  Box,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import NewProductCard from "components/cards/newCard/NewProductCard";
import SliderSectionHeader from "components/common/SliderSectionHeader";
import { HomeComponentsWrapper } from "components/home/HomePageComponents";
import { t } from "i18next";
import { useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";
import { useGetRecommendedServices } from "../../service-api-manage/hooks/react-query/recommended-services";

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

const RecommendedServices = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const slider = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data } = useGetRecommendedServices({ offset: 1, type: "all" });

  const items = data?.services ?? [];

  const enhancedSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 2.5,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1450,
        settings: { slidesToShow: 2.5, slidesToScroll: 1, infinite: false },
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2, slidesToScroll: 1, infinite: false },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1.5, slidesToScroll: 1, infinite: false },
      },
      {
        breakpoint: 450,
        settings: { slidesToShow: 1, slidesToScroll: 1, infinite: false },
      },
    ],
  };

  if (!items.length) return null;

  return (
    <SectionWrapper>
      <HomeComponentsWrapper sx={{ gap: "1rem" }}>
        <SliderSectionHeader
          sliderRef={slider}
          currentSlide={currentSlide}
          totalSlides={items.length}
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
              {t("Recommended Services Nearby")}
            </Typography>
          }
        />
        <SliderWrapper>
          <Slider
            {...enhancedSettings}
            ref={slider}
            afterChange={(idx) => setCurrentSlide(idx)}
          >
            {items.map((item) => (
              <div key={item.id}>
                <NewProductCard
                  max_width="100%"
                  variant="horizontal"
                  item={item}
                  horizontalStyle={{
                    border: "none",
                    "&:hover": { boxShadow: "none" },
                  }}
                />
              </div>
            ))}
          </Slider>
        </SliderWrapper>
      </HomeComponentsWrapper>
    </SectionWrapper>
  );
};

export default RecommendedServices;
