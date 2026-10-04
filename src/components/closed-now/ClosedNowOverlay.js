import React from "react";
import { alpha, Stack } from "@mui/system";
import { Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

const ClosedNowOverlay = ({ borderRadius }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <Stack
      sx={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        background: (theme) => alpha(theme.palette.primary.overLay, 0.65),

        color: (theme) => theme.palette.neutral[100],
        padding: "10px",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: borderRadius ? borderRadius : ".5rem",
      }}
    >
      <Typography
        align="center"
        color={
          theme.palette.mode === "dark"
            ? theme.palette.neutral[1000]
            : theme.palette.neutral[100]
        }
        fontWeight="700"
        sx={{
          fontSize: "11px",
          lineHeight: 1.2,
          letterSpacing: "-0.2px",
        }}
      >
        {t("Closed")}
      </Typography>
    </Stack>
  );
};

ClosedNowOverlay.propTypes = {};

export default ClosedNowOverlay;
