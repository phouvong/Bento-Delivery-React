import { Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import Subscribe from "./Subscribe";
import { useTranslation } from "react-i18next";

const FooterTop = (props) => {
  const { landingPageData } = props;
  const { t } = useTranslation();

  return (
    <Box>
      <Box
        sx={{
          maxWidth: "1312px",
          mx: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "flex-start", md: "center" },
            gap: { xs: "20px", md: "50px" },
            backgroundColor: "background.secondary",
            borderRadius: "20px",
            px: { xs: "24px", md: "40px" },
            py: "25px",
          }}
        >
          {/* Left: text */}
          <Stack gap="10px" sx={{ flexShrink: 0, width: { xs: "100%", md: "439px" } }}>
            <Typography
              sx={{
                fontSize: "24px",
                fontWeight: 700,
                color: "neutral.1050",
                lineHeight: 1.1,
                letterSpacing: "-1.2px",
              }}
            >
              {landingPageData?.footer_section?.fixed_newsletter_title ?? t("Join Us!")}
            </Typography>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 400,
                color: "neutral.500",
                lineHeight: 1.3,
              }}
            >
              {landingPageData?.footer_section?.fixed_newsletter_sub_title}
            </Typography>
          </Stack>

          {/* Right: subscribe input */}
          <Box sx={{ flex: 1, width: { xs: "100%", md: "auto" } }}>
            <Subscribe />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

FooterTop.propTypes = {};

export default FooterTop;
