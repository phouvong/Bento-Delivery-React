import React from "react";
import PropTypes from "prop-types";
import { Badge, styled } from "@mui/material";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { ModuleTypes } from "helper-functions/moduleTypes";

const getModuleWiseBG = (theme) => {
  switch (getCurrentModuleType()) {
    case ModuleTypes.GROCERY:
      return theme.palette.error.deepLight;
    case ModuleTypes.PHARMACY:
      return theme.palette.moduleTheme.pharmacy;
    case ModuleTypes.ECOMMERCE:
      return theme.palette.info.blue;
    case ModuleTypes.FOOD:
      return theme.palette.moduleTheme.food;
  }
};

export const CustomBadgeWrapepr = styled(Badge)(
  ({ theme, bg_color, top, left, border_radius,fontSize    }) => ({
    color: theme.palette.whiteContainer.main,
    backgroundColor: bg_color ? bg_color : theme.palette.error.deepLight,
    position: "absolute",
    top: top ? top : "0",
    left: left ? left : 0,
    zIndex: "1",
    fontSize: fontSize ? fontSize : "15px",
    fontWeight: "500",
    lineHeight: "24px",
    padding: "0px 10px",

    borderRadius: border_radius ? border_radius : "0px 4px 4px 0px",
    [theme.breakpoints.down("sm")]: {
      fontSize: "10px",
    },
  })
);

const CustomBadge = (props) => {
  const { text, top, bg_color,fontSize,border_radius } = props;
  return (
    <CustomBadgeWrapepr fontSize={fontSize} border_radius={border_radius} bg_color={bg_color} top={top}>
      {" "}
      {text}
    </CustomBadgeWrapepr>
  );
};

CustomBadge.propTypes = {
  text: PropTypes.string.isRequired,
};

export default CustomBadge;
