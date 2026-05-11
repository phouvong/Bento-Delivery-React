import {
  Box,
  Button,
  IconButton,
  Stack,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import NextImage from "components/NextImage";
import QRCodeClient from "components/landing-page/QRCodeClients";
import playstoreIcon from "public/static/footer/playstore.svg";
import appleIcon from "public/static/footer/apple.svg";
import mobileAppBannerBg from "./assets/mobileAppBanner.svg";
import useGetAppDownloadSection from "api-manage/hooks/react-query/useGetAppDownloadSection";

const bgSrc =
  typeof mobileAppBannerBg === "string"
    ? mobileAppBannerBg
    : (mobileAppBannerBg as any)?.src;

const BannerWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  minHeight: "150px",
  borderRadius: "12px",
  background:
    theme.palette.mode === "dark"
      ? theme.palette.neutral[200]
      : theme.palette.neutral[1000],
  position: "relative",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "20px 30px",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    backgroundImage: `url(${bgSrc})`,
    backgroundSize: "cover",
    backgroundPosition: "center right",
    backgroundRepeat: "no-repeat",
    opacity: theme.palette.mode === "dark" ? 0.08 : 1,
    zIndex: 0,
  },
  [theme.breakpoints.down("sm")]: {
    padding: "16px",
  },
}));

const StoreButton = styled(Button)(({ theme }) => ({
  height: "40px",
  padding: "6px 16px",
  borderRadius: "6px",
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.15)"
      : theme.palette.neutral[100],
  color:
    theme.palette.mode === "dark" ? "#ffffff" : theme.palette.neutral[1000],
  textTransform: "none",
  flexShrink: 0,
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.25)"
        : theme.palette.neutral[200],
  },
  [theme.breakpoints.down("sm")]: {
    height: "36px",
    padding: "4px 12px",
  },
}));

const DEFAULT_TITLE = "Download the 6amMart App for Exclusive Rewards!";

const MobileAppBanner = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [dismissed, setDismissed] = useState(false);
  const { data } = useGetAppDownloadSection();
console.log({data});

  const sectionEnabled = Number(data?.download_user_app_section_status) === 1;
  const title = data?.download_user_app_title || DEFAULT_TITLE;
  const { playstore_url, apple_store_url } =
    data?.download_user_app_links ?? {};

  if (!sectionEnabled || dismissed) return null;

  return (
    <BannerWrapper>
      <IconButton
        size="small"
        onClick={() => setDismissed(true)}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 2,
          color: "#ffffff",
          "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      {/* Mobile layout: column — QR top, title, buttons bottom */}
      <Stack
        sx={{ display: { xs: "flex", sm: "none" }, position: "relative", zIndex: 1, width: "100%" }}
        direction="column"
        alignItems="center"
        gap={1.5}
      >
        <QRCodeClient
          playStoreLink={playstore_url || ""}
          appStoreLink={apple_store_url || ""}
          size={80}
        />
        <Typography
          variant="h6"
          fontWeight={600}
          color="#ffffff"
          textAlign="center"
          sx={{ fontSize: "13px" }}
        >
          {t(title)}
        </Typography>
        <Stack direction="row" gap={1} flexWrap="wrap" justifyContent="center">
          {playstore_url && (
            <StoreButton onClick={() => window.open(playstore_url, "_blank")}>
              <Stack direction="row" alignItems="center" gap={0.8}>
                <NextImage
                  src={playstoreIcon?.src}
                  alt="Google Play"
                  height={20}
                  width={20}
                  objectFit="contain"
                  borderRadius="0"
                  aspectRatio="1"
                />
                <Typography fontSize="13px" fontWeight={600}>
                  {t("Google Play")}
                </Typography>
              </Stack>
            </StoreButton>
          )}
          {apple_store_url && (
            <StoreButton onClick={() => window.open(apple_store_url, "_blank")}>
              <Stack direction="row" alignItems="center" gap={0.8}>
                <Box
                  component="img"
                  src={appleIcon?.src}
                  alt="App Store"
                  sx={{
                    height: 20,
                    width: 20,
                    filter:
                      theme.palette.mode === "dark"
                        ? "none"
                        : "invert(1) brightness(0)",
                  }}
                />
                <Typography fontSize="13px" fontWeight={600}>
                  {t("App Store")}
                </Typography>
              </Stack>
            </StoreButton>
          )}
        </Stack>
      </Stack>

      {/* Desktop layout: row — text+buttons left, QR right */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
        sx={{ display: { xs: "none", sm: "flex" }, position: "relative", zIndex: 1 }}
      >
        <Stack gap={1.5} flex={1}>
          <Typography
            variant="h6"
            fontWeight={600}
            color="#ffffff"
            sx={{ fontSize: { sm: "18px", md: "20px" } }}
          >
            {t(title)}
          </Typography>
          <Stack direction="row" alignItems="center" gap={4} flexWrap="wrap">
            {playstore_url && (
              <StoreButton onClick={() => window.open(playstore_url, "_blank")}>
                <Stack direction="row" alignItems="center" gap={0.8}>
                  <NextImage
                    src={playstoreIcon?.src}
                    alt="Google Play"
                    height={20}
                    width={20}
                    objectFit="contain"
                    borderRadius="0"
                    aspectRatio="1"
                  />
                  <Typography fontSize="13px" fontWeight={600}>
                    {t("Google Play")}
                  </Typography>
                </Stack>
              </StoreButton>
            )}
            {apple_store_url && (
              <StoreButton onClick={() => window.open(apple_store_url, "_blank")}>
                <Stack direction="row" alignItems="center" gap={0.8}>
                  <Box
                    component="img"
                    src={appleIcon?.src}
                    alt="App Store"
                    sx={{
                      height: 20,
                      width: 20,
                      filter:
                        theme.palette.mode === "dark"
                          ? "none"
                          : "invert(1) brightness(0)",
                    }}
                  />
                  <Typography fontSize="13px" fontWeight={600}>
                    {t("App Store")}
                  </Typography>
                </Stack>
              </StoreButton>
            )}
          </Stack>
        </Stack>
        <Box sx={{ paddingInlineEnd: "10px", flexShrink: 0 }}>
          <QRCodeClient
            playStoreLink={playstore_url || ""}
            appStoreLink={apple_store_url || ""}
            size={90}
          />
        </Box>
      </Stack>
    </BannerWrapper>
  );
};

export default MobileAppBanner;
