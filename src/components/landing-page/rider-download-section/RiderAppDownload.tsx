import React from "react";
import { Box, Typography, Grid, useTheme, Stack } from "@mui/material";
import { t } from "i18next";

import { ImageContainer } from "../Registration";
import CustomImageContainer from "components/CustomImageContainer";
import QRCodeClient from "../QRCodeClients";
import AppLinks from "components/footer/footer-middle/AppLinks";
import DollarSignHighlighter from "components/DollarSignHighlighter";

interface RiderAppDownloadProps {
  riderApp?: any;
}

const RiderAppDownload: React.FC<RiderAppDownloadProps> = ({ riderApp }) => {
  const theme = useTheme();
  const appLinks = riderApp?.download_rider_app_links || riderApp?.download_dm_app_links;
  const sectionImage =
    riderApp?.download_rider_app_image_full_url ||
    riderApp?.download_dm_app_image_full_url;
  const sectionTitle = riderApp?.download_rider_app_title || riderApp?.download_dm_app_title;
  const sectionSubTitle =
    riderApp?.download_rider_app_sub_title || riderApp?.download_dm_app_sub_title;
  const downloadButtonTitle =
    riderApp?.download_rider_app_button_title || riderApp?.download_dm_app_button_title;
  const downloadButtonSubTitle =
    riderApp?.download_rider_app_button_sub_title ||
    riderApp?.download_dm_app_button_sub_title;

  return (
    <Box
      sx={{
        py: { xs: 0, md: 3 },
      }}
    >
      <Grid container spacing={{ xs: 2, md: 4 }}>
        <Grid item xs={12} md={4} alignSelf="center">
          <Stack
            gap={{ xs: ".8rem", md: "1.3rem" }}
            padding={{ xs: "10px", md: "1rem" }}
            alignItems="center"
            sx={{
              backgroundColor: (currentTheme) => currentTheme.palette.neutral[100],
              borderRadius: "10px",
            }}
          >
            <Box>
              <Typography
                fontSize={{ xs: "16px", md: "18px" }}
                fontWeight="500"
                lineHeight="1.4"
                textAlign={{ xs: "center" }}
              >
                {downloadButtonTitle}
              </Typography>
              <Typography
                color={theme.palette.neutral[500]}
                fontSize="14px"
                textAlign={{ xs: "center" }}
              >
                {downloadButtonSubTitle}
              </Typography>
            </Box>
            <Box
              sx={{
                padding: "10px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: theme.palette.neutral[300],
                borderRadius: "10px",
                gap: "8px",
              }}
            >
              <QRCodeClient
                size={70}
                playStoreLink={
                  appLinks?.playstore_url_status === 1 ? appLinks?.playstore_url : null
                }
                appStoreLink={
                  appLinks?.apple_store_url_status === 1 ? appLinks?.apple_store_url : null
                }
              />
              <Typography
                color={theme.palette.neutral[500]}
                fontSize="14px"
                textAlign="center"
              >
                {t("Scan to Download")}
              </Typography>
            </Box>
            <AppLinks
              landingPageData={{
                app_store_link: appLinks?.apple_store_url,
                play_store_link: appLinks?.playstore_url,
                app_status: appLinks?.apple_store_url_status,
                play_status: appLinks?.playstore_url_status,
              }}
            />
          </Stack>
        </Grid>
        <Grid
          container
          item
          xs={12}
          md={8}
          alignItems="center"
          spacing={2.5}
          justifyContent={{ xs: "center", md: "flex-end" }}
        >
          <Grid
            item
            xs={12}
            md={8}
            sx={{ textAlign: { xs: "center", md: "center" } }}
          >
            <Typography
              variant="h4"
              fontSize={{ xs: "18px", md: "30px" }}
              sx={{ fontWeight: "600" }}
            >
              <DollarSignHighlighter text={sectionTitle} theme={theme} />
            </Typography>
            <Typography
              fontSize={{ xs: "12px", md: "16px" }}
              fontWeight={{ xs: "400" }}
              color={theme.palette.neutral[400]}
              paddingTop={{ xs: "10px", md: "0px" }}
              textAlign={{ xs: "center", md: "center" }}
              dangerouslySetInnerHTML={{
                __html: sectionSubTitle,
              }}
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              display: "flex",
              justifyContent: { xs: "center", md: "flex-end" },
            }}
          >
            <ImageContainer
              sx={{
                width: { xs: "100%", md: "288px" },
                height: { xs: "100%", md: "300px" },
                borderRadius: "10px",
              }}
            >
              <CustomImageContainer
                src={sectionImage}
                alt="rider app"
                width="100%"
                height="100%"
                cursor="pointer"
                mdHeight="300px"
                maxWidth="288px"
                objectfit="cover"
                minwidth="auto"
                borderRadius="10px"
                marginBottom="0"
                smHeight="100%"
                smMb="0"
                smMaxWidth="100%"
                smWidth="100%"
                aspectRatio="auto"
                padding="0"
                loading="lazy"
                bg="transparent"
                borderBottomRightRadius="10px"
              />
            </ImageContainer>
          </Grid>
        </Grid>

        
      </Grid>
    </Box>
  );
};

export default RiderAppDownload;
