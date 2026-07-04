import { Box, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

/**
 * Required / state tag — 3 visual states (Figma node 2348:240849):
 *
 *  variant="initial"    — light red bg, red text
 *  variant="active"     — solid red bg, white text
 *  variant="completed"  — grey bg, dark text
 *
 * Props:
 *  - label: string   — text to display (default: "Required")
 *  - variant: "initial" | "active" | "completed"
 *  - sx: object      — additional MUI sx overrides
 */

const useVariantConfig = (variant) => {
  const { palette: p } = useTheme();
  const map = {
    initial: {
      bg: p.error?.dangerLight ?? "#fdd3d0",
      color: p.error?.dangerText ?? "#c00f0c",
    },
    active: {
      bg: p.error?.danger ?? "#ec221f",
      color: "rgba(255,255,255,0.95)",
    },
    completed: {
      bg: p.background?.secondary ?? "#e0e0e0",
      color: p.neutral?.[1050] ?? "#1e1e1e",
    },
  };
  return map[variant] ?? map.initial;
};

const RequiredTag = ({ label, variant = "initial", sx }) => {
  const { t } = useTranslation();
  const config = useVariantConfig(variant);
  const displayLabel = label ?? t("Required");

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        height: "24px",
        px: "8px",
        py: "4px",
        borderRadius: "20px",
        backgroundColor: config.bg,
        flexShrink: 0,
        ...sx,
      }}
    >
      <Typography
        sx={{
          fontSize: "14px",
          fontWeight: 400,
          color: config.color,
          lineHeight: 1.2,
          letterSpacing: "-0.42px",
          whiteSpace: "nowrap",
          textTransform: "none",
        }}
      >
        {displayLabel}
      </Typography>
    </Box>
  );
};

export default RequiredTag;
