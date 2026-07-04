import { useTheme } from "@emotion/react";
import { Typography, useMediaQuery } from "@mui/material";
import { Router, useRouter } from "next/router";
import React from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { RouteLinksData } from "../demoLinks";
import { setAllData } from "redux/slices/storeRegistrationData";
import { useDispatch, useSelector } from "react-redux";

const RouteLinks = (props) => {
  const dispatch = useDispatch();
  const { selectedModule } = useSelector((state) => state.utilsData);

  const { token, configData, centered } = props;
  const { t } = useTranslation();
  const router = useRouter();
  const handleClick = (href, value) => {
    if (value === "loyalty_points" || value === "my_wallet") {
      if (token) {
        Router.push(href, undefined, { shallow: true });
      } else {
        toast.error(t("You must be login to access this page."));
      }
    } else if (value === "campaigns") {
      const zoneId = localStorage.getItem("zoneid");
      if (zoneId) {
        Router.push(href, undefined, { shallow: true });
      } else {
        toast.error(t("You must pick a zone to access this page."));
      }
    } else if (value === "restaurant_owner") {
      dispatch(setAllData(null));
      router.push(
        {
          pathname: href,
          query: { active: "active" }, // Add your query parameter here
        },
        undefined,
        { shallow: true }
      );
    } else {
      router.push(href, undefined, { shallow: true });
    }
  };
  const handleClickToRoute = (href) => {
    router.push(href, undefined, { shallow: true });
  };
  const theme = useTheme();
  const isXsmall = useMediaQuery(theme.breakpoints.down("sm"));
  console.log({ configData });


  const linkSx = {
    fontSize: "14px",
    fontWeight: 400,
    color: "neutral.1050",
    letterSpacing: "-0.42px",
    lineHeight: 1.2,
    whiteSpace: "nowrap",
    py: "6px",
    cursor: "pointer",
    textAlign: centered ? "center" : "left",
    "&:hover": { color: theme.palette.primary.main },
  };

  return (
    <CustomStackFullWidth gap="0px" alignItems={centered ? "center" : "flex-start"}>
      {RouteLinksData.map((item, index) => {
        if (
          (!configData?.toggle_store_registration && item?.value === "restaurant_owner") ||
          (!configData?.toggle_dm_registration && item?.value === "delivery_man")
        ) {
          return null;
        }
        return (
          <Typography key={index} onClick={() => handleClick(item.link, item.value)} sx={linkSx}>
            {t(item.name)}
          </Typography>
        );
      })}
      <Typography onClick={() => handleClickToRoute("/about-us")} sx={linkSx}>
        {t("About Us")}
      </Typography>
      <Typography onClick={() => handleClickToRoute("/track-order")} sx={linkSx}>
        {selectedModule?.module_type === "rental" ? t("Track Trip") : t("Track Order")}
      </Typography>
    </CustomStackFullWidth>
  );
};

RouteLinks.propTypes = {};

export default RouteLinks;
