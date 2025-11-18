import { alpha, NoSsr, useMediaQuery, useTheme } from "@mui/material";
import AvailableZoneSection from "components/landing-page/AvailableZoneSection";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useGeolocated } from "react-geolocated";
import CookiesConsent from "../CookiesConsent";
import PushNotificationLayout from "../PushNotificationLayout";
import ComponentTwo from "./ComponentTwo";
import DiscountBanner from "./DiscountBanner";
import HeroSection from "./hero-section/HeroSection";
import Registration from "./Registration";
import CustomContainer from "components/container";
import Banners from "components/landing-page/Banners";
import Box from "@mui/material/Box";
import StatsSection from "./stats-section";
import ClientSection from "./our-client/ClientSection";
import DeliveryManAppDownload from "./delivery-download-section";
import { GallerySection } from "./gallery-section";
import ImageTitleSection from "./ImageTitleSection";
import FaqTabSection from "./FaqTabSection";

const MapModal = dynamic(() => import("../Map/MapModal"));

const LandingPage = ({ configData, landingPageData }) => {
  const Testimonials = dynamic(() => import("./Testimonials"), {
    ssr: false,
  });

  // console.log({data})
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
    setOpen(false)
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
  let zoneid = null;
  if (typeof window !== "undefined") {
    zoneid = localStorage.getItem("zoneid");
  }
  console.log({ landingPageData });


  return (
    <>
      <PushNotificationLayout>
        <HeroSection landingPageDataheroSection={landingPageData?.hero_section} />
        {landingPageData?.trust_section?.trust_section_status === 1 ? (
          <StatsSection trustSectionData={landingPageData?.trust_section} />
        ) : null}
        {landingPageData?.available_zone_section
          ?.available_zone_status === 1 &&
          landingPageData?.available_zone_section?.available_zone_list?.length > 0 ? (
          <AvailableZoneSection zoneSection={landingPageData?.available_zone_section} />
        ) : null}
        {Number(landingPageData?.promotional_banner_section?.promotion_banner_section_status) === 1 ? (
          <Box sx={{ background: theme => theme.palette.neutral[100] }}>
            <Banners promotionalBanner={landingPageData?.promotional_banner_section?.promotion_banners_full_url} isSmall={isSmall} />
          </Box>
        ) : null}
        {landingPageData?.user_app_download_section?.download_user_app_section_status === 1 ? (
          <Box sx={{ background: "linear-gradient(1.02deg, rgba(3, 157, 85, 0.1) -12.87%, rgba(3, 157, 85, 0.02) 99.13%)" }}>
            <ComponentTwo
              user_app_download_section={landingPageData?.user_app_download_section}
            />
          </Box>
        ) : null}
        <Box sx={{ background: theme => theme.palette.neutral[100], pb: "2rem" }}>
          <CustomContainer>
            {Number(landingPageData?.popular_client_section?.popular_client_section_status) === 1 && (
              <ClientSection popular_client_section={landingPageData?.popular_client_section} />
            )}

            {landingPageData?.seller_app_download_section?.download_seller_app_section_status === 1 ? (
              <Registration
                configData={configData}
                seller_app_download_section={landingPageData?.seller_app_download_section}
                isSmall={isSmall}
              />
            ) : null}

          </CustomContainer>
        </Box>
        {landingPageData?.deliveryman_app_download_section?.download_deliveryman_app_section_status === 1 ? (
          <Box >
            <CustomContainer>
              <DeliveryManAppDownload deliveryManApp={landingPageData?.deliveryman_app_download_section} />
            </CustomContainer>
          </Box>
        ) : null}
        <Box sx={{ background: theme => theme.palette.neutral[100] }}>
          {landingPageData?.banner_section?.banner_section_status ? (
            <DiscountBanner
              bannerImage={landingPageData?.banner_section?.banner_iamge_full_url}
              isSmall={isSmall}
            />
          ) : null}
          {landingPageData?.testimonial_section?.testimonial_section_status === 1 ? (
            <Testimonials handleOrderNow={handleOrderNow} testimonial_section={landingPageData?.testimonial_section} isSmall={isSmall} />
          ) : null}

        </Box>
        {landingPageData?.gallery_section ? (
          <Box sx={{ background: "linear-gradient(1.02deg, rgba(3, 157, 85, 0.1) -12.87%, rgba(3, 157, 85, 0.02) 99.13%)" }}>
            <GallerySection gallery_section={landingPageData?.gallery_section} />
          </Box>
        ) : null}
        {landingPageData?.highlight_section?.highlight_section_status === 1 ? (
          <CustomContainer>
            <ImageTitleSection highlight_section={landingPageData?.highlight_section} />
          </CustomContainer>
        ) : null}
        <CustomContainer>
          <FaqTabSection faq_section={landingPageData?.faq_section} />
        </CustomContainer>

        <Box sx={{
          mb: {
            xs: "0rem",
            md: "6rem"
          }
        }}></Box>
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
