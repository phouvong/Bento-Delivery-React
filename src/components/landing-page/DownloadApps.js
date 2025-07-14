import { alpha, Typography } from "@mui/material";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import DollarSignHighlighter from "../DollarSignHighlighter";
import AppLinks from "../footer/footer-middle/AppLinks";

const DownloadApps = ({ theme, isSmall, landingPageData }) => {
  return (
    <CustomStackFullWidth
      alignItems={isSmall ? "center" : "flex-start"}
      justifyContent="center"
      gap={{ xs: "10px", sm: "15px" }}
      paddingBottom={{ xs: "20px", md: "0px" }}
    >
      <Typography
        textAlign="flex-start"
        fontSize={isSmall ? "14px" : "26px"}
        fontWeight={600}
        component="h2"
      >
        <DollarSignHighlighter
          theme={theme}
          text={landingPageData?.download_user_app_title}
        />
      </Typography>
      <Typography
        textAlign="flex-start"
        fontSize={isSmall ? "12px" : "18px"}
        sx={{ color: (theme) => alpha(theme.palette.neutral[500], 0.8) }}
      >
        <DollarSignHighlighter
          theme={theme}
          text={landingPageData?.download_user_app_sub_title}
        />
      </Typography>
      <AppLinks landingPageData={landingPageData} graybackground />
    </CustomStackFullWidth>
  );
};
DownloadApps.propTypes = {};

export default DownloadApps;
