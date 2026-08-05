import { Box, Radio, Stack, Typography, alpha, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import DailyBooking from "./DailyBooking";
import WeeklyBooking from "./WeeklyBooking";
import CustomBooking from "./CustomBooking";

const BOOKING_TYPES = [
  {
    key: "daily",
    label: "Daily",
    description: "To select repeat order daily",
  },
  {
    key: "weekly",
    label: "Weekly",
    description: "To select repeat order weekly",
  },
  {
    key: "custom",
    label: "Custom",
    description: "To select repeat order as you want",
  },
];

export default function MultipleBooking({
  multiBookingType,
  setMultiBookingType,
  onDatesChange,
  providerData,
}) {
  const theme = useTheme();
  const { t } = useTranslation();
  const selected = multiBookingType;
  const setSelected = (key) => {
    setMultiBookingType(key);
    onDatesChange([]);
  };

  return (
    <Stack spacing={{ xs: 1.5, md: 2 }}>
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
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: { xs: "14px", md: "16px" },
            color: theme.palette.text.primary,
            mb: { xs: 1.5, md: 2 },
          }}
        >
          {t("Multiple Booking Type")}
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: { xs: 1.5, md: 2 },
            overflowX: { xs: "auto", md: "visible" },
            pb: { xs: 0.5, md: 0 },
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {BOOKING_TYPES.map(({ key, label, description }) => {
            const isSelected = selected === key;
            return (
              <Box
                key={key}
                onClick={() => setSelected(key)}
                sx={{
                  flex: { xs: "0 0 auto", md: "1 1 0" },
                  width: { xs: 150, md: "unset" },
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                  border: isSelected
                    ? `2px solid ${theme.palette.neutral[450]}`
                    : `2px solid ${theme.palette.neutral[200]}`,
                  borderRadius: "12px",
                  px: { xs: 1.5, md: 2 },
                  py: { xs: 1, md: 2 },
                  cursor: "pointer",
                  backgroundColor: theme.palette.background.paper,
                  transition: "border-color 0.2s",
                  "&:hover": {
                    borderColor: theme.palette.neutral[450],
                  },
                }}
              >
                <Stack spacing={0.25}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: "14px", md: "16px" },
                      color: theme.palette.text.primary,
                      lineHeight: 1.3,
                    }}
                  >
                    {t(label)}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "12px", md: "14px" },
                      color: theme.palette.text.secondary,
                      lineHeight: 1.4,
                    }}
                  >
                    {t(description)}
                  </Typography>
                </Stack>

                <Radio
                  checked={isSelected}
                  onChange={() => setSelected(key)}
                  size="small"
                  sx={{
                    p: 0,
                    flexShrink: 0,
                    color: theme.palette.neutral[350],
                    "&.Mui-checked": {
                      color: theme.palette.primary.main,
                    },
                  }}
                />
              </Box>
            );
          })}
        </Box>
        {selected === "daily" && (
          <DailyBooking
            onDatesChange={onDatesChange}
            providerData={providerData}
          />
        )}
        {selected === "weekly" && (
          <WeeklyBooking
            onDatesChange={onDatesChange}
            providerData={providerData}
          />
        )}
        {selected === "custom" && (
          <CustomBooking
            onDatesChange={onDatesChange}
            providerData={providerData}
          />
        )}
      </Box>
    </Stack>
  );
}
