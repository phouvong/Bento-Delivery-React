import { useCallback, useEffect, useRef, useState } from "react";
import { Box, Button, Stack, Typography, alpha, useTheme } from "@mui/material";
import { Calendar } from "react-date-range";
// @ts-ignore
import "react-date-range/dist/styles.css";
// @ts-ignore
import "react-date-range/dist/theme/default.css";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import CustomModal from "components/modal";

dayjs.extend(customParseFormat);

export interface SelectDateTimeResult {
  timestamp: dayjs.Dayjs;
  date: string; // "YYYY-MM-DD"
  time: string; // "hh:mm A"
}

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (result: SelectDateTimeResult | null) => void;
  value?: SelectDateTimeResult | null;
}

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0")); // "01".."12"
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));   // "00".."59"
const PERIODS = ["AM", "PM"];
const ITEM_H = 44; // px — height of each item

// ── Scroll-wheel column: selected item is ALWAYS at top (first visible row) ──
interface WheelColProps {
  items: string[];
  value: string;
  onChange: (v: string) => void;
  borderRight?: boolean;
  flex?: number;
}

function WheelColumn({ items, value, onChange, borderRight = true, flex = 1 }: WheelColProps) {
  const theme = useTheme();
  const outerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Height of the visible container → needed so last items can scroll to the top
  const [spacerH, setSpacerH] = useState(300);
  const snapTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const busy = useRef(false);

  // Measure outer height → set bottom spacer so last item can reach top
  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const update = () => setSpacerH(Math.max(0, el.clientHeight - ITEM_H));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Jump scroll so `val` is at the very top — no animation
  const jumpToValue = useCallback(
    (val: string) => {
      const el = scrollRef.current;
      if (!el) return;
      const idx = items.indexOf(val);
      if (idx >= 0) el.scrollTop = idx * ITEM_H;
    },
    [items]
  );

  // Smooth scroll to a specific item index
  const smoothToIndex = useCallback((idx: number) => {
    scrollRef.current?.scrollTo({ top: idx * ITEM_H, behavior: "smooth" });
  }, []);

  // On open: jump (no animation) to current value
  useEffect(() => {
    jumpToValue(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // mount only

  // If value changes externally (modal re-open with pre-fill), re-jump
  useEffect(() => {
    if (!busy.current) jumpToValue(value);
  }, [value, jumpToValue]);

  // On scroll stop: snap to nearest item → first visible = selected
  const handleScroll = useCallback(() => {
    if (busy.current) return;
    if (snapTimer.current) clearTimeout(snapTimer.current);

    snapTimer.current = setTimeout(() => {
      const el = scrollRef.current;
      if (!el) return;
      const idx = Math.max(0, Math.min(Math.round(el.scrollTop / ITEM_H), items.length - 1));
      onChange(items[idx]);

      busy.current = true;
      smoothToIndex(idx);
      setTimeout(() => { busy.current = false; }, 350);
    }, 130);
  }, [items, onChange, smoothToIndex]);

  // Click item → scroll it to top → becomes selected
  const handleClick = useCallback(
    (item: string) => {
      const idx = items.indexOf(item);
      if (idx < 0) return;
      onChange(item);
      busy.current = true;
      smoothToIndex(idx);
      setTimeout(() => { busy.current = false; }, 350);
    },
    [items, onChange, smoothToIndex]
  );

  return (
    <Box
      ref={outerRef}
      sx={{
        flex,
        position: "relative",
        overflow: "hidden",
        borderRight: borderRight ? `1px solid ${theme.palette.divider}` : "none",
      }}
    >
      {/* Scroll container fills outer via absolute positioning */}
      <Box
        ref={scrollRef}
        onScroll={handleScroll}
        sx={{
          position: "absolute",
          inset: 0,
          overflowY: "scroll",
          scrollSnapType: "y mandatory",
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
          px: 0.75,
          pt: 0.75,
        }}
      >
        {items.map((item) => {
          const sel = item === value;
          return (
            <Box
              key={item}
              onClick={() => handleClick(item)}
              sx={{
                height: ITEM_H,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                scrollSnapAlign: "start",
                borderRadius: "6px",
                cursor: "pointer",
                userSelect: "none",
                mb: "2px",
                backgroundColor: sel ? theme.palette.primary.main : "transparent",
                color: sel
                  ? (theme.palette.primary.contrastText ?? "#fff")
                  : theme.palette.text.primary,
                fontWeight: sel ? 700 : 400,
                fontSize: "14px",
                transition: "background-color 0.1s",
                "&:hover": {
                  backgroundColor: sel
                    ? theme.palette.primary.dark
                    : alpha(theme.palette.primary.main, 0.08),
                },
              }}
            >
              {item}
            </Box>
          );
        })}
        {/* Spacer: allows last items to scroll up to top position */}
        <Box sx={{ height: spacerH, scrollSnapAlign: "none" }} />
      </Box>
    </Box>
  );
}

// ── AM / PM — 2 static clickable items, no scroll ────────────────────────────
function PeriodColumn({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        flex: 0.8,
        display: "flex",
        flexDirection: "column",
        gap: "2px",
        p: 0.75,
        overflow: "hidden",
      }}
    >
      {PERIODS.map((p) => {
        const sel = p === value;
        return (
          <Box
            key={p}
            onClick={() => onChange(p)}
            sx={{
              height: ITEM_H,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "6px",
              cursor: "pointer",
              userSelect: "none",
              fontWeight: sel ? 700 : 400,
              fontSize: "14px",
              backgroundColor: sel ? theme.palette.primary.main : "transparent",
              color: sel
                ? (theme.palette.primary.contrastText ?? "#fff")
                : theme.palette.text.primary,
              transition: "background-color 0.1s",
              "&:hover": {
                backgroundColor: sel
                  ? theme.palette.primary.dark
                  : alpha(theme.palette.primary.main, 0.08),
              },
            }}
          >
            {p}
          </Box>
        );
      })}
    </Box>
  );
}

// ── Main modal ────────────────────────────────────────────────────────────────
export default function SelectDateTimeModal({ open, onClose, onConfirm, value }: Props) {
  const theme = useTheme();
  const { t } = useTranslation();
  const today = new Date();

  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [shownDate, setShownDate] = useState<Date>(today);
  const [hour, setHour] = useState<string>(() => dayjs().format("hh"));
  const [minute, setMinute] = useState<string>(() => dayjs().format("mm"));
  const [period, setPeriod] = useState<string>(() => dayjs().format("A"));

  useEffect(() => {
    if (!open) return;
    if (value?.timestamp) {
      const d = dayjs(value.timestamp);
      setSelectedDate(d.toDate());
      setShownDate(d.toDate());
      setHour(d.format("hh"));
      setMinute(d.format("mm"));
      setPeriod(d.format("A"));
    } else {
      const n = dayjs();
      setSelectedDate(today);
      setShownDate(today);
      setHour(n.format("hh"));
      setMinute(n.format("mm"));
      setPeriod(n.format("A"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const isAtMinMonth =
    shownDate.getFullYear() === today.getFullYear() &&
    shownDate.getMonth() === today.getMonth();

  const handleConfirm = () => {
    const dateStr = dayjs(selectedDate).format("YYYY-MM-DD");
    const timeStr = `${hour}:${minute} ${period}`;
    const combined = dayjs(`${dateStr} ${timeStr}`, "YYYY-MM-DD hh:mm A");
    const now = dayjs();
    // Same minute as now → treat as instant service
    if (combined.isSame(now, "minute")) {
      onConfirm(null);
      onClose();
      return;
    }
    // Past time → error
    if (combined.isBefore(now)) {
      toast.error(t("Please select a future date and time"), { id: "select-future-datetime" });
      return;
    }
    onConfirm({ timestamp: combined, date: dateStr, time: timeStr });
    onClose();
  };

  const calendarSx = {
    display: "block",
    width: "100%",
    "& .rdrCalendarWrapper": {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
      fontFamily: "inherit",
      fontSize: "13px",
      width: "100%",
      direction: "ltr",
    },
    "& .rdrMonth": { width: "100%", padding: "0 0.833em 1.5em" },
    "& .rdrMonthAndYearWrapper": { height: "56px", paddingTop: "8px" },
    "& .rdrWeekDays": { padding: "0 0.833em" },
    "& .rdrDays": { padding: "0 0.833em 0.5em" },
    "& .rdrDateDisplayWrapper": { display: "none" },
    "& .rdrMonthAndYearPickers": { gap: 0, direction: "ltr" },
    "& .rdrMonthPicker": { pointerEvents: "none", margin: 0 },
    "& .rdrMonthPicker select": {
      color: theme.palette.text.primary,
      fontWeight: 700,
      fontSize: "15px",
      appearance: "none",
      WebkitAppearance: "none",
      MozAppearance: "none",
      border: "none",
      background: "transparent",
      cursor: "default",
      padding: 0,
    },
    "& .rdrYearPicker select": {
      color: theme.palette.text.primary,
      fontWeight: 700,
      fontSize: "15px",
    },
    "& .rdrNextPrevButton": { backgroundColor: theme.palette.background.default },
    "& .rdrNextPrevButton:hover": { backgroundColor: theme.palette.divider },
    "& .rdrPprevButton": {
      visibility: isAtMinMonth ? "hidden" : "visible",
      pointerEvents: isAtMinMonth ? "none" : "auto",
    },
    "& .rdrPprevButton i": {
      borderColor: `transparent ${theme.palette.text.primary} transparent transparent`,
    },
    "& .rdrNextButton i": {
      borderColor: `transparent transparent transparent ${theme.palette.text.primary}`,
    },
    "& .rdrWeekDay": { color: theme.palette.text.secondary },
    "& .rdrDay": { color: theme.palette.text.primary },
    "& .rdrDayPassive .rdrDayNumber span": {
      color: `${alpha(theme.palette.text.primary, 0.3)} !important`,
    },
    "& .rdrDayDisabled": { backgroundColor: theme.palette.background.default },
    "& .rdrDayDisabled .rdrDayNumber span": {
      color: `${alpha(theme.palette.text.primary, 0.3)} !important`,
    },
    "& .rdrDayToday .rdrDayNumber span:after": {
      background: theme.palette.primary.main,
    },
    "& .rdrSelected, & .rdrStartEdge, & .rdrEndEdge": {
      background: `${theme.palette.primary.main} !important`,
      borderRadius: "6px !important",
    },
    "& .rdrDay:not(.rdrDayPassive) .rdrSelected ~ .rdrDayNumber span": {
      color: `${theme.palette.primary.contrastText ?? "#fff"} !important`,
    },
    "& .rdrDayToday:not(.rdrDayPassive) .rdrSelected ~ .rdrDayNumber span:after": {
      background: theme.palette.primary.contrastText ?? "#fff",
    },
    "& .rdrDayNumber span": {
      color: `${theme.palette.text.primary} !important`,
      borderRadius: "6px !important",
    },
    "& .rdrMonthName": { display: "none" },
    "& .rdrDayHovered .rdrDayNumber span": { border: "none" },
    "& .rdrCalendarWrapper:not(.rdrDateRangeWrapper) .rdrDayHovered .rdrDayNumber:after": {
      border: "none",
    },
  };

  return (
    <CustomModal openModal={open} handleClose={onClose} closeButton maxWidth="700px">
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Box sx={{ px: { xs: 2, md: 3 }, pb: 2 }}>
          <Typography
            sx={{
              fontSize: { xs: "16px", md: "18px" },
              fontWeight: 700,
              color: theme.palette.text.primary,
              mb: 0.5,
            }}
          >
            {t("Select Date & Time")}
          </Typography>
          <Typography sx={{ fontSize: { xs: "12px", md: "14px" }, color: theme.palette.text.secondary }}>
            {t("Choose when you want get your service")}
          </Typography>
        </Box>

        {/* Body: Calendar + Time Picker side by side */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems="stretch"
          spacing={2}
          sx={{ px: { xs: 2, md: 3 }, pb: 2 }}
        >
          {/* Calendar */}
          <Box
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: "12px",
              overflow: "hidden",
              flex: 1,
              minWidth: 0,
            }}
          >
            <Box sx={calendarSx}>
              <Calendar
                date={selectedDate}
                onChange={(date: Date) => setSelectedDate(date)}
                minDate={today}
                onShownDateChange={(date: Date) => setShownDate(date)}
                weekdayDisplayFormat="EEEEE"
                showDateDisplay={false}
              />
            </Box>
          </Box>

          {/* Time Picker — no headers, columns stretch to calendar height */}
          <Box
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: "12px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              width: { xs: "100%", md: "185px" },
              flexShrink: 0,
            }}
          >
            {/* Three columns filling full height */}
            <Stack direction="row" sx={{ flex: 1, minHeight: 0 }}>
              <WheelColumn items={HOURS} value={hour} onChange={setHour} borderRight flex={1} />
              <WheelColumn items={MINUTES} value={minute} onChange={setMinute} borderRight flex={1} />
              <PeriodColumn value={period} onChange={setPeriod} />
            </Stack>
          </Box>
        </Stack>

        {/* Footer */}
        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            px: { xs: 2, md: 3 },
            py: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Button
            fullWidth
            onClick={onClose}
            sx={{
              height: 44,
              borderRadius: "10px",
              fontWeight: 600,
              fontSize: { xs: "14px", md: "15px" },
              backgroundColor: alpha(theme.palette.text.primary, 0.07),
              color: theme.palette.text.primary,
              textTransform: "none",
              "&:hover": { backgroundColor: alpha(theme.palette.text.primary, 0.12) },
            }}
          >
            {t("Cancel")}
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={handleConfirm}
            sx={{
              height: 44,
              borderRadius: "10px",
              fontWeight: 600,
              fontSize: { xs: "14px", md: "15px" },
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText ?? "#fff",
              textTransform: "none",
              "&:hover": { backgroundColor: theme.palette.primary.dark },
            }}
          >
            {t("Confirm Dates")}
          </Button>
        </Stack>
      </Box>
    </CustomModal>
  );
}
