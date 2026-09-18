import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Box, IconButton, Stack, Typography, alpha, useTheme } from "@mui/material";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

export default function ScheduleService({ isCustomService, scheduledAt, onEdit }) {
  const theme = useTheme();
  const { t } = useTranslation();

  const dateLabel = scheduledAt
    ? dayjs(scheduledAt.timestamp).format("DD MMM YY,")
    : null;
  const timeLabel = scheduledAt ? scheduledAt.time : null;

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: theme.palette.background.paper,
        borderRadius: { xs: "10px", md: "14px" },
        boxShadow: `0 1px 4px ${alpha(theme.palette.text.primary, 0.06)}`,
        px: { xs: 2, md: 3 },
        py: { xs: 1.5, md: 2 },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
      >
        <Stack spacing={0.75}>
          <Stack spacing={0.5}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: { xs: "14px", md: "16px" },
                color: theme.palette.text.primary,
              }}
            >
              {t("Schedule Service")}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "12px", md: "13px" },
                color: theme.palette.text.secondary,
              }}
            >
              {t("You can have the service provided now or pick a time for scheduled service provide!")}
            </Typography>
          </Stack>

          {dateLabel && timeLabel && (
            <Typography
              sx={{
                fontSize: { xs: "13px", md: "14px" },
                color: theme.palette.text.primary,
              }}
            >
              <Box component="span" sx={{ fontWeight: 700 }}>
                {dateLabel}
              </Box>
              {` ${timeLabel}`}
            </Typography>
          )}
        </Stack>

        {!isCustomService && onEdit && (
          <IconButton size="small" onClick={onEdit}>
            <EditOutlinedIcon sx={{ fontSize: 20, color: theme.palette.info.main }} />
          </IconButton>
        )}
      </Stack>
    </Box>
  );
}
