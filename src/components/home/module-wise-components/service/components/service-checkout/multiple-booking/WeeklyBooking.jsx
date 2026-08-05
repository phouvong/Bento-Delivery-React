import { Box, Grid, Stack, Typography, useTheme } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { checkSchedule } from "components/home/module-wise-components/service/utils/providerScheduleValidation";
import ArrivalTimePicker from "./ArrivalTimePicker";
import BookingNoteSummary from "./BookingNoteSummary";
import WeeklyBookingModal from "./WeeklyBookingModal";

const DAY_INDEX = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

function countOccurrences(selectedDays, startDate, endDate) {
  if (!startDate || !endDate || selectedDays.length === 0) return null;
  const indices = selectedDays.map((d) => DAY_INDEX[d]);
  let count = 0;
  let cur = dayjs(startDate);
  const end = dayjs(endDate);
  while (!cur.isAfter(end)) {
    if (indices.includes(cur.day())) count++;
    cur = cur.add(1, "day");
  }
  return count;
}

export default function WeeklyBooking({ onDatesChange, providerData }) {
  const theme = useTheme();
  const { t } = useTranslation();

  const [selectedDays, setSelectedDays] = useState([]);
  const [repeatEveryWeek, setRepeatEveryWeek] = useState(false);
  const [dateRange, setDateRange] = useState([
    { startDate: null, endDate: null, key: "selection" },
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [arrivalTime, setArrivalTime] = useState(null);
  const [pastFilteredCount, setPastFilteredCount] = useState(0);
  const [conflictDates, setConflictDates] = useState([]);

  const { startDate, endDate } = dateRange[0];

  const daysLabel =
    selectedDays.length > 0 ? selectedDays.join(", ") : null;

  const totalCount =
    repeatEveryWeek ? countOccurrences(selectedDays, startDate, endDate) : null;

  const handleConfirm = ({ selectedDays: days, repeatEveryWeek: repeat, dateRange: range }) => {
    setSelectedDays(days);
    setRepeatEveryWeek(repeat);
    setDateRange(range);
  };

  // Compute and report dates array to parent whenever relevant state changes.
  // Past date+times are filtered out and reported via pastFilteredCount.
  useEffect(() => {
    if (!onDatesChange) return;
    if (selectedDays.length === 0 || !arrivalTime) {
      setPastFilteredCount(0);
      onDatesChange([]);
      return;
    }
    const parsedTime = dayjs(arrivalTime, "hh:mm A");
    const h = parsedTime.hour();
    const m = parsedTime.minute();
    const now = dayjs();
    const dates = [];

    if (repeatEveryWeek) {
      // Range mode: all occurrences of selected days within the date range
      const { startDate, endDate } = dateRange[0];
      if (!startDate || !endDate) { setPastFilteredCount(0); onDatesChange([]); return; }
      const indices = selectedDays.map((d) => DAY_INDEX[d]);
      let cur = dayjs(startDate).startOf("day");
      const end = dayjs(endDate).startOf("day");
      while (!cur.isAfter(end)) {
        if (indices.includes(cur.day())) {
          dates.push({ date: cur.hour(h).minute(m).second(0).format("YYYY-MM-DD HH:mm:ss") });
        }
        cur = cur.add(1, "day");
      }
    } else {
      // Single mode: next upcoming occurrence of each selected day from today.
      // Same-day → next week, so these are always in the future.
      const today = dayjs().startOf("day");
      for (const dayName of selectedDays) {
        const targetDayIndex = DAY_INDEX[dayName];
        const diff = (targetDayIndex - today.day() + 7) % 7;
        // If diff === 0, today is that day → use next week
        const daysToAdd = diff === 0 ? 7 : diff;
        const target = today.add(daysToAdd, "day");
        dates.push({ date: target.hour(h).minute(m).second(0).format("YYYY-MM-DD HH:mm:ss") });
      }
      dates.sort((a, b) => (a.date < b.date ? -1 : 1));
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
  }, [selectedDays, repeatEveryWeek, dateRange, arrivalTime, providerData]);

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
        {/* Preferable Days */}
        <Grid item xs={12} md={6}>
          <Stack spacing={0.75}>
            <Typography
              sx={{
                fontSize: { xs: "13px", md: "14px" },
                fontWeight: 500,
                color: theme.palette.text.primary,
              }}
            >
              {t("Select Days")}{" "}
              <Box component="span" sx={{ color: theme.palette.error.main }}>
                *
              </Box>
            </Typography>

            <Box sx={fieldWrapSx} onClick={() => setModalOpen(true)}>
              <Typography
                sx={{
                  flex: 1,
                  fontSize: { xs: "14px", md: "16px" },
                  color: daysLabel
                    ? theme.palette.text.primary
                    : theme.palette.neutral[450],
                }}
              >
                {daysLabel || t("Ex: Saturday, Sunday")}
              </Typography>
              <i
                className="fi fi-rr-angle-down"
                style={{
                  fontSize: "16px",
                  color: theme.palette.neutral[1050],
                  flexShrink: 0,
                  display: "flex",
                  marginInlineEnd: "-6px",
                }}
              />
            </Box>

            <WeeklyBookingModal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              value={{ selectedDays, repeatEveryWeek, dateRange }}
              onConfirm={handleConfirm}
            />
          </Stack>
        </Grid>

        {/* Arrival Time */}
        <Grid item xs={12} md={6}>
          <ArrivalTimePicker value={arrivalTime} onChange={setArrivalTime} subLabel="Weekly at" />
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
              ? t("1 occurrence was skipped because the selected time has already passed.")
              : `${pastFilteredCount} ${t("occurrences were skipped because the selected time has already passed.")}`}
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
        startDate={repeatEveryWeek ? startDate : null}
        endDate={repeatEveryWeek ? endDate : null}
        arrivalTime={arrivalTime}
        totalCount={totalCount}
      />
    </Box>
  );
}
