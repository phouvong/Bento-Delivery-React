import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import React, { useState } from "react";
import { ButtonLeft, ButtonRight } from "./index";
import { alpha, styled, useMediaQuery, useTheme, keyframes } from "@mui/material";
import { Box } from "@mui/system";
import { getLanguage } from "../../../helper-functions/getLanguage";
import PrevIcon from "../../icons/PrevIcon";
import NextIcon from "../../icons/NextIcon";
import { getCurrentModuleType } from "../../../helper-functions/getCurrentModuleType";
import Slider from "react-slick";
import FeaturedItemCard from "./card";
import PharmacyCategoryCard from "../../cards/PharmacyCategoryCard";
import { WhiteNext, WhitePrev } from "../visit-again/SliderSettings";
import { ModuleTypes } from "../../../helper-functions/moduleTypes";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

// Animation keyframes for arrow movement
const slideLeft = keyframes`
  0% { transform: translateX(0px); }
  100% { transform: translateX(-3px); }
`;

const slideRight = keyframes`
  0% { transform: translateX(0px); }
  100% { transform: translateX(3px); }
`;

const ButtonContainer = styled(Box)(({ theme, right, isdisabled, ishovered }) => ({
  top: 0,
  height: "100%",
  width: "73px",
  background:
    right === "true"
      ? theme.direction === "ltr"
        ? `linear-gradient(270deg, ${theme.palette.neutral[100]} 0%, rgba(255, 255, 255, 0) 100%)`
        : `linear-gradient(270deg,  rgba(255, 255, 255, 0) 0%, ${theme.palette.neutral[100]} 100%)`
      : theme.direction === "ltr"
      ? `linear-gradient(to right, ${theme.palette.neutral[100]} 0%, rgba(255, 255, 255, 0) 100%)`
      : `linear-gradient(to left, rgba(255, 255, 255, 0) 0%, ${theme.palette.neutral[100]} 100%)`,

  zIndex: 1,
  right: right === "true" && 0,
  left: right !== "true" && 0,
  position: "absolute",
  alignItems: "center",
  justifyContent: "center",
  display: isdisabled ? "none" : "flex",
  opacity: ishovered ? 1 : 0,
  transition: "opacity 0.3s ease-in-out",
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));
const PrevWrapper = styled(Box)(({ theme, isdisabled, isarrowhovered }) => ({
  zIndex: 1,
  top: "40%",
  left: 0,
  display: isdisabled ? "none" : "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  backgroundColor: isarrowhovered ? theme.palette.primary.main : theme.palette.neutral[100],
  cursor: "pointer",
  transition: "all 0.3s ease",
  animation: isarrowhovered ? "none" : `${slideLeft} 0.8s ease-in-out infinite alternate`,
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
    transform: "scale(1.05)",
  },
}));

const NextWrapper = styled(Box)(({ theme, isdisabled, isarrowhovered }) => ({
  top: "40%",
  zIndex: 1,
  right: 8,
  display: isdisabled ? "none" : "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  backgroundColor: isarrowhovered ? theme.palette.primary.main : theme.palette.neutral[100],
  cursor: "pointer",
  transition: "all 0.3s ease",
  animation: isarrowhovered ? "none" : `${slideRight} 0.8s ease-in-out infinite alternate`,
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
    transform: "scale(1.05)",
  },
}));
const Next = ({ onClick, className, displayNoneOnMobile, isHovered }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const displayNone = isSmall ? (displayNoneOnMobile ? true : false) : false;
  const [isArrowHovered, setIsArrowHovered] = useState(false);

  return (
    <ButtonContainer
      isdisabled={displayNone || className?.includes("slick-disabled")}
      right="true"
      ishovered={isHovered}
    >
      <NextWrapper
        className={`client-nav client-next ${className}`}
        onClick={onClick}
        isdisabled={className?.includes("slick-disabled")}
        isarrowhovered={isArrowHovered}
        onMouseEnter={() => setIsArrowHovered(true)}
        onMouseLeave={() => setIsArrowHovered(false)}
      >
        {getLanguage() === "rtl" ? (
          <ChevronLeftIcon
            sx={{
              fontSize: "24px",
              color: isArrowHovered ? "white" : theme.palette.neutral[600],
              transition: "color 0.3s ease",
            }}
          />
        ) : (
          <ChevronRightIcon
            sx={{
              fontSize: "24px",
              color: isArrowHovered ? "white" : theme.palette.neutral[600],
              transition: "color 0.3s ease",
            }}
          />
        )}
      </NextWrapper>
    </ButtonContainer>
  );
};

const Prev = ({ onClick, className, displayNoneOnMobile, isHovered }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const displayNone = isSmall ? (displayNoneOnMobile ? true : false) : false;
  const [isArrowHovered, setIsArrowHovered] = useState(false);

  return (
    <ButtonContainer
      isdisabled={displayNone || className?.includes("slick-disabled")}
      ishovered={isHovered}
    >
      <PrevWrapper
        className={`client-nav client-prev ${className}`}
        onClick={onClick}
        isdisabled={className?.includes("slick-disabled")}
        isarrowhovered={isArrowHovered}
        onMouseEnter={() => setIsArrowHovered(true)}
        onMouseLeave={() => setIsArrowHovered(false)}
      >
        {getLanguage() === "rtl" ? (
          <ChevronRightIcon
            sx={{
              fontSize: "24px",
              color: isArrowHovered ? "white" : theme.palette.neutral[600],
              transition: "color 0.3s ease",
            }}
          />
        ) : (
          <ChevronLeftIcon
            sx={{
              fontSize: "24px",
              color: isArrowHovered ? "white" : theme.palette.neutral[600],
              transition: "color 0.3s ease",
            }}
          />
        )}
      </PrevWrapper>
    </ButtonContainer>
  );
};

// Enhanced White Arrow Components with hover effects
const EnhancedWhiteButtonContainer = styled(Box)(({ theme, right, isdisabled, ishovered }) => ({
  top: 0,
  height: "100%",
  width: "73px",
  background: "inherit",
  zIndex: 1,
  right: right === "true" && 0,
  left: right !== "true" && 0,
  position: "absolute",
  alignItems: "center",
  justifyContent: "center",
  display: isdisabled ? "none" : "flex",
  opacity: ishovered ? 1 : 0,
  transition: "opacity 0.3s ease-in-out",
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

const EnhancedWhitePrevWrapper = styled(Box)(({ theme, isdisabled, isarrowhovered, width, height }) => ({
  zIndex: 1,
  top: "50%",
  left: "0px",
  display: isdisabled ? "none" : "flex",
  backgroundColor: isarrowhovered ? theme.palette.primary.main : theme.palette.neutral[100],
  borderRadius: "50%",
  height: height ? height : "38px",
  width: width ? width : "38px",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "all 0.3s ease",
  animation: isarrowhovered ? "none" : `${slideLeft} 0.8s ease-in-out infinite alternate`,
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
    transform: "scale(1.05)",
  },
}));

const EnhancedWhiteNextWrapper = styled(Box)(({ theme, isdisabled, isarrowhovered, width, height }) => ({
  zIndex: 1,
  right: 0,
  display: isdisabled ? "none" : "flex",
  backgroundColor: isarrowhovered ? theme.palette.primary.main : theme.palette.neutral[100],
  borderRadius: "50%",
  height: height ? height : "38px",
  width: width ? width : "38px",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "all 0.3s ease",
  animation: isarrowhovered ? "none" : `${slideRight} 0.8s ease-in-out infinite alternate`,
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
    transform: "scale(1.05)",
  },
}));

const EnhancedWhiteNext = ({ onClick, className, displayNoneOnMobile, width, height, isHovered }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const displayNone = isSmall ? (displayNoneOnMobile ? true : false) : false;
  const [isArrowHovered, setIsArrowHovered] = useState(false);

  return (
    <EnhancedWhiteButtonContainer
      isdisabled={displayNone || className?.includes("slick-disabled")}
      right="true"
      ishovered={isHovered}
    >
      <EnhancedWhiteNextWrapper
        width={width}
        height={height}
        className={`client-nav client-next ${className}`}
        onClick={onClick}
        isdisabled={className?.includes("slick-disabled")}
        isarrowhovered={isArrowHovered}
        onMouseEnter={() => setIsArrowHovered(true)}
        onMouseLeave={() => setIsArrowHovered(false)}
      >
        {getLanguage() === "rtl" ? (
          <ChevronLeftIcon
            sx={{
              fontSize: "30px",
              color: isArrowHovered ? "white" : theme.palette.neutral[600],
              transition: "color 0.3s ease",
            }}
          />
        ) : (
          <ChevronRightIcon
            sx={{
              fontSize: "30px",
              color: isArrowHovered ? "white" : theme.palette.neutral[600],
              transition: "color 0.3s ease",
            }}
          />
        )}
      </EnhancedWhiteNextWrapper>
    </EnhancedWhiteButtonContainer>
  );
};

const EnhancedWhitePrev = ({ onClick, className, displayNoneOnMobile, width, height, isHovered }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const displayNone = isSmall ? (displayNoneOnMobile ? true : false) : false;
  const [isArrowHovered, setIsArrowHovered] = useState(false);

  return (
    <EnhancedWhiteButtonContainer
      isdisabled={displayNone || className?.includes("slick-disabled")}
      ishovered={isHovered}
    >
      <EnhancedWhitePrevWrapper
        width={width}
        height={height}
        className={`client-nav client-prev ${className}`}
        onClick={onClick}
        isdisabled={className?.includes("slick-disabled")}
        isarrowhovered={isArrowHovered}
        onMouseEnter={() => setIsArrowHovered(true)}
        onMouseLeave={() => setIsArrowHovered(false)}
      >
        {getLanguage() === "rtl" ? (
          <ChevronRightIcon
            sx={{
              fontSize: "30px",
              color: isArrowHovered ? "white" : theme.palette.neutral[600],
              transition: "color 0.3s ease",
            }}
          />
        ) : (
          <ChevronLeftIcon
            sx={{
              fontSize: "30px",
              color: isArrowHovered ? "white" : theme.palette.neutral[600],
              transition: "color 0.3s ease",
            }}
          />
        )}
      </EnhancedWhitePrevWrapper>
    </EnhancedWhiteButtonContainer>
  );
};

export const moduleWiseNext = (isHovered) => {
  switch (getCurrentModuleType()) {
    case ModuleTypes.GROCERY:
      return <Next displayNoneOnMobile isHovered={isHovered} />;
    case ModuleTypes.PHARMACY:
      return <EnhancedWhiteNext displayNoneOnMobile isHovered={isHovered} />;
    case ModuleTypes.ECOMMERCE:
      return <Next displayNoneOnMobile isHovered={isHovered} />;
    case ModuleTypes.FOOD:
      return <EnhancedWhiteNext displayNoneOnMobile isHovered={isHovered} />;
  }
};

export const moduleWisePrev = (isHovered) => {
  switch (getCurrentModuleType()) {
    case ModuleTypes.GROCERY:
      return <Prev displayNoneOnMobile isHovered={isHovered} />;
    case ModuleTypes.PHARMACY:
      return <EnhancedWhitePrev displayNoneOnMobile isHovered={isHovered} />;
    case ModuleTypes.ECOMMERCE:
      return <Prev displayNoneOnMobile isHovered={isHovered} />;
    case ModuleTypes.FOOD:
      return <EnhancedWhitePrev displayNoneOnMobile isHovered={isHovered} />;
  }
};

