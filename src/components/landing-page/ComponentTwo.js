import {
  alpha,
  Box,
  Grid,
  Stack,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CustomContainer from "../container";
import DownloadApps from "./DownloadApps";
import SolutionSvg from "./SolutionSvg";
import { t } from "i18next";
import QRCodeClient from "./QRCodeClients";
import AppLinks from "components/footer/footer-middle/AppLinks";
import NextImage from "components/NextImage";

export const ComponentTwoContainer = styled(Box)(
  ({ theme, paddingTop, paddingBottom }) => ({
    marginTop: ".6rem",
    paddingTop: paddingTop ? paddingTop : "1.5rem",
    paddingBottom: paddingBottom ? paddingBottom : "1rem",
    background: `linear-gradient(180deg, ${alpha(
      theme.palette.primary.main,
      0
    )} 0%, ${alpha(theme.palette.primary.main, 0.15)} 100%)`,
  })
);

const ComponentTwo = ({ user_app_download_section }) => {
  const theme = useTheme();
  return (
    <>
      <CustomContainer>
        <Grid container py={{ xs: "1rem", md: "3.2rem" }} spacing={{ xs: "1rem", sm: "0px" }}>
          <Grid item xs={12} md={6} >
            <Stack gap={{ xs: ".5rem", md: '1.3rem' }} alignItems="center" >
              <Box>
                <Typography fontSize={{ xs: "18px", md: "30px" }} marginBottom="10px" fontWeight="600" lineHeight="1.4" textAlign={{ xs: "center", md: "left" }}>
                  {user_app_download_section?.download_user_app_title}
                </Typography>
                <Typography color={theme.palette.neutral[500]} fontSize={{ xs: "13px", md: "16px" }} textAlign={{ xs: "center", md: "left" }}>
                  {user_app_download_section?.download_user_app_sub_title}
                </Typography>
              </Box>
              <Stack width="100%" alignItems="center" direction={{ xs: "column", md: "row" }} gap="1rem" p="1.3rem"
                backgroundColor={theme.palette.background.custom7} border="1px solid"
                borderRadius="1rem"
                borderColor={theme.palette.neutral[300]}
              >
                <Box sx={{
                  padding: { xs: "10px", md: "16px" },
                  background: theme.palette.neutral[100],
                  borderRadius: "10px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <QRCodeClient
                    size={70}
                    playStoreLink={
                      user_app_download_section?.download_user_app_links?.playstore_url_status ===
                      "1" &&
                      user_app_download_section?.download_user_app_links?.playstore_url
                    }
                    appStoreLink={
                      user_app_download_section?.download_user_app_links?.apple_store_url_status ===
                      "1" &&
                      user_app_download_section?.download_user_app_links?.apple_store_url
                    }
                  />
                  <Typography color={theme.palette.neutral[500]} pt="5px" textAlign="center">
                    {t("Scan to Download")}
                  </Typography>
                </Box>
                <Box>
                  <Typography color={theme.palette.neutral[1000]} textAlign="center" fontSize="18px" fontWeight="500" >
                    {t("Download the Customer App")}
                  </Typography>
                  <Typography marginBottom="1rem" textAlign="center" color={theme.palette.neutral[500]} fontSize="14px" >
                    {t("Smart shopping starts here.")}
                  </Typography>
                  <AppLinks landingPageData={{
                    app_store_link: user_app_download_section?.download_user_app_links?.apple_store_url,
                    play_store_link: user_app_download_section?.download_user_app_links?.playstore_url,
                    app_status: user_app_download_section?.download_user_app_links?.apple_store_url_status,
                    play_status: user_app_download_section?.download_user_app_links?.playstore_url_status
                  }} />
                </Box>
              </Stack>
            </Stack>

          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            display="flex"
            justifyContent={{ xs: "center", md: "flex-end" }} // 👈 Align right on desktop, center on mobile
            alignItems="center"
            sx={{
              img: {
                maxWidth: "450px",
                height: "100%",
                width: "100%",
              }
            }}
          >
            <NextImage
              src={user_app_download_section?.download_user_app_image_full_url}
              alt="banners"
              height={360}
              width={450}
              objectFit="cover"
              borderRadius="5px"
            />
          </Grid>
        </Grid>
      </CustomContainer >

    </>
  );
};

export default ComponentTwo;
