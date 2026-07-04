import { Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ractangle from "../../../../public/static/footer/Rectangle.svg";
import magnifying from "../../../../public/static/footer/magnifying.svg";
import phone from "../../../../public/static/footer/phone.svg";
import CustomImageContainer from "../../CustomImageContainer";
import LocationViewOnMap from "../../Map/location-view/LocationViewOnMap";
import AppLinks from "./AppLinks";
import RouteLinks from "./RouteLinks";
import SomeInfo from "./SomeInfo";

const VerticalDivider = () => (
  <Box sx={{ width: "2px", alignSelf: "stretch", backgroundColor: "divider", flexShrink: 0 }} />
);

const HorizontalDivider = () => (
  <Box sx={{ width: "100%", height: "2px", backgroundColor: "divider" }} />
);

const FooterMiddle = ({ configData, landingPageData }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const appLinkData = {
    app_store_link:
      landingPageData?.user_app_download_section?.download_user_app_links?.apple_store_url,
    play_store_link:
      landingPageData?.user_app_download_section?.download_user_app_links?.playstore_url,
    app_status:
      landingPageData?.user_app_download_section?.download_user_app_links?.apple_store_url_status,
    play_status:
      landingPageData?.user_app_download_section?.download_user_app_links?.playstore_url_status,
  };

  return (
    <Box sx={{ width: "100%", maxWidth: "1312px", mx: "auto", px: 0 }}>
      {/* ── MOBILE LAYOUT ── */}
      <Stack
        gap="16px"
        sx={{
          display: { xs: "flex", md: "none" },
          alignItems: "center",
        }}
      >
        {/* Brand + App */}
        <Stack gap="16px" alignItems="center" sx={{ width: "100%" }}>
          <CustomImageContainer
            src={configData?.logo_full_url}
            alt={configData?.business_name}
            width="auto"
            height="36px"
            objectfit="contain"
          />
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 400,
              color: "neutral.500",
              lineHeight: 1.3,
              textAlign: "center",
            }}
          >
            {landingPageData?.footer_section?.fixed_footer_description}
          </Typography>
        </Stack>

        <Stack gap="8px" alignItems="center" sx={{ width: "100%" }}>
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 600,
              color: "neutral.500",
              letterSpacing: "-0.42px",
              lineHeight: 1.2,
            }}
          >
            {t("Available on")}
          </Typography>
          <AppLinks landingPageData={appLinkData} />
        </Stack>

        <HorizontalDivider />

        {/* Quick Links */}
        <Stack gap="0px" alignItems="center" sx={{ width: "100%" }}>
          <Box sx={{ py: "8px", height: "36px", display: "flex", alignItems: "center" }}>
            <Typography
              sx={{
                fontSize: "18px",
                fontWeight: 700,
                color: "neutral.500",
                letterSpacing: "-0.54px",
                lineHeight: 1.1,
              }}
            >
              {t("Quick Links")}
            </Typography>
          </Box>
          <RouteLinks configData={configData} centered />
        </Stack>

        <HorizontalDivider />

        {/* Contact Info — flex-wrap 2+1 */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            alignItems: "flex-start",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Box sx={{ flex: "1 0 0", minWidth: "140px" }}>
            <SomeInfo
              image={ractangle}
              alt="mail"
              title="Send us mails"
              info={configData?.email}
              t={t}
              href={`mailto:${configData?.email}`}
            />
          </Box>
          <Box sx={{ flex: "1 0 0", minWidth: "140px" }}>
            <SomeInfo
              image={phone}
              alt="phone"
              title="Contact us"
              info={configData?.phone}
              t={t}
              href={`tel:${configData?.phone}`}
            />
          </Box>
          <Box sx={{ flex: "1 0 0", minWidth: "140px" }} onClick={() => setOpen(true)}>
            <SomeInfo
              image={magnifying}
              alt="location"
              title="Find us here"
              info={configData?.address}
              t={t}
              href={false}
            />
          </Box>
        </Box>
      </Stack>

      {/* ── DESKTOP LAYOUT ── */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "row",
          alignItems: "center",
          gap: "48px",
        }}
      >
        {/* Column 1: Brand + App */}
        <Stack gap="20px" sx={{ width: { md: "240px", lg: "320px" }, flexShrink: 0 }}>
          <Stack gap="16px">
            <Box sx={{ img: { transition: "all ease 0.5s" }, "&:hover img": { transform: "scale(1.04)" } }}>
              <CustomImageContainer
                src={configData?.logo_full_url}
                alt={configData?.business_name}
                width="auto"
                height="36px"
                objectfit="contain"
              />
            </Box>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 400,
                color: "neutral.500",
                lineHeight: 1.3,
                letterSpacing: 0,
              }}
            >
              {landingPageData?.footer_section?.fixed_footer_description}
            </Typography>
          </Stack>
          <Stack gap="8px">
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 600,
                color: "neutral.500",
                letterSpacing: "-0.42px",
                lineHeight: 1.2,
                whiteSpace: "nowrap",
              }}
            >
              {t("Available on")}
            </Typography>
            <AppLinks landingPageData={appLinkData} align="flex-start" />
          </Stack>
        </Stack>

        <VerticalDivider />

        {/* Column 2: Quick Links */}
        <Stack gap="0px" sx={{ flexShrink: 0 }}>
          <Box sx={{ py: "8px", height: "36px", display: "flex", alignItems: "center" }}>
            <Typography
              sx={{
                fontSize: "18px",
                fontWeight: 700,
                color: "neutral.500",
                letterSpacing: "-0.54px",
                lineHeight: 1.1,
                whiteSpace: "nowrap",
              }}
            >
              {t("Quick Links")}
            </Typography>
          </Box>
          <RouteLinks configData={configData} />
        </Stack>

        <VerticalDivider />

        {/* Column 3: Contact Info */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: { md: "16px", lg: "0px" },
          }}
        >
          <Box sx={{ minWidth: "130px", flex: "1 1 130px" }}>
            <SomeInfo
              image={ractangle}
              alt="mail"
              title="Send us mails"
              info={configData?.email}
              t={t}
              href={`mailto:${configData?.email}`}
            />
          </Box>
          <Box sx={{ minWidth: "130px", flex: "1 1 130px" }}>
            <SomeInfo
              image={phone}
              alt="phone"
              title="Contact us"
              info={configData?.phone}
              t={t}
              href={`tel:${configData?.phone}`}
            />
          </Box>
          <Box onClick={() => setOpen(true)} sx={{ minWidth: "130px", flex: "1 1 130px", cursor: "pointer" }}>
            <SomeInfo
              image={magnifying}
              alt="location"
              title="Find us here"
              info={configData?.address}
              t={t}
              href={false}
            />
          </Box>
        </Box>
      </Box>

      {open && (
        <LocationViewOnMap
          open={open}
          handleClose={() => setOpen(false)}
          latitude={configData?.default_location?.lat}
          longitude={configData?.default_location?.lng}
          address={configData?.address}
          isFooter
        />
      )}
    </Box>
  );
};

FooterMiddle.propTypes = {};

export default FooterMiddle;
