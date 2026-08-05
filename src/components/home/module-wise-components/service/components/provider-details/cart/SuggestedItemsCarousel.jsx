import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";

import SuggestedItemCard from "./SuggestedItemCard";

const SuggestedItemsCarousel = ({ suggestedItems }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  if (!suggestedItems?.length) return null;

  const sliderSettings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 400,
    slidesToShow: Math.min(2.2, suggestedItems.length),
    slidesToScroll: 1,
    swipeToSlide: true,
  };

  return (
    <Box
      sx={{
        mt: 2,
        p: 1.5,
        borderRadius: "14px",
        backgroundColor:
          theme.palette.background.secondary || theme.palette.neutral?.[300],
        "& .slick-list": { mx: -0.5 },
        "& .slick-slide > div": { px: 0.5 },
      }}
    >
      <Typography
        sx={{
          mb: 1.25,
          fontSize: "14px",
          fontWeight: 700,
          color: theme.palette.text.primary,
        }}
      >
        {t("Also Booked Together")}
      </Typography>
      <Slider {...sliderSettings}>
        {suggestedItems.map((rel) => (
          <Box key={rel?.id}>
            <SuggestedItemCard item={rel} />
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default SuggestedItemsCarousel;
