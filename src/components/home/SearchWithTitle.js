import { Typography, useMediaQuery, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { ModuleTypes } from "helper-functions/moduleTypes";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import ManageSearch from "../header/second-navbar/ManageSearch";
import TrackParcelFromHomePage from "../parcel/TrackParcelFromHomePage";

const SearchWithTitle = (props) => {
  const moduleType = getCurrentModuleType();
  const { zoneid, token, searchQuery, name, query, currentTab } = props;
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const { t } = useTranslation();
  const getBannerTexts = () => {
    switch (getCurrentModuleType()) {
      case ModuleTypes.GROCERY:
        return {
          title: "Fresh Item that deserve to eat",
          subTitle: "Get your groceries items delivered in less than an hour",
        };
      case ModuleTypes.PHARMACY:
        return {
          title: "Quality Medicines & Health care at your Doorstep.",
          subTitle: "",
        };
      case ModuleTypes.ECOMMERCE:
        return {
          title: "Exclusive collection for everyone",
          subTitle: "Get Your Desired High Quality Products Here",
        };
      case ModuleTypes.FOOD:
        return {
          title: "FIND YOUR HAPPINESS",
          subTitle: "For the love of delicious food.",
        };
      case ModuleTypes.PARCEL:
        return {
          title: "Track your Products",
          subTitle: "Now you can track your products easily whenever you want.",
        };
      default:
        return {
          title: "",
          subTitle: "",
        };
    }
  };

  return (
    <CustomStackFullWidth
      alignItems="center"
      justifyContent="center"
      spacing={isSmall ? 1 : 3}
      p={isSmall ? "25px" : "20px"}
    >
      <CustomStackFullWidth
        alignItems="center"
        justifyContent="center"
        spacing={1.5}
      >
        <Typography
          variant={isSmall ? "h6" : "h5"}
          textAlign="center"
          fontWeight="600"
          lineHeight="33.18px"
          component="h1"
        >
          {t(getBannerTexts().title)}
        </Typography>
        <Typography
          variant={isSmall ? "subtitle2" : "subtitle1"}
          textAlign="center"
          sx={{ color: (theme) => theme.palette.neutral[400] }}
          fontWeight="400"
          lineHeight="18.75px"
          component="p"
        >
          {t(getBannerTexts().subTitle)}
        </Typography>
      </CustomStackFullWidth>
      {moduleType !== "parcel" ? (
        <ManageSearch
          zoneid={zoneid}
          token={token}
          maxwidth="false"
          fullWidth
          searchQuery={searchQuery}
          name={name}
          query={query}
          currentTab={currentTab}
        />
      ) : (
        <TrackParcelFromHomePage />
      )}
    </CustomStackFullWidth>
  );
};

export default SearchWithTitle;
