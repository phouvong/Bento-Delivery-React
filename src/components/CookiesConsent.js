import React, { useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const CookiesConsent = ({ text }) => {
  const [showConsent, setShowConsent] = useState(true);
  const { t } = useTranslation();

  const handleAccept = () => {
    localStorage.setItem("cookiesConsent", "true");
    setShowConsent(false);
  };
  const handleDeny = () => {
    localStorage.setItem("cookiesConsent", "false");
    setShowConsent(false);
  };

  let cookiesConsent;
  if (typeof window !== "undefined") {
    cookiesConsent = window.localStorage.getItem("cookiesConsent");
  }

  if (!showConsent || cookiesConsent === "true") {
    return null;
  }

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: { xs: 0, md: "24px" },
        right: { xs: 0, md: "24px" },
        left: { xs: 0, md: "auto" },
        zIndex: 9999,
        width: { xs: "100%", md: "360px" },
        borderRadius: { xs: "20px 20px 0 0", md: "20px" },
        backgroundColor: "background.paper",
        boxShadow: "0px 0px 16px -1px rgba(0,0,0,0.10)",
        overflow: "hidden",
      }}
    >
      <Stack spacing="20px" sx={{ p: "24px" }}>
        {/* Title + description */}
        <Stack spacing="4px">
          <Typography
            sx={{
              fontSize: "24px",
              fontWeight: 700,
              letterSpacing: "-1.2px",
              lineHeight: 1.1,
              color: "neutral.1050",
            }}
          >
            {t("Accept Cookies.")}
          </Typography>
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: 1.3,
              color: "neutral.500",
            }}
          >
            {text}
          </Typography>
        </Stack>

        {/* Buttons */}
        <Stack direction="row" spacing="20px">
          <Box
            id="cookies-deny-btn"
            onClick={handleDeny}
            sx={{
              flex: 1,
              height: "44px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "12px",
              backgroundColor: "background.secondary",
              cursor: "pointer",
              "&:hover": { opacity: 0.85 },
            }}
          >
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 700,
                letterSpacing: "-0.48px",
                lineHeight: 1.1,
                color: "neutral.1050",
                textTransform: "capitalize",
              }}
            >
              {t("Deny")}
            </Typography>
          </Box>

          <Box
            id="cookies-accept-btn"
            onClick={handleAccept}
            sx={{
              flex: 1,
              height: "44px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "12px",
              backgroundColor: "primary.main",
              cursor: "pointer",
              "&:hover": { opacity: 0.9 },
            }}
          >
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 700,
                letterSpacing: "-0.48px",
                lineHeight: 1.1,
                color: "primary.contrastText",
                textTransform: "capitalize",
              }}
            >
              {t("Accept")}
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

export default CookiesConsent;
