import React, { useState } from "react";
import { styled, useMediaQuery, useTheme, keyframes } from "@mui/material";
import { Box } from "@mui/system";
import { getLanguage } from "../../helper-functions/getLanguage";
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

// Enhanced Button Container with hover effects
const EnhancedButtonContainer = styled(Box)(({ theme, right, isdisabled, ishovered, noboxshadow, isRtl, noBackground }) => ({
  top: 0,
  height: "100%",
  width: "73px",
  background: noBackground
    ? "inherit"
    : noboxshadow
    ? "inherit"
    : right === "true"
    ? `linear-gradient(270deg, ${
        isRtl === "rtl"
          ? "rgba(255, 255, 255, 0)"
          : theme.palette.neutral[100]
      } 0%, ${
        isRtl === "rtl"
          ? theme.palette.neutral[100]
          : "rgba(75, 86, 107, 0.05) -28.57%, rgba(255, 255, 255, 0) 122.62%"
      } 100%)`
    : `linear-gradient(${
        isRtl === "rtl" ? "to left" : "to right"
      },  ${
        isRtl === "rtl"
          ? "rgba(255, 255, 255, 0)"
          : "rgba(75, 86, 107, 0.05) -28.57%, rgba(255, 255, 255, 0) 122.62%"
      } 0%, ${
        isRtl === "rtl"
          ? theme.palette.neutral[100]
          : "rgba(255, 255, 255, 0)"
      }  100%)`,
  zIndex: 1,
  right: right === "true" && (noBackground ? "-8px" : 0),
  left: right !== "true" && 0,
  position: "absolute",
  alignItems: "center",
  justifyContent: "center",
  display: isdisabled ? "none" : "flex",
  opacity: ishovered ? 1 : 0,
  transition: "opacity 0.3s ease-in-out",
  borderTopRightRadius: noBackground ? "12px" : 0,
  borderBottomRightRadius: noBackground ? "12px" : 0,
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

// Enhanced Arrow Wrappers
const EnhancedPrevWrapper = styled(Box)(({ theme, isdisabled, isarrowhovered, width, height, variant }) => ({
  zIndex: 1,
  top: "50%",
  left: variant === "primary" ? 0 : "0px",
  display: isdisabled ? "none" : "flex",
  alignItems: "center",
  justifyContent: "center",
  width: width || "38px",
  height: height || "38px",
  borderRadius: "50%",
  backgroundColor: isarrowhovered 
    ? theme.palette.primary.main 
    : variant === "primary" 
      ? theme.palette.primary.main 
      : theme.palette.neutral[100],
  cursor: "pointer",
  transition: "all 0.3s ease",
  animation: isarrowhovered ? "none" : `${slideLeft} 0.8s ease-in-out infinite alternate`,
  boxShadow: variant === "primary" ? "rgba(149, 157, 165, 0.2) 0px 8px 24px" : "none",
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
    transform: "scale(1.05)",
  },
}));

const EnhancedNextWrapper = styled(Box)(({ theme, isdisabled, isarrowhovered, width, height, variant }) => ({
  zIndex: 1,
  top: "50%",
  right: variant === "primary" ? 8 : 0,
  display: isdisabled ? "none" : "flex",
  alignItems: "center",
  justifyContent: "center",
  width: width || "38px",
  height: height || "38px",
  borderRadius: "50%",
  backgroundColor: isarrowhovered 
    ? theme.palette.primary.main 
    : variant === "primary" 
      ? theme.palette.primary.main 
      : theme.palette.neutral[100],
  cursor: "pointer",
  transition: "all 0.3s ease",
  animation: isarrowhovered ? "none" : `${slideRight} 0.8s ease-in-out infinite alternate`,
  boxShadow: variant === "primary" ? "rgba(149, 157, 165, 0.2) 0px 8px 24px" : "none",
  border: variant === "white" ? "1px solid" : "none",
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
    transform: "scale(1.05)",
  },
}));

// Enhanced Next Arrow Component
export const EnhancedNext = ({ 
  onClick, 
  className, 
  displayNoneOnMobile, 
  width, 
  height, 
  isHovered, 
  variant = "white", // "white", "primary", "neutral"
  noboxshadow,
  noBackground,
  rightSpace 
}) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const displayNone = isSmall ? (displayNoneOnMobile ? true : false) : false;
  const [isArrowHovered, setIsArrowHovered] = useState(false);

  return (
    <EnhancedButtonContainer
      isdisabled={displayNone || className?.includes("slick-disabled")}
      right="true"
      ishovered={isHovered}
      noboxshadow={noboxshadow}
      isRtl={getLanguage()}
      noBackground={noBackground}
    >
      <EnhancedNextWrapper
        width={width}
        height={height}
        variant={variant}
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
              color: isArrowHovered || variant === "primary" 
                ? "white" 
                : theme.palette.neutral[600],
              transition: "color 0.3s ease",
            }}
          />
        ) : (
          <ChevronRightIcon
            sx={{
              fontSize: "30px",
              color: isArrowHovered || variant === "primary" 
                ? "white" 
                : theme.palette.neutral[600],
              transition: "color 0.3s ease",
            }}
          />
        )}
      </EnhancedNextWrapper>
    </EnhancedButtonContainer>
  );
};

// Enhanced Prev Arrow Component
export const EnhancedPrev = ({ 
  onClick, 
  className, 
  displayNoneOnMobile, 
  width, 
  height, 
  left, 
  isHovered, 
  variant = "white", // "white", "primary", "neutral"
  noboxshadow,
  noBackground 
}) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const displayNone = isSmall ? (displayNoneOnMobile ? true : false) : false;
  const [isArrowHovered, setIsArrowHovered] = useState(false);

  return (
    <EnhancedButtonContainer
      isdisabled={displayNone || className?.includes("slick-disabled")}
      ishovered={isHovered}
      noboxshadow={noboxshadow}
      isRtl={getLanguage()}
      noBackground={noBackground}
    >
      <EnhancedPrevWrapper
        width={width}
        height={height}
        left={left}
        variant={variant}
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
              color: isArrowHovered || variant === "primary" 
                ? "white" 
                : theme.palette.neutral[600],
              transition: "color 0.3s ease",
            }}
          />
        ) : (
          <ChevronLeftIcon
            sx={{
              fontSize: "30px",
              color: isArrowHovered || variant === "primary" 
                ? "white" 
                : theme.palette.neutral[600],
              transition: "color 0.3s ease",
            }}
          />
        )}
      </EnhancedPrevWrapper>
    </EnhancedButtonContainer>
  );
};

// Utility function to create enhanced arrows with hover state
export const createEnhancedArrows = (isHovered, options = {}) => {
  const {
    variant = "white",
    displayNoneOnMobile = false,
    width,
    height,
    left,
    noboxshadow = false,
    noBackground = false,
    rightSpace
  } = options;

  return {
    nextArrow: (
      <EnhancedNext
        displayNoneOnMobile={displayNoneOnMobile}
        width={width}
        height={height}
        isHovered={isHovered}
        variant={variant}
        noboxshadow={noboxshadow}
        noBackground={noBackground}
        rightSpace={rightSpace}
      />
    ),
    prevArrow: (
      <EnhancedPrev
        displayNoneOnMobile={displayNoneOnMobile}
        width={width}
        height={height}
        left={left}
        isHovered={isHovered}
        variant={variant}
        noboxshadow={noboxshadow}
        noBackground={noBackground}
      />
    ),
  };
};