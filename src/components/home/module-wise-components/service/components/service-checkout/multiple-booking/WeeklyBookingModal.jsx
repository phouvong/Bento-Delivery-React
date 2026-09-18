import {
  Box,
  Button,
  Checkbox,
  Collapse,
  Grid,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CustomModal from "components/modal";
import CustomDateRangePicker from "components/common/CustomDateRangePicker";

const ALL_DAYS = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

export default function WeeklyBookingModal({ open, onClose, value, onConfirm }) {
  const theme = useTheme();
  const { t } = useTranslation();

  const [localDays, setLocalDays] = useState(value?.selectedDays ?? []);
  const [localRepeat, setLocalRepeat] = useState(value?.repeatEveryWeek ?? false);
  const [localRange, setLocalRange] = useState(
    value?.dateRange ?? [{ startDate: null, endDate: null, key: "selection" }]
  );

  useEffect(() => {
    if (open) {
      setLocalDays(value?.selectedDays ?? []);
      setLocalRepeat(value?.repeatEveryWeek ?? false);
      setLocalRange(
        value?.dateRange ?? [{ startDate: null, endDate: null, key: "selection" }]
      );
    }
  }, [open]);

  const toggleDay = (day) => {
    setLocalDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleConfirm = () => {
    onConfirm({ selectedDays: localDays, repeatEveryWeek: localRepeat, dateRange: localRange });
    onClose();
  };

  const handleCancel = () => {
    setLocalDays(value?.selectedDays ?? []);
    setLocalRepeat(value?.repeatEveryWeek ?? false);
    setLocalRange(
      value?.dateRange ?? [{ startDate: null, endDate: null, key: "selection" }]
    );
    onClose();
  };

  const checkboxSx = {
    p: 0.5,
    color: theme.palette.divider,
    "&.Mui-checked": { color: theme.palette.primary.main },
  };

  return (
    <CustomModal openModal={open} handleClose={handleCancel} closeButton>
      <Box sx={{ display: "flex", flexDirection: "column", maxHeight: "80vh" }}>
        {/* Scrollable content */}
        <Box sx={{ flex: 1, overflowY: "auto", px: { xs: 2, md: 3 }, pb: 2 }}>
          {/* Header */}
          <Typography
            sx={{
              fontSize: { xs: "16px", md: "18px" },
              fontWeight: 700,
              color: theme.palette.text.primary,
              mb: 0.25,
            }}
          >
            {t("Schedule Days")}
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "12px", md: "14px" },
              color: theme.palette.text.secondary,
              mb: 2,
            }}
          >
            {t("Your service booking date")}
          </Typography>

          {/* Day checkboxes */}
          <Box
            sx={{
              borderRadius: "8px",
              backgroundColor: theme.palette.background.default,
              p: 2,
              mb: 2,
            }}
          >
            <Grid container spacing={1}>
              {ALL_DAYS.map((day) => (
                <Grid item xs={4} key={day}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.5}
                    sx={{ cursor: "pointer", userSelect: "none" }}
                    onClick={() => toggleDay(day)}
                  >
                    <Checkbox
                      checked={localDays.includes(day)}
                      size="small"
                      sx={checkboxSx}
                    />
                    <Typography
                      sx={{
                        fontSize: { xs: "13px", md: "14px" },
                        color: theme.palette.text.primary,
                      }}
                    >
                      {t(day)}
                    </Typography>
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Repeat Every Week */}
          <Box
            sx={{
              ...(localRepeat
                ? { backgroundColor: theme.palette.background.default }
                : { border: `1px solid ${theme.palette.divider}` }),
              borderRadius: "8px",
              p: 2,
              mb: 2,
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box sx={{ flex: 1, pr: 1 }}>
                <Typography
                  sx={{
                    fontSize: { xs: "13px", md: "14px" },
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                  }}
                >
                  {t("Repeat This Every Week")}
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "11px", md: "12px" },
                    color: theme.palette.text.secondary,
                  }}
                >
                  {t("Check this to repeat selected days in a date range")}
                </Typography>
              </Box>
              <Checkbox
                checked={localRepeat}
                onChange={(e) => setLocalRepeat(e.target.checked)}
                sx={checkboxSx}
              />
            </Stack>

            <Collapse in={localRepeat}>
              <Box
                sx={{
                  mt: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: "10px",
                  overflow: "hidden",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <CustomDateRangePicker
                  value={localRange}
                  onChange={(item) => setLocalRange([item.selection])}
                  minDate={new Date()}
                />
              </Box>
            </Collapse>
          </Box>

          {/* Info banner */}
          <Box
            sx={{
              backgroundColor: alpha(theme.palette.warning.main, 0.1),
              borderRadius: "8px",
              px: 2,
              py: 1.5,
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: "12px", md: "13px" },
                color: theme.palette.text.primary,
                textAlign: "center",
              }}
            >
              {t("You will receive this services in the upcoming")}{" "}
              <Box component="span" sx={{ fontWeight: 700 }}>
                {t("week days.")}
              </Box>
            </Typography>
          </Box>
        </Box>

        {/* Fixed footer */}
        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            px: { xs: 2, md: 3 },
            py: 2,
            backgroundColor: theme.palette.background.paper,
            flexShrink: 0,
          }}
        >
          <Button
            fullWidth
            variant="outlined"
            onClick={handleCancel}
            sx={{
              height: "48px",
              borderRadius: "10px",
              fontWeight: 600,
              fontSize: "15px",
              borderColor: theme.palette.divider,
              color: theme.palette.text.primary,
              "&:hover": {
                borderColor: theme.palette.text.secondary,
                backgroundColor: theme.palette.background.secondary,
              },
            }}
          >
            {t("Cancel")}
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={handleConfirm}
            sx={{
              height: "48px",
              borderRadius: "10px",
              fontWeight: 600,
              fontSize: "15px",
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.whiteContainer.main,
              "&:hover": { backgroundColor: theme.palette.primary.dark },
            }}
          >
            {t("Confirm Days")}
          </Button>
        </Stack>
      </Box>
    </CustomModal>
  );
}
