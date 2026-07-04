import { Box, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

/**
 * Order status badge — pill shape with color variants.
 * Dark mode supported via theme palette.
 *
 * Props:
 *  - status: string  — order status (case-insensitive)
 *  - label: string   — custom label override
 *  - sx: object      — additional MUI sx overrides
 */

const useStatusConfig = (key) => {
  const theme = useTheme();
  const p = theme.palette;

  const map = {
    pending: {
      bg: p.info?.tertiary ?? "#f1f6fd",
      color: p.info?.blue ?? "#224a8a",
    },
    accepted: { bg: "#cff7d3", color: p.success?.dark ?? "#009951" },
    processing: {
      bg: p.warning?.light ?? "#fffbeb",
      color: p.warning?.secondary ?? "#bf6a02",
    },
    "on the way": {
      bg: p.warning?.light ?? "#fffbeb",
      color: p.warning?.secondary ?? "#bf6a02",
    },
    delivered: { bg: "#cff7d3", color: p.success?.dark ?? "#009951" },
    cancelled: {
      bg: p.error?.dangerLight ?? "#fdd3d0",
      color: p.error?.dangerText ?? "#c00f0c",
    },
    refunded: {
      bg: p.info?.tertiary ?? "#f1f6fd",
      color: p.info?.blue ?? "#2a61ba",
    },
    confirmed: {
      bg: p.error?.dangerLight ?? "#fdd3d0",
      color: p.error?.dangerText ?? "#c00f0c",
    },
    failed: {
      bg: p.error?.dangerLight ?? "#fdd3d0",
      color: p.error?.dangerText ?? "#c00f0c",
    },
    cancelled: {
      bg: p.error?.dangerLight ?? "#fdd3d0",
      color: p.error?.dangerText ?? "#c00f0c",
    },
    canceled: {
      bg: p.error?.dangerLight ?? "#fdd3d0",
      color: p.error?.dangerText ?? "#c00f0c",
    },
    refund_requested: {
      bg: p.warning?.light ?? "#fffbeb",
      color: p.warning?.secondary ?? "#bf6a02",
    },
    returned: {
      bg: p.background?.secondary ?? "#f2f2f2",
      color: p.text?.primary ?? "#303030",
    },
    handover: {
      bg: p.warning?.light ?? "#fffbeb",
      color: p.warning?.secondary ?? "#bf6a02",
    },
    picked_up: {
      bg: p.warning?.light ?? "#fffbeb",
      color: p.warning?.secondary ?? "#bf6a02",
    },
    ongoing: {
      bg: p.warning?.light ?? "#fffbeb",
      color: p.warning?.secondary ?? "#bf6a02",
    },
    completed: {
      bg: p.background?.secondary ?? "#f2f2f2",
      color: p.text?.primary ?? "#303030",
    },
    paid: { bg: "#cff7d3", color: p.success?.dark ?? "#009951" },
    unpaid: {
      bg: p.error?.dangerLight ?? "#fdd3d0",
      color: p.error?.dangerText ?? "#c00f0c",
    },
    partially_paid: {
      bg: p.warning?.light ?? "#fffbeb",
      color: p.warning?.secondary ?? "#bf6a02",
    },
  };

  return (
    map[key] ?? {
      bg: p.info?.tertiary ?? "#f1f6fd",
      color: p.info?.blue ?? "#224a8a",
    }
  );
};

const StatusBadge = ({ status = "pending", label, sx }) => {
  const { t } = useTranslation();
  const key = (status ?? "").toLowerCase().trim();
  const config = useStatusConfig(key);
  const displayLabel = label ?? status ?? "";

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        height: "20px",
        px: "8px",
        py: "2px",
        borderRadius: "9999px",
        backgroundColor: config.bg,
        flexShrink: 0,
        ...sx,
      }}
    >
      <Typography
        sx={{
          fontSize: "12px",
          fontWeight: 400,
          color: config.color,
          lineHeight: 1.2,
          letterSpacing: "-0.36px",
          whiteSpace: "nowrap",
          textTransform: "none",
        }}
      >
        {t(displayLabel)}
      </Typography>
    </Box>
  );
};

export default StatusBadge;
