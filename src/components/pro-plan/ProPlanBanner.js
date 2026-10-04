import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

// Decorative stack of curved horizontal lines that fades in across the
// right side of the banner. Inline so we don't need an asset or
// URL-encoded SVG background.
const WaveDecoration = ({ stacked = false }) => (
  <Box
    component="svg"
    viewBox="0 0 400 80"
    preserveAspectRatio="none"
    xmlns="http://www.w3.org/2000/svg"
    sx={{
      position: "absolute",
      // Leave clearance on the right so the Subscribe-Now CTA isn't
      // half-buried under the curves — the button is ~130px on xs and
      // grows a little on md, so we pull the wave back by that much.
      // When stacked, the button sits below the copy so the wave can
      // stretch further.
      right: stacked ? "16px" : { xs: "130px", md: "150px" },
      top: 0,
      height: "100%",
      width: stacked ? "60%" : { xs: "38%", md: "42%" },
      pointerEvents: "none",
      opacity: 0.55,
      zIndex: 0,
    }}
  >
    <defs>
      <linearGradient id="proPlanWaveFade" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0%" stopColor="#9B7BFF" stopOpacity="0" />
        <stop offset="40%" stopColor="#9B7BFF" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#9B7BFF" stopOpacity="0.9" />
      </linearGradient>
    </defs>
    <g stroke="url(#proPlanWaveFade)" fill="none" strokeWidth="0.45">
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

const ProPlanBanner = ({
  onSubscribe,
  subjectLabel = "order",
  stacked = false,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        px: { xs: 1.5, md: 1.75 },
        py: { xs: 1.5, md: 1.5 },
        borderRadius: "12px",
        backgroundColor: isDark ? "#241B3D" : "#F1ECFC",
        display: "flex",
        flexDirection: stacked ? "column" : { xs: "column", md: "row" },
        alignItems: stacked ? "stretch" : { xs: "stretch", md: "center" },
        gap: { xs: 1.25, md: 1.5 },
        overflow: "hidden",
      }}
    >
      {/* Crown + Text row */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.25,
          flex: 1,
          fontSize: "14px",
          color: isDark ? "#E5E7EB" : "#1F2937",
          lineHeight: 1.4,
          textAlign: "left",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Crown badge */}
        <Box
          sx={{
            width: { xs: 32, md: 36 },
            height: { xs: 32, md: 36 },
            borderRadius: "50%",
            backgroundColor: "#F5C842",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 2px 6px rgba(245, 200, 66, 0.35)",
          }}
        >
          <i
            className="fi fi-sr-crown"
            style={{
              fontSize: 16,
              lineHeight: 1,
              display: "flex",
              color: "#FFFFFF",
            }}
          />
        </Box>

        {/* Copy */}
        <Typography
          sx={{
            fontSize: stacked ? "14px" : { xs: "14px", md: "16px" },
            color: isDark ? "#E5E7EB" : "#1F2937",
            lineHeight: 1.4,
            textAlign: "left",
          }}
        >
          {t("Enjoy extra savings on every {{subject}} with a", {
            subject: t(subjectLabel),
          })}{" "}
          <Box component="span" sx={{ fontWeight: 700 }}>
            {t("Pro Plan")}
          </Box>
        </Typography>
      </Box>

      {/* Subscribe CTA */}
      <Box
        component="button"
        type="button"
        onClick={onSubscribe}
        sx={{
          position: "relative",
          zIndex: 1,
          appearance: "none",
          border: "none",
          fontSize: "14px",
          fontWeight: 700,
          color: "#FFFFFF",
          background: "linear-gradient(276.64deg, #B58EFF 0%, #A16BFF 100%)",
          cursor: "pointer",
          whiteSpace: "nowrap",
          px: 1.75,
          py: 1.25,
          borderRadius: "5px",
          lineHeight: 1.2,
          fontFamily: "inherit",
          boxShadow: "0 2px 6px rgba(155, 123, 255, 0.35)",
          width: stacked ? "100%" : { xs: "100%", md: "auto" },
          flexShrink: stacked ? 0 : { xs: 0, md: 1 },
          "&:hover": {
            filter: "brightness(1.05)",
          },
        }}
      >
        {t("Subscribe Now")}
      </Box>

      {/* Decorative waves anchored to the right edge */}
      <WaveDecoration stacked={stacked} />
    </Box>
  );
};

export default ProPlanBanner;
