import { NoSsr, useMediaQuery, useTheme } from "@mui/material";
import AvailableZoneSection from "components/landing-page/AvailableZoneSection";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useGeolocated } from "react-geolocated";
import CookiesConsent from "../CookiesConsent";
import PushNotificationLayout from "../PushNotificationLayout";
import AppDownloadSection from "./app-download-section/index";
import Banners from "./Banners";
import ComponentOne from "./ComponentOne";
import ComponentTwo from "./ComponentTwo";
import DiscountBanner from "./DiscountBanner";
import HeroSection from "./hero-section/HeroSection";
import Registration from "./Registration";
const MapModal = dynamic(() => import("../Map/MapModal"));
const LandingPage = ({ configData, landingPageData }) => {
  const Testimonials = dynamic(() => import("./Testimonials"), {
    ssr: false,
  });
  const [location, setLocation] = useState(undefined);
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const { coords } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
    isGeolocationEnabled: true,
  });
  useEffect(() => {
    setLocation(JSON.stringify(localStorage.getItem("location")));
  }, []);
  const handleClose = () => {
    const location = localStorage.getItem("location");
    const isModuleExist = localStorage.getItem("module");
    if (location) {
      isModuleExist && setOpen(false);
    } else {
    }
  };
  const router = useRouter();
  const handleOrderNow = () => {
    if (location) {
      if (location === "null") {
        setOpen(true);
      } else {
        router.push("/home", undefined, { shallow: true });
      }
    } else {
      setOpen(true);
    }
  };

  return (
    <>
      <PushNotificationLayout>
        <HeroSection
          configData={configData}
          landingPageData={landingPageData}
          handleOrderNow={handleOrderNow}
        />
        <ComponentOne
          landingPageData={landingPageData}
          configData={configData}
          handleOrderNow={handleOrderNow}
        />
        {landingPageData?.promotion_banners?.length > 0 ? (
          <Banners landingPageData={landingPageData} isSmall={isSmall} />
        ) : null}
        <ComponentTwo
          configData={configData}
          landingPageData={landingPageData}
        />
        {landingPageData?.available_zone_status === 1 &&
        landingPageData?.available_zone_list?.length > 0 ? (
          <AvailableZoneSection landingPageData={landingPageData} />
        ) : null}

        {landingPageData?.earning_seller_status ||
        landingPageData?.earning_dm_status ? (
          <Registration
            configData={configData}
            data={landingPageData}
            isSmall={isSmall}
          />
        ) : null}
        {landingPageData?.fixed_promotional_banner_full_url ? (
          <DiscountBanner
            bannerImage={landingPageData?.fixed_promotional_banner_full_url}
            isSmall={isSmall}
          />
        ) : null}
        {landingPageData?.business_title ||
        landingPageData?.business_sub_title ||
        landingPageData?.business_image ? (
          <AppDownloadSection
            configData={configData}
            landingPageData={landingPageData}
          />
        ) : null}
        {landingPageData?.testimonial_list?.length > 0 ? (
          <Testimonials landingPageData={landingPageData} isSmall={isSmall} />
        ) : null}
        {open && (
          <MapModal
            open={open}
            handleClose={handleClose}
            coords={coords}
            disableAutoFocus
          />
        )}
        <NoSsr>
          <CookiesConsent text={configData?.cookies_text} />
        </NoSsr>
      </PushNotificationLayout>
    </>
  );
};

export default LandingPage;
