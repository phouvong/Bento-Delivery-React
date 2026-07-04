import { Box, Stack, Typography } from "@mui/material";
import CustomImageContainer from "components/CustomImageContainer";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import avatar1 from "./asset/avatar1.jpg";
import avatar2 from "./asset/avatar2.jpg";
import avatar3 from "./asset/avatar3.jpg";
import avatar4 from "./asset/avatar4.jpg";

const SOCIAL_AVATARS = [
  avatar1?.src ?? avatar1,
  avatar2?.src ?? avatar2,
  avatar3?.src ?? avatar3,
  avatar4?.src ?? avatar4,
];

const TABS = [
  { id: "customer", labelKey: "I'm a Customer" },
  { id: "rider", labelKey: "I'am a Rider" },
];

const getPointsData = (pointsData) => {
  if (!Array.isArray(pointsData)) return [];
  return pointsData.filter((item) => item?.status === 1);
};

const RideShareIntroBanner = ({ configData, appUrl }) => {
  console.log({ appUrl });
  const customerData =
    configData?.react_ride_share_page?.customer?.hero_section || {};
  const riderData =
    configData?.react_ride_share_page?.rider?.hero_section || {};

  const visibleTabs = TABS.filter((tab) => {
    const section = tab.id === "customer" ? customerData : riderData;
    return section?.status === 1;
  });

  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(() =>
    customerData?.status === 1 ? "customer" : "rider",
  );

  const heroData = activeTab === "customer" ? customerData : riderData;

  const handleAppUrlClick = () => {
    if (typeof window === "undefined") return;

    const ua = navigator.userAgent || navigator.vendor || "";
    const isIos = /iphone|ipad|ipod/i.test(ua);
    const isAndroid = /android/i.test(ua);

    if (isAndroid) {
      const fallback = encodeURIComponent(appUrl?.android ?? "");
      window.location.href = `intent://open/#Intent;package=com.sixamtech.sixam_mart_user;S.browser_fallback_url=${fallback};end`;
    } else if (isIos) {
      let appOpened = false;
      const onVisibilityChange = () => {
        if (document.hidden) appOpened = true;
      };
      document.addEventListener("visibilitychange", onVisibilityChange);

      window.location.href = window.location.origin;

      setTimeout(() => {
        document.removeEventListener("visibilitychange", onVisibilityChange);
        if (!appOpened && appUrl?.ios) {
          window.location.href = appUrl.ios;
        }
      }, 2500);
    } else {
      // Desktop: store link directly open
      const url = appUrl?.ios ?? appUrl?.android;
      if (url) window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        borderRadius: "16px",
        overflow: "hidden",
        // mobile: gradient bg / desktop: theme bg + shadow
        background: {
          xs: (theme) =>
            `linear-gradient(180deg, ${theme.palette.background.paper} 13%, ${theme.palette.background.default} 23%)`,
          md: "none",
        },
        backgroundColor: { xs: "transparent", md: "background.paper" },
        boxShadow: {
          xs: "none",
          md: "0px 1px 4px 0px rgba(0,0,0,0.10), 0px 1px 4px 0px rgba(0,0,0,0.05)",
        },
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: { xs: "flex-start", md: "center" },
        gap: { xs: "0px", md: "96px" },
        px: { xs: "24px", md: "48px" },
        pt: { xs: "24px", md: "32px" },
        pb: { xs: "16px", md: "48px" },
      }}
    >
      {/* ── Content ── */}
      <Stack
        spacing={{ xs: "20px", md: "24px" }}
        sx={{ flex: 1, minWidth: 0, width: "100%" }}
      >
        {/* Tabs */}
        <Stack direction="row" gap="24px">
          {visibleTabs.map((tab) => (
            <Box
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              sx={{
                height: { xs: "32px", md: "40px" },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                borderBottom:
                  activeTab === tab.id ? "3px solid" : "3px solid transparent",
                borderColor:
                  activeTab === tab.id ? "primary.main" : "transparent",
                pb: "8px",
                userSelect: "none",
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "14px", md: "18px" },
                  fontWeight: activeTab === tab.id ? 700 : 400,
                  letterSpacing: { xs: "-0.42px", md: "-0.54px" },
                  lineHeight: 1.1,
                  color: activeTab === tab.id ? "primary.main" : "neutral.1050",
                  whiteSpace: "nowrap",
                  textTransform: "capitalize",
                }}
              >
                {t(tab.labelKey)}
              </Typography>
            </Box>
          ))}
        </Stack>

        {/* Title + Description */}
        <Stack spacing="12px">
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: "24px", md: "40px" },
              fontWeight: 700,
              letterSpacing: { xs: "-1.2px", md: "-0.8px" },
              lineHeight: 1.1,
              color: "neutral.1050",
            }}
          >
            {/* {t("Ride Anywhere,")}
            <br />
            {t("Anytime With")}{" "}
            <Box component="span" sx={{ color: "primary.main" }}>
              {t("6amMart")}
            </Box> */}
            {heroData?.intro?.title || ""}
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "14px", md: "16px" },
              fontWeight: 400,
              lineHeight: { xs: 1.2, md: 1.3 },
              letterSpacing: { xs: "-0.42px", md: 0 },
              color: "neutral.500",
            }}
          >
            {heroData?.intro?.sub_title || ""}
          </Typography>
        </Stack>

        {/* Features + Social proof */}
        <Stack spacing="12px">
          {/* Feature pills */}
          <Stack
            direction="row"
            flexWrap="wrap"
            gap={{ xs: "8px", md: "30px" }}
          >
            {getPointsData(heroData?.points).map((f, idx) => (
              <Stack
                key={idx}
                direction="row"
                alignItems="center"
                gap="10px"
                sx={{ minWidth: 0 }}
              >
                <Box
                  sx={{
                    width: { xs: 24, md: 36 },
                    height: { xs: 24, md: 36 },
                    borderRadius: { xs: "50%", md: "8px" },
                    backgroundColor: {
                      xs: "background.paper",
                      md: "background.secondary",
                    },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    overflow: "hidden",
                    p: { xs: "3px", md: "4px" },
                  }}
                >
                  <CustomImageContainer
                    src={f.image_full_url}
                    alt={f.title}
                    width="100%"
                    height="100%"
                    objectfit="contain"
                  />
                </Box>
                <Typography
                  sx={{
                    fontSize: { xs: "14px", md: "16px" },
                    fontWeight: 500,
                    letterSpacing: { xs: "-0.42px", md: "-0.48px" },
                    lineHeight: 1.1,
                    color: "neutral.1050",
                    textTransform: "capitalize",
                    whiteSpace: "nowrap",
                  }}
                >
                  {t(f.title)}
                </Typography>
              </Stack>
            ))}
          </Stack>

          {/* Social proof */}
          <Stack spacing="2px">
            <Stack direction="row" alignItems="center" gap="4px">
              {/* Avatar stack — mobile: 28px / desktop: 36px container */}
              <Stack direction="row" alignItems="center">
                {SOCIAL_AVATARS.map((src, i) => (
                  <Box
                    key={i}
                    sx={{
                      width: { xs: 28, md: 36 },
                      height: { xs: 28, md: 36 },
                      borderRadius: "50%",
                      border: "2px solid",
                      borderColor: "background.paper",
                      overflow: "hidden",
                      ml: i === 0 ? 0 : { xs: "-6px", md: "-8px" },
                      flexShrink: 0,
                    }}
                  >
                    <CustomImageContainer
                      src={src}
                      alt={`user ${i + 1}`}
                      width="100%"
                      height="100%"
                      objectfit="cover"
                    />
                  </Box>
                ))}
              </Stack>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 600,
                  lineHeight: 1.3,
                  color: "neutral.500",
                  whiteSpace: "nowrap",
                }}
              >
                +12k
              </Typography>
            </Stack>
            <Typography
              sx={{
                fontSize: { xs: "12px", md: "14px" },
                fontWeight: 400,
                lineHeight: { xs: 1.2, md: 1.3 },
                letterSpacing: { xs: "-0.36px", md: 0 },
                color: "neutral.500",
              }}
            >
              {t("Trusted by thousands of Users worldwide")}
            </Typography>
          </Stack>
        </Stack>

        {/* Mobile: image between content and CTA */}
        <Box
          sx={{ display: { xs: "flex", md: "none" }, justifyContent: "center" }}
        >
          <Box
            component="img"
            src={heroData?.intro?.image_full_url || ""}
            alt="RideShare App"
            sx={{
              width: "210px",
              height: "190px",
              objectFit: "contain",
              display: "block",
            }}
          />
        </Box>

        {/* CTA Button — mobile: full width 40px / desktop: fit-content 44px */}
        <Box
          onClick={handleAppUrlClick}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            height: { xs: "40px", md: "44px" },
            pl: "20px",
            pr: "12px",
            py: "6px",
            borderRadius: "8px",
            backgroundColor: "primary.main",
            cursor: "pointer",
            width: { xs: "100%", md: "fit-content" },
            "&:hover": { opacity: 0.9 },
            userSelect: "none",
          }}
        >
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 700,
              letterSpacing: "-0.48px",
              lineHeight: 1.1,
              color: "#fff",
              textTransform: "capitalize",
              whiteSpace: "nowrap",
            }}
          >
            {activeTab === "customer" ? t("Take a Ride") : t("Join as Rider")}
          </Typography>
          <i
            className="fi fi-rr-arrow-small-right"
            style={{
              fontSize: "20px",
              lineHeight: 1,
              display: "flex",
              color: "#fff",
            }}
          />
        </Box>
      </Stack>

      {/* ── Desktop only: Right image ── */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flexShrink: 0,
          alignSelf: "flex-end",
          justifyContent: "flex-end",
        }}
      >
        <Box
          component="img"
          src={heroData?.intro?.image_full_url || ""}
          alt="RideShare App"
          sx={{
            width: "380px",
            height: "auto",
            display: "block",
            objectFit: "contain",
          }}
        />
      </Box>
    </Box>
  );
};

export default RideShareIntroBanner;
