import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Stack,
} from "@mui/material";
import { CheckCircle, ArrowForward, Android, Apple } from "@mui/icons-material";
import { ImageContainer } from "../Registration";
import CustomImageContainer from "components/CustomImageContainer";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import QRCodeClient from "../QRCodeClients";
import { t } from "i18next";
import AppLinks from "components/footer/footer-middle/AppLinks";
import DollarSignHighlighter from "components/DollarSignHighlighter";
import Link from "next/link";
interface DeliveryManAppDownloadProps {
  title?: string;
  subtitle?: string;
  image?: string;
  deliveryManApp?: any;
}

const DeliveryManAppDownload: React.FC<DeliveryManAppDownloadProps> = ({
  deliveryManApp,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        py: { xs: 0, md: 3 },
      }}
    >
      <Grid container spacing={{ xs: 2, md: 4 }}>
        <Grid
          container
          item
          xs={12}
          md={8}
          alignItems="center"
          spacing={2.5}
          justifyContent={{ xs: "center", md: "flex-start" }}
        >
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              display: "flex",
              justifyContent: { xs: "center", md: "flex-start" },
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
                src={deliveryManApp?.download_dm_app_image_full_url}
                alt="delivery man"
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
          <Grid
            item
            xs={12}
            md={8}
            sx={{ textAlign: { xs: "center", md: "left" } }}
          >
            <Typography
              variant="h4"
              fontSize={{ xs: "18px", md: "30px" }}
              sx={{ fontWeight: "600" }}
            >
              <DollarSignHighlighter
                text={deliveryManApp?.download_dm_app_title}
                theme={theme}
              />
            </Typography>
            <Typography
              fontSize={{ xs: "12px", md: "16px" }}
              fontWeight={{ xs: "400" }}
              color={theme.palette.neutral[400]}
              paddingTop={{ xs: "10px", md: "0px" }}
              textAlign={{ xs: "center", md: "left" }}
              dangerouslySetInnerHTML={{
                __html: deliveryManApp?.download_dm_app_sub_title,
              }}
            />

            <Link
              href={{ pathname: "/deliveryman-registration" }}
              prefetch={false}
            >
              <Button
                variant="contained"
                sx={{
                  borderRadius: "10px",
                  padding: "7px 16px",
                  marginTop: "10px",
                }}
              >
                {deliveryManApp?.download_dm_app_content_button_title ||
                  "Start Selling"}
                <ArrowForwardIcon sx={{ ml: 1, fontSize: "20px" }} />
              </Button>
            </Link>
          </Grid>
        </Grid>

        {/* Download Section */}
        <Grid item xs={12} md={4} alignSelf="center">
          <Stack
            gap={{ xs: ".8rem", md: "1.3rem" }}
            padding={{ xs: "10px", md: "1rem" }}
            alignItems="center"
            sx={{
              backgroundColor: (theme) => theme.palette.neutral[100],
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
                {deliveryManApp?.download_dm_app_button_title}
              </Typography>
              <Typography
                color={theme.palette.neutral[500]}
                fontSize="14px"
                textAlign={{ xs: "center" }}
              >
                {deliveryManApp?.download_dm_app_button_sub_title}
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
                  deliveryManApp?.download_seller_app_links
                    ?.playstore_url_status === 1
                    ? deliveryManApp?.download_seller_app_links?.playstore_url
                    : null
                }
                appStoreLink={
                  deliveryManApp?.download_seller_app_links
                    ?.apple_store_url_status === 1
                    ? deliveryManApp?.download_seller_app_links?.apple_store_url
                    : null
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
                app_store_link:
                  deliveryManApp?.download_dm_app_links?.apple_store_url,
                play_store_link:
                  deliveryManApp?.download_dm_app_links?.playstore_url,
                app_status:
                  deliveryManApp?.download_dm_app_links?.apple_store_url_status,
                play_status:
                  deliveryManApp?.download_dm_app_links?.playstore_url_status,
              }}
            />
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DeliveryManAppDownload;
