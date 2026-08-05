import { Box, Grid, Stack, Typography, useTheme } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { checkSchedule } from "components/home/module-wise-components/service/utils/providerScheduleValidation";
import ArrivalTimePicker from "./ArrivalTimePicker";
import DateRangePickerModal from "./DateRangePickerModal";
import BookingNoteSummary from "./BookingNoteSummary";

export default function DailyBooking({ onDatesChange, providerData }) {
  const theme = useTheme();
  const { t } = useTranslation();

  const [range, setRange] = useState([
    { startDate: null, endDate: null, key: "selection" },
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [arrivalTime, setArrivalTime] = useState(null);
  const [pastFilteredCount, setPastFilteredCount] = useState(0);
  const [conflictDates, setConflictDates] = useState([]);

  const { startDate, endDate } = range[0];

  const formatDate = (d) => (d ? dayjs(d).format("D MMM YY") : null);
  const dateRangeLabel =
    startDate && endDate
      ? `${formatDate(startDate)} – ${formatDate(endDate)}`
      : startDate
      ? `${formatDate(startDate)} – ...`
      : null;

  const totalDays =
    startDate && endDate
      ? dayjs(endDate).diff(dayjs(startDate), "day") + 1
      : null;

  const handleConfirm = (confirmedRange) => setRange(confirmedRange);

  // Compute and report dates array to parent whenever range, arrival time, or providerData changes.
  // Dates that are in the past or outside the provider schedule are filtered out.
  useEffect(() => {
    if (!onDatesChange) return;
    const { startDate, endDate } = range[0];
    if (!startDate || !endDate || !arrivalTime) {
      setPastFilteredCount(0);
      setConflictDates([]);
      onDatesChange([]);
      return;
    }
    const parsedTime = dayjs(arrivalTime, "hh:mm A");
    const h = parsedTime.hour();
    const m = parsedTime.minute();
    const now = dayjs();
    const dates = [];
    let cur = dayjs(startDate).startOf("day");
    const end = dayjs(endDate).startOf("day");
    while (!cur.isAfter(end)) {
      dates.push({ date: cur.hour(h).minute(m).second(0).format("YYYY-MM-DD HH:mm:ss") });
      cur = cur.add(1, "day");
    }
    const notPastDates = dates.filter((d) => dayjs(d.date, "YYYY-MM-DD HH:mm:ss").isAfter(now));
    setPastFilteredCount(dates.length - notPastDates.length);

    const schedules = providerData?.schedules;
    if (schedules !== undefined && schedules !== null) {
      const conflicts = notPastDates.filter((d) => !checkSchedule(dayjs(d.date, "YYYY-MM-DD HH:mm:ss"), schedules).available);
      setConflictDates(conflicts);
      // Pass ALL non-past dates — conflicts included so downstream validators block Confirm Booking
      onDatesChange(notPastDates);
    } else {
      setConflictDates([]);
      onDatesChange(notPastDates);
    }
  }, [range, arrivalTime, providerData]);

  const fieldWrapSx = {
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: "8px",
    px: 2,
    height: "44px",
    display: "flex",
    alignItems: "center",
    gap: 1,
    cursor: "pointer",
    transition: "border-color 0.2s",
    "&:hover": { borderColor: theme.palette.text.secondary },
  };

  return (
    <Box
      sx={{
        width: "100%",
        mt: { xs: 2, md: 3 },
        pt: { xs: 2, md: 3 },
        borderTop: `1px solid ${theme.palette.background.secondary}`,
      }}
    >
      <Grid container spacing={{ xs: 2, md: 2.5 }}>
        {/* Preferable Date */}
        <Grid item xs={12} md={6}>
          <Stack spacing={0.75}>
            <Typography
              sx={{
                fontSize: { xs: "13px", md: "14px" },
                fontWeight: 500,
                color: theme.palette.text.primary,
              }}
            >
              {t("Preferable Date")}{" "}
              <Box component="span" sx={{ color: theme.palette.error.main }}>
                *
              </Box>
            </Typography>

            <Box sx={fieldWrapSx} onClick={() => setModalOpen(true)}>
              <Typography
                sx={{
                  flex: 1,
                  fontSize: { xs: "14px", md: "16px" },
                  color: dateRangeLabel
                    ? theme.palette.text.primary
                    : theme.palette.neutral[450],
                }}
              >
                {dateRangeLabel || t("Ex: 20 Jul 26 – 20 Aug 26")}
              </Typography>
              <CalendarMonthIcon
                sx={{
                  fontSize: "20px",
                  color: theme.palette.text.secondary,
                  flexShrink: 0,
                }}
              />
            </Box>

            <DateRangePickerModal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              value={range}
              onConfirm={handleConfirm}
            />
          </Stack>
        </Grid>

        {/* Arrival Time */}
        <Grid item xs={12} md={6}>
          <ArrivalTimePicker value={arrivalTime} onChange={setArrivalTime} />
        </Grid>
      </Grid>

      {pastFilteredCount > 0 && (
        <Box
          sx={{
            mt: 1.5,
            px: 1.5,
            py: 1,
            borderRadius: "8px",
            backgroundColor: (t) => `${t.palette.warning.main}1A`,
            border: (t) => `1px solid ${t.palette.warning.main}33`,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <i
            className="fi fi-rr-triangle-warning"
            style={{ fontSize: "14px", color: "#f59e0b", display: "flex", lineHeight: 1, flexShrink: 0 }}
          />
          <Typography sx={{ fontSize: "13px", color: "warning.dark" }}>
            {pastFilteredCount === 1
              ? t("1 date was skipped because the selected time has already passed today.")
              : `${pastFilteredCount} ${t("dates were skipped because the selected time has already passed.")}`}
          </Typography>
        </Box>
      )}

      {conflictDates.length > 0 && (
        <Box
          sx={{
            mt: 1,
            px: 1.5,
            py: 1,
            borderRadius: "8px",
            backgroundColor: (t) => `${t.palette.error.main}12`,
            border: (t) => `1px solid ${t.palette.error.main}33`,
            display: "flex",
            alignItems: "flex-start",
            gap: 1,
          }}
        >
          <i
            className="fi fi-rr-ban"
            style={{ fontSize: "14px", color: "#ef4444", display: "flex", lineHeight: 1, flexShrink: 0, marginTop: "2px" }}
          />
          <Typography sx={{ fontSize: "13px", color: "error.main" }}>
            {t("Provider is not available at the selected time on")}:{" "}
            <Box component="span" sx={{ fontWeight: 600 }}>
              {conflictDates.map((d) => dayjs(d.date, "YYYY-MM-DD HH:mm:ss").format("D MMM")).join(", ")}
            </Box>
            {". "}{t("Please update the arrival time to resolve the conflict before confirming.")}
          </Typography>
        </Box>
      )}

      <BookingNoteSummary
        startDate={startDate}
        endDate={endDate}
        arrivalTime={arrivalTime}
        totalCount={totalDays}
      />
    </Box>
  );
}
