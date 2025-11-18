import {
  Button,
  Grid,
  Stack,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha, Box } from "@mui/system";
import CustomImageContainer from "../CustomImageContainer";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import QRCodeClient from "./QRCodeClients";
import { t } from "i18next";
import AppLinks from "components/footer/footer-middle/AppLinks";
import DollarSignHighlighter from "components/DollarSignHighlighter";
import Link from "next/link";

export const ImageContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "175px",
  height: "175px",
  [theme.breakpoints.down("md")]: {
    width: "110px",
    height: "110px",
  },
  [theme.breakpoints.down("sm")]: {
    width: "95px",
    height: "95px",
  },
}));


const Registration = ({ seller_app_download_section }) => {
  const theme = useTheme();
  return (
    <Box sx={{
      p: { xs: "16px", md: "30px" },
      boxShadow: "0px 8px 15px 0px #1C1E2008, 0px 0px 2px 0px #1C1E2014",
      borderRadius: "10px",
      background: theme => theme.palette.neutral[100],
      width: "100%",
      my:{xs:".5rem",md:"1rem"}

    }}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid container item xs={12} md={7} alignItems="center" spacing={2.5} justifyContent={{ xs: "center", md: "flex-start" }}>
          <Grid item xs={12} md={3.4} sx={{ display: "flex", justifyContent: { xs: "center", md: "flex-start" } }}>
            <ImageContainer>
              <CustomImageContainer
                src={seller_app_download_section?.download_seller_app_image_full_url}
                alt="delivery man"
                width="100%"
                height="100%"
              />
            </ImageContainer>
          </Grid>
          <Grid item xs={12} md={8.6} sx={{ textAlign: { xs: "center", md: "left" } }}>
            <Typography variant="h4" fontSize={{ xs: "18px", md: "30px" }} sx={{ fontWeight: "600" }}>
              <DollarSignHighlighter
                text={seller_app_download_section?.download_seller_app_title}
                theme={theme}
              />
            </Typography>
            <Typography my=".7rem" sx={{ maxWidth: "400px" }} >
              {seller_app_download_section?.download_seller_app_sub_title}
            </Typography>
            <Link href={{ pathname: "/store-registration", query: { active: "active" } }} prefetch={false}>
              <Button variant="contained" sx={{ borderRadius: "10px", padding: "7px 16px",marginBottom:{xs:"1rem",sm:"0px"} }}>
                {seller_app_download_section?.download_seller_app_content_button_title || "Start Selling"}
                <ArrowForwardIcon sx={{ ml: 1, fontSize: "20px" }} />
              </Button>
            </Link>
          </Grid>

        </Grid>
        <Grid item xs={12} md={5} alignItems="center" spacing={2} sx={{}}>
          <Stack alignItems="center" >
            <Box>
              <Typography fontSize={{ xs: "20px", md: "30px" }} fontWeight="600" lineHeight="1.4" textAlign={{ xs: "center", md: "left" }}>
                {seller_app_download_section?.download_seller_app_links?.download_user_app_title}
              </Typography>
              <Typography color={theme.palette.neutral[500]} fontSize="16px" textAlign={{ xs: "center", md: "left" }}>
                {seller_app_download_section?.download_seller_app_links?.download_user_app_sub_title}
              </Typography>
            </Box>
            <Stack width="100%" alignItems="center" direction={{ xs: "column", md: "row" }} gap="1rem" p={{ xs: "1rem", md: "1.3rem" }}
              backgroundColor={alpha(theme.palette.neutral[200], .5)} border="1px solid"
              borderRadius="1rem"
              borderColor={theme.palette.neutral[300]}
            >
              <Box sx={{
                padding: "10px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: theme.palette.neutral[100],
                borderRadius: "10px",
                gap: "8px"
              }}>
                <QRCodeClient
                  size={70}
                  playStoreLink={
                    seller_app_download_section?.download_seller_app_links?.playstore_url_status === 1
                      ? seller_app_download_section?.download_seller_app_links?.playstore_url
                      : null
                  }
                  appStoreLink={
                    seller_app_download_section?.download_seller_app_links?.apple_store_url_status === 1
                      ? seller_app_download_section?.download_seller_app_links?.apple_store_url
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
              <Box >
                <Typography color={theme.palette.neutral[1000]} textAlign="center" fontSize="18px" fontWeight="500" >
                  {t("Download the Customer App")}
                </Typography>
                <Typography marginBottom={{ xs: ".6rem", md: "1rem" }} textAlign="center" color={theme.palette.neutral[500]} fontSize="14px" >
                  {t("Smart shopping starts here.")}
                </Typography>
                <AppLinks landingPageData={{
                  app_store_link: seller_app_download_section?.download_seller_app_links?.apple_store_url,
                  play_store_link: seller_app_download_section?.download_seller_app_links?.playstore_url,
                  app_status: seller_app_download_section?.download_seller_app_links?.apple_store_url_status,
                  play_status: seller_app_download_section?.download_seller_app_links?.playstore_url_status
                }} />
              </Box>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Box >
  )
}
export default Registration;
