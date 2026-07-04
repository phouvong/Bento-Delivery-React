import React from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { getAmountWithSign } from "../../helper-functions/CardHelpers";


// Decorative stack of curved horizontal lines that fades in across the
// right side of the banner. Inline so we don't need an asset or
// URL-encoded SVG background.
const WaveDecoration = () => (
  <Box
    component="svg"
    viewBox="0 0 400 80"
    preserveAspectRatio="none"
    xmlns="http://www.w3.org/2000/svg"
    sx={{
      position: "absolute",
      right: 0,
      top: 0,
      height: "100%",
      width: { xs: "45%", md: "55%" },
      pointerEvents: "none",
      opacity: 0.55,
    }}
  >
    <defs>
      <linearGradient id="proWaveFade" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0%" stopColor="#9B7BFF" stopOpacity="0" />
        <stop offset="40%" stopColor="#9B7BFF" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#9B7BFF" stopOpacity="0.9" />
      </linearGradient>
    </defs>
    <g stroke="url(#proWaveFade)" fill="none" strokeWidth="0.45">
      {Array.from({ length: 16 }).map((_, i) => {
        const y = 4 + i * 4.5;
        return (
          <path
            key={i}
            d={`M0,${y} Q 90,${y - 3.5} 180,${y} T 360,${y} T 540,${y}`}
          />
        );
      })}
    </g>
  </Box>
);

// Shown to active Pro members. Three display modes:
// - `message` provided → render it verbatim.
// - `amount` provided  → "You saved $X.XX as a Pro member."
// - Neither            → fallback CTA copy that matches the design.
const ProSavingsBanner = ({ amount, message }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const formattedAmount =
    amount !== undefined && amount !== null ? getAmountWithSign(amount) : "";

  const renderText = () => {
    if (message) return message;
    if (amount !== undefined && amount !== null && Number(amount) > 0) {
      return `${t("You saved")} ${formattedAmount} ${t("as a Pro member.")}`;
    }
    return (
      <>
        {t("Order now to enjoy exclusive offer with your")}{" "}
        <Box component="span" sx={{ fontWeight: 700 }}>
          {t("Pro Plan")}
        </Box>
      </>
    );
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        px: 1.75,
        py: 1.5,
        borderRadius: "12px",
        backgroundColor: isDark ? "#241B3D" : "#F1ECFC",
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        overflow: "hidden",
      }}
    >
      {/* Crown badge */}
      <Box
        sx={{
          width: { xs: 28, md: 36 },
          height: { xs: 28, md: 36 },
          borderRadius: "50%",
          backgroundColor: "#F5C842",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          position: "relative",
          zIndex: 1,
          boxShadow: "0 2px 6px rgba(245, 200, 66, 0.35)",
        }}
      >
        <i
          className="fi fi-sr-crown"
          style={{
            fontSize: isMobile ? 14 : 18,
            lineHeight: 1,
            display: "flex",
            color: "#FFFFFF",
          }}
        />
      </Box>

      {/* Copy */}
      <Typography
        sx={{
          flex: 1,
          fontSize: { xs: "13px", md: "13px" },
          color: isDark ? "#E5E7EB" : "#1F2937",
          lineHeight: 1.4,
          textAlign: "left",
          position: "relative",
          zIndex: 1,
        }}
      >
        {renderText()}
      </Typography>

      {/* Decorative waves anchored to the right edge */}
      <WaveDecoration />
    </Box>
  );
};

export default ProSavingsBanner;
