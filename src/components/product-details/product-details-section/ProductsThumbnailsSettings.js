import React from "react";
import {
  LeftArrowStyle,
  RightArrowStyle,
} from "../../home/best-reviewed-items/brt.style";
import { IconButton, styled } from "@mui/material";

export const RoundedIconButton = styled(IconButton)(({ theme }) => ({
  width: 32,
  height: 32,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.background.paper,
  boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
  color: theme.palette.text.primary,
  ":hover": {
    backgroundColor: theme.palette.background.paper,
    boxShadow: "0 3px 8px rgba(0,0,0,0.18)",
  },
}));

const PrevArrow = ({ onClick, className }) => {
  const language_direction = JSON.parse(localStorage.getItem("settings"));

  return (
    <LeftArrowStyle
      language_direction={language_direction?.direction}
      onClick={onClick}
      sx={{ display: className?.includes("slick-disabled") && "none" }}
    >
      <RoundedIconButton>
        <i
          className="fi fi-rs-angle-small-left"
          style={{ fontSize: "16px", display: "flex", lineHeight: 1 }}
        />
      </RoundedIconButton>
    </LeftArrowStyle>
  );
};

const NextArrow = ({ onClick, className }) => {
  const language_direction = JSON.parse(localStorage.getItem("settings"));
  return (
    <RightArrowStyle
      language_direction={language_direction?.direction}
      onClick={onClick}
      right="0px"
      sx={{
        display: className?.includes("slick-disabled") && "none",
      }}
    >
      <RoundedIconButton>
        <i
          className="fi fi-rs-angle-small-right"
          style={{ fontSize: "16px", display: "flex", lineHeight: 1 }}
        />
      </RoundedIconButton>
    </RightArrowStyle>
  );
};

export const ProductsThumbnailsSettings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 1,
  prevArrow: <PrevArrow />,
  nextArrow: <NextArrow />,

  responsive: [
    {
      breakpoint: 400,
      settings: { slidesToShow: 5 },
    },
    {
      breakpoint: 600,
      settings: { slidesToShow: 6 },
    },
    {
      breakpoint: 900,
      settings: { slidesToShow: 7 },
    },
    {
      breakpoint: 1200,
      settings: { slidesToShow: 5 },
    },
  ],
};
