import { Box, Stack, Typography, useTheme } from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

export default function ArrivalTimePicker({
  value,
  onChange,
  subLabel = "Everyday At",
  showSubLabel = true,
}) {
  const theme = useTheme();
  const { t } = useTranslation();

  const dayjsValue = value ? dayjs(value, "hh:mm A") : null;

  const handleChange = (newValue) => {
    if (newValue && newValue.isValid()) {
      onChange(newValue.format("hh:mm A"));
    }
  };

  return (
    <Stack spacing={0.75}>
      <Typography
        sx={{
          fontSize: { xs: "13px", md: "14px" },
          fontWeight: 500,
          color: theme.palette.text.primary,
        }}
      >
        {t("Arrival Time")}{" "}
        {showSubLabel && (
          <Box
            component="span"
            sx={{ fontWeight: 400, color: theme.palette.text.secondary }}
          >
            ({t(subLabel)}){" "}
          </Box>
        )}
        <Box component="span" sx={{ color: theme.palette.error.main }}>
          *
        </Box>
      </Typography>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DesktopTimePicker
          value={dayjsValue}
          onChange={handleChange}
          slotProps={{
            actionBar: { actions: [] },
            textField: {
              size: "small",
              placeholder: t("Ex: 06:00 PM"),
              inputProps: { readOnly: true },
              sx: {
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  px: 2,
                  height: "44px",
                  fontSize: { xs: "14px", md: "16px" },
                  fontWeight: 400,
                  color: theme.palette.text.primary,
                  "& fieldset": {
                    borderColor: theme.palette.divider,
                  },
                  "&:hover fieldset": {
                    borderColor: theme.palette.text.secondary,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.text.secondary,
                    borderWidth: "1px",
                  },
                },
                "& .MuiInputAdornment-root .MuiSvgIcon-root": {
                  color: theme.palette.text.primary,
                  fontSize: { xs: "18px", md: "20px" },
                },
                "& .MuiInputBase-input": {
                  paddingInline: 0,
                },
              },
            },
          }}
        />
      </LocalizationProvider>
    </Stack>
  );
}
