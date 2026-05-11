import React from "react";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import { useTranslation } from "react-i18next";

export interface UploadTriggerCardProps {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  width?: { xs?: string; sm?: string; md?: string } | string;
  height?: { xs?: string; sm?: string; md?: string } | string;
  disabled?: boolean;
}

const UploadTriggerCard: React.FC<UploadTriggerCardProps> = ({
  label,
  onClick,
  icon,
  width = { xs: "100px", sm: "120px", md: "130px" },
  height = { xs: "100px", sm: "120px", md: "130px" },
  disabled = false,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <Box
      onClick={disabled ? undefined : onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={label}
      sx={{
        width,
        height,
        flexShrink: 0,
        border: `1.5px dashed ${theme.palette.divider}`,
        borderRadius: "12px",
        background: theme.palette.action.hover,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: { xs: "8px", sm: "12px" },
        transition: "border-color 150ms ease, background 150ms ease",
        "&:hover": {
          borderColor: disabled
            ? theme.palette.divider
            : theme.palette.primary.main,
          background: disabled
            ? theme.palette.action.hover
            : theme.palette.action.selected,
        },
        "&:focus-visible": {
          outline: `2px solid ${theme.palette.primary.main}`,
          outlineOffset: "2px",
        },
      }}
    >
      <Stack alignItems="center" spacing={0.75}>
        {icon ?? (
          <ImageOutlinedIcon
            sx={{
              fontSize: { xs: 28, sm: 32, md: 36 },
              color: theme.palette.text.secondary,
            }}
          />
        )}
        <Typography
          fontSize={{ xs: "11px", sm: "12px", md: "13px" }}
          fontWeight={500}
          color={theme.palette.text.secondary}
          textAlign="center"
          sx={{
            lineHeight: 1.3,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {t(label)}
        </Typography>
      </Stack>
    </Box>
  );
};

export default UploadTriggerCard;
