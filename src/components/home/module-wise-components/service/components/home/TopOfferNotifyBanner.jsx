import React from "react";
import { Box, IconButton, Stack, Typography, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import ServiceIcon from "../svg/ServiceIcon";
import { useTranslation } from "react-i18next";

const TopOfferNotifyBanner = ({ title, subtitle, onClick, bannerSx, ...props }) =>  {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();

  const defaultTitle = t("Post for Customised Service");
  const defaultSubtitle = t("Create a request with your own description and additional instructions.");

  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }
    const moduleParam =
      typeof router.query.module === "string"
        ? router.query.module
        : getCurrentModuleType() || "service";
    router.push(`/home/offers?module=${moduleParam}`);
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        width: "100%",
        backgroundColor: theme.palette.mode === "dark" ? "rgba(13, 110, 253, 0.15)" : "#DBE9FF",
        border: theme.palette.mode === "dark" ? "1px solid rgba(13, 110, 253, 0.3)" : "1px solid #B4D3FF",
        borderRadius: { xs: "12px", sm: "16px" },
        padding: { xs: "12px", sm: "16px" },
        display: "flex",
        alignItems: "center",
        gap: { xs: "6px", sm: "8px" },
        overflow: "hidden",
        cursor: "pointer",
        ...bannerSx,
      }}
      {...props}
    >
      {/* Icon */}
      <Box sx={{ flexShrink: 0, display: "flex" }}>
        <ServiceIcon />
      </Box>

      {/* Text */}
      <Stack
        sx={{ flex: 1, minWidth: 0, gap: "4px", px: { xs: "4px", sm: "8px" } }}
      >
        <Typography
          sx={{
            fontSize: { xs: "14px", sm: "16px", md: "18px" },
            fontWeight: 700,
            color: "neutral.1050",
            lineHeight: 1.1,
            letterSpacing: "-0.54px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: { xs: "normal", sm: "nowrap" },
            display: { xs: "-webkit-box", sm: "block" },
            WebkitLineClamp: { xs: 2 },
            WebkitBoxOrient: "vertical",
          }}
        >
          {title || defaultTitle}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: "12px", sm: "13px", md: "14px" },
            fontWeight: 400,
            color: "neutral.500",
            lineHeight: 1.3,
            display: { sm: "block" },
          }}
        >
          {subtitle || defaultSubtitle }
        </Typography>
      </Stack>

      {/* Arrow button */}
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          handleClick();
        }}
        sx={{
          width: { xs: 36, sm: 44 },
          height: { xs: 36, sm: 44 },
          borderRadius: { xs: "10px", sm: "16px" },
          flexShrink: 0,
          color: "neutral.1050",
        }}
      >
        <i
          className="fi fi-rs-arrow-small-right"
          style={{ fontSize: "20px", lineHeight: 1, display: "flex" }}
        />
      </IconButton>
    </Box>
  );
};

export default TopOfferNotifyBanner;
