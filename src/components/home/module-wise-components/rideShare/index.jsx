import { Stack } from "@mui/material";
import CustomContainer from "components/container";
import MobileAppBanner from "components/home/MobileAppBanner";
import Banners from "components/home/banners";
import RideShareIntroBanner from "./RideShareIntroBanner";

const SECTION_GAP = { xs: "25px", md: "20px" };

const RideShareModuleLandingPage = ({ configData }) => {
  const appUrl = {
    android: configData?.app_url_android_rider || "",
    ios: configData?.app_url_ios_rider || "",
  };

  return (
    // <CustomContainer sx={{ mt: { md: "24px" } }}>
    <Stack spacing={0} sx={{ "& > * + *": { mt: SECTION_GAP } }}>
      <CustomContainer sx={{ mt: { md: "24px" } }}>
        {configData?.react_ride_share_page?.customer?.hero_section?.status ||
        configData?.react_ride_share_page?.rider?.hero_section?.status ? (
          <RideShareIntroBanner
            heroData={configData?.react_ride_share_page?.hero_section || {}}
            configData={configData}
            appUrl={appUrl}
          />
        ) : null}
      </CustomContainer>
      <CustomContainer noMobilePadding>
        <MobileAppBanner /> {/* Download the global mart app */}
      </CustomContainer>
      <CustomContainer noMobilePadding>
        <Banners />
      </CustomContainer>
    </Stack>
    // </CustomContainer>
  );
};

export default RideShareModuleLandingPage;
