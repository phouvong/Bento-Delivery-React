import { IconButton, NoSsr, Typography, useTheme } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { t } from "i18next";
import { useRouter } from "next/router";
import CustomImageContainer from "../CustomImageContainer";
import { Facebook, Instragram, LinkedIn, Pinterest, Twitter } from "./footer-middle/Icon";

const FooterBottom = ({ configData }) => {
  const theme = useTheme();
  const router = useRouter();

  const handleClickToRoute = (href) => {
    router.push(href, undefined, { shallow: true });
  };

  const iconHandler = (name) => {
    switch (name) {
      case "facebook":  return <Facebook />;
      case "instagram": return <Instragram />;
      case "twitter":   return <Twitter />;
      case "linkedin":  return <LinkedIn />;
      case "pinterest": return <Pinterest />;
      default:          return <Twitter />;
    }
  };

  const socialIcons = (
    <Stack direction="row" alignItems="center" gap="16px" sx={{ flexShrink: 0 }}>
      {configData?.social_media?.map((item, index) => (
        <IconButton
          key={index}
          onClick={() => window.open(item.link)}
          sx={{
            padding: 0,
            color: theme.palette.primary.icon,
            transition: "all ease 0.3s",
            "&:hover": {
              transform: "scale(1.14)",
              color: theme.palette.primary.main,
              backgroundColor: "transparent",
            },
          }}
        >
          {iconHandler(item.name)}
        </IconButton>
      ))}
    </Stack>
  );

  const policyLinks = ({ mobile } = {}) => (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: mobile ? "center" : "flex-end",
        columnGap: mobile ? "20px" : "40px",
        rowGap: mobile ? "4px" : "8px",
        flexShrink: 0,
      }}
    >
      {[
        { label: "Privacy Policy", href: "/privacy-policy", show: true },
        { label: "Refund Policy", href: "/refund-policy", show: configData?.refund_policy !== 0 },
        { label: "Cancellation Policy", href: "/cancellation-policy", show: configData?.cancelation_policy !== 0 },
        { label: "Shipping Policy", href: "/shipping-policy", show: configData?.shipping_policy !== 0 },
      ].map(
        ({ label, href, show }) =>
          show && (
            <Typography
              key={href}
              onClick={() => handleClickToRoute(href)}
              sx={{
                fontSize: mobile ? "12px" : "14px",
                fontWeight: mobile ? 600 : 400,
                color: "neutral.1050",
                lineHeight: 1.2,
                letterSpacing: mobile ? "-0.24px" : 0,
                whiteSpace: "nowrap",
                cursor: "pointer",
                "&:hover": { color: "primary.main" },
              }}
            >
              {t(label)}
            </Typography>
          )
      )}
    </Box>
  );

  return (
    <NoSsr>
      <Box sx={{ backgroundColor: "background.secondary", width: "100%" }}>

        {/* ── MOBILE ── */}
        <Stack
          gap="20px"
          alignItems="center"
          sx={{
            display: { xs: "flex", md: "none" },
            py: "20px",
            px: "16px",
          }}
        >
          {socialIcons}
          <Stack gap="12px" alignItems="center">
            <CustomImageContainer
              src={configData?.logo_full_url}
              alt={configData?.business_name}
              width="auto"
              height="16px"
              objectfit="contain"
            />
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 400,
                color: "neutral.1050",
                lineHeight: 1.2,
                letterSpacing: "-0.36px",
                whiteSpace: "nowrap",
                textAlign: "center",
              }}
            >
              {configData?.footer_text}
            </Typography>
          </Stack>
          {policyLinks({ mobile: true })}
        </Stack>

        {/* ── DESKTOP ── */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            maxWidth: "1312px",
            mx: "auto",
            px: 0,
            py: "20px",
            alignItems: "center",
            gap: "48px",
          }}
        >
          {socialIcons}

          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 400,
              color: "neutral.1050",
              lineHeight: 1.3,
              whiteSpace: "nowrap",
              flex: 1,
            }}
          >
            {configData?.footer_text}
          </Typography>

          {policyLinks()}
        </Box>

      </Box>
    </NoSsr>
  );
};

FooterBottom.propTypes = {};

export default FooterBottom;
