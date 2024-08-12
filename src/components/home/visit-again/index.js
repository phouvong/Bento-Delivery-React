import React from "react";
import {
  CustomStackFullWidth,
  SliderCustom,
} from "styled-components/CustomStyles.style";
import H1 from "../../typographies/H1";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import Subtitle1 from "../../typographies/Subtitle1";
import Slider from "react-slick";
import { alpha, useTheme } from "@mui/material";
import VisitAgainCard from "../../cards/VisitAgainCard";
import { settings } from "./SliderSettings";
import { IsSmallScreen } from "utils/CommonValues";
import CustomContainer from "../../container";
import { ModuleTypes } from "helper-functions/moduleTypes";
import { getToken } from "helper-functions/getToken";

const VisitAgain = (props) => {
  const { configData, visitedStores, isVisited } = props;
  const theme = useTheme();
  const token = getToken();
  const getModuleWiseData = () => {
    switch (getCurrentModuleType()) {
      case ModuleTypes.GROCERY:
        return {
          mainPosition: "flex-start",
          heading: isVisited ? "Visit Again!" : "Whats New",
          subHeading:
            "Get your recent purchase from the shop you recently ordered",
          bgColor:
            theme.palette.mode === "dark"
              ? "rgba(3, 157, 85, 0.05)"
              : alpha(theme.palette.primary.main, 0.2),
        };
      case ModuleTypes.PHARMACY:
        return {
          mainPosition: !isVisited ? "flex-start" : "center",
          heading: isVisited ? "Visit Again!" : "Whats New",
          subHeading:
            "Get your recent medicine from the store you recently ordered",
          bgColor:
            theme.palette.mode === "dark"
              ? "rgba(3, 157, 85, 0.05)"
              : alpha(theme.palette.primary.main, 0.2),
        };
      case ModuleTypes.ECOMMERCE:
        return {
          mainPosition: "flex-start",
          heading: isVisited ? "Visit Again!" : "Whats New",
          subHeading:
            "Get your recent purchase from the shop you recently ordered",
          bgColor:
            theme.palette.mode === "dark"
              ? "rgba(3, 157, 85, 0.05)"
              : alpha(theme.palette.primary.main, 0.2),
        };
      case ModuleTypes.FOOD:
        return {
          mainPosition: "flex-start",
          heading: isVisited ? "Wanna Try  Again!!" : "Whats New",
          subHeading:
            "Get your recent food from the restaurant you recently ordered",
          bgColor:
            theme.palette.mode === "dark"
              ? "rgba(3, 157, 85, 0.05)"
              : alpha(theme.palette.primary.main, 0.2),
        };
    }
  };
  return (
    <>
      {visitedStores?.length > 0 && token && (
        <CustomStackFullWidth
          alignItems={getModuleWiseData?.()?.mainPosition}
          justyfyContent={getModuleWiseData?.()?.mainPosition}
          mt={IsSmallScreen() ? "2px" : "16px"}
          spacing={{ xs: 2, md: 1 }}
        >
          {IsSmallScreen() ? (
            <CustomContainer>
              <CustomStackFullWidth
                alignItems={getModuleWiseData?.()?.mainPosition}
                justyfyContent={getModuleWiseData?.()?.mainPosition}
                mt="10px"
                spacing={1}
              >
                <H1 text={getModuleWiseData?.()?.heading} />
                {isVisited && (
                  <Subtitle1
                    textAlign={getModuleWiseData?.()?.mainPosition}
                    text={getModuleWiseData?.()?.subHeading}
                  />
                )}
              </CustomStackFullWidth>
            </CustomContainer>
          ) : (
            <>
              <H1 text={getModuleWiseData?.()?.heading} />
              {isVisited && (
                <Subtitle1 text={getModuleWiseData?.()?.subHeading} />
              )}
            </>
          )}
          <SliderCustom
            nopadding="true"
            sx={{
              backgroundColor: getModuleWiseData?.()?.bgColor,
              padding: { xs: "7px", md: "17px" },
            }}
          >
            <Slider {...settings}>
              {visitedStores?.map((item, index) => {
                return (
                  <VisitAgainCard
                    key={index}
                    item={item}
                    onlyshimmer
                    configData={configData}
                    isVisited={isVisited}
                  />
                );
              })}
            </Slider>
          </SliderCustom>
        </CustomStackFullWidth>
      )}
    </>
  );
};

VisitAgain.propTypes = {};

export default VisitAgain;
