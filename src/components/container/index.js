import React from "react";
import { Container } from "@mui/material";
import { styled } from "@mui/material/styles";

const ContainerWrapper = styled(Container)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    paddingLeft: "16px",
    paddingRight: "16px",
  },
  [theme.breakpoints.up("lg")]: {
    maxWidth: "1320px",
    paddingLeft: "0 !important",
    paddingRight: "0 !important",
    marginLeft: "auto !important",
    marginRight: "auto !important",
  },
  // Only between 1234px–1340px: cap at 1200px so content gets side gutters.
  "@media (min-width:1234px) and (max-width:1340px)": {
    maxWidth: "1200px !important",
  },
  "&:not(:has(*))": {
    display: "none",
  },
}));

/**
 * CustomContainer — centered layout wrapper.
 *
 * Props:
 *   noMobilePadding  — removes left/right padding on mobile (xs/sm).
 *                      Use for full-width sections like banners, carousels.
 *   mobilePx         — custom mobile horizontal padding (e.g. "0px", "16px").
 *                      Overrides default 10px. Ignored if noMobilePadding is set.
 */
const CustomContainer = ({
  children,
  noMobilePadding = false,
  mobilePx = undefined,
  sx = undefined,
  ...rest
}) => {
  const mobilePaddingSx = noMobilePadding
    ? {
        "@media (max-width:600px)": {
          paddingLeft: "0 !important",
          paddingRight: "0 !important",
        },
      }
    : mobilePx !== undefined
    ? {
        "@media (max-width:600px)": {
          paddingLeft: `${mobilePx} !important`,
          paddingRight: `${mobilePx} !important`,
        },
      }
    : {};

  return (
    <ContainerWrapper
      sx={[mobilePaddingSx, ...(Array.isArray(sx) ? sx : [sx ?? {}])]}
      {...rest}
    >
      {children}
    </ContainerWrapper>
  );
};

export default CustomContainer;
