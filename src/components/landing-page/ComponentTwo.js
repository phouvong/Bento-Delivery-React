import {
  alpha,
  Box,
  Grid,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CustomContainer from "../container";
import DownloadApps from "./DownloadApps";
import SolutionSvg from "./SolutionSvg";

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

const ComponentTwo = ({ landingPageData }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <>
      {(Number.parseInt(
        landingPageData?.download_user_app_links?.playstore_url_status
      ) === 1 ||
        Number.parseInt(
          landingPageData?.download_user_app_links?.apple_store_url_status
        ) === 1) && (
        <CustomContainer>
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            sx={{
              background: `linear-gradient(180deg, ${alpha(
                theme.palette.primary.main,
                0.1
              )} 0%, ${alpha(theme.palette.primary.main, 0.3)} 100%)`,
              // background: `linear-gradient(180deg, rgba(3, 157, 85, 0.10) 0%, rgba(3, 157, 85, 0.30) 100%)`,
            }}
          >
            <Grid
              item
              xs={12}
              sm={12}
              md={5}
              align={isSmall ? "center" : "left"}
            >
              <Box
                sx={{
                  position: "relative",
                  width: { xs: "223px", md: "440px" },
                  height: { xs: "150px", md: "380px" },
                }}
              >
                <SolutionSvg />
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              align={isSmall ? "center" : "left"}
            >
              <DownloadApps
                theme={theme}
                isSmall={isSmall}
                landingPageData={landingPageData}
              />
            </Grid>
          </Grid>
        </CustomContainer>
      )}
    </>
  );
};

export default ComponentTwo;
