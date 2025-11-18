import { useEffect, useState } from "react";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";

import {
  alpha,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { getLanguage } from "helper-functions/getLanguage";
import DollarSignHighlighter from "../../DollarSignHighlighter";
import DownArrow from "../assets/DownArrow";
import DownArrowRTL from "../assets/DownArrowRTL";
import HeroLocationForm from "./HeroLocationForm";
import ModuleSelectionRaw from "./module-selection/ModuleSelectionRaw";

const HeroTitleSection = ({ landingPageData }) => {
  const theme = useTheme();
  const isXSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const [currentLocation, setCurrentLocation] = useState(null);
  const lanDirection = getLanguage() ? getLanguage() : "ltr";
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentLocation(window.localStorage.getItem("location"));
    }
  }, []);
  const getSearchOrModulesBySelectedModules = () => {
    if (currentLocation) {
      return <ModuleSelectionRaw />;
    } else {
      return (
        <CustomStackFullWidth mt="15px" mb={{ xs: ".5rem", md: "1.5rem" }} sx={{ maxWidth: currentLocation ? "100%" : "666px", mx: "auto" }}>
          <HeroLocationForm />
        </CustomStackFullWidth>
      );
    }
  };

  return (
    <CustomStackFullWidth>
      {getSearchOrModulesBySelectedModules()}
    </CustomStackFullWidth>
  );
};

export default HeroTitleSection;
