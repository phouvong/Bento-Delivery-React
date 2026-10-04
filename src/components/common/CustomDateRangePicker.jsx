
import { useState, useEffect, useMemo } from "react";
import { Box, alpha, useTheme } from "@mui/material";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

/**
 * Themed DateRange picker built on top of react-date-range.
 *
 * Props:
 *   value      – array of range objects [{ startDate, endDate, key }]
 *   onChange   – (item) => void  — receives { [key]: { startDate, endDate, key } }
 *   minDate    – Date (defaults to today — past dates are always disabled)
 *   maxDate    – Date
 *   months     – number of calendar months to render (default 1)
 *   direction  – "horizontal" | "vertical" (default "horizontal")
 *   showDateDisplay – show the top date display bar (default false)
 *   ...rest    – forwarded to <DateRange />
 */
export default function CustomDateRangePicker({
  value,
  onChange,
  minDate,
  maxDate,
  months = 1,
  direction = "horizontal",
  showDateDisplay = false,
  ...rest
}) {
  const theme = useTheme();

  const today = new Date();
  // Default minDate to today so past dates are always disabled
  const effectiveMinDate = minDate ?? today;

  // Track which month is currently shown so we can hide the prev arrow
  // when the user is already on the earliest allowed month.
  const [shownDate, setShownDate] = useState(today);

  // Sync shownDate when value changes (e.g. from parent presets or initial value)
  useEffect(() => {
    const start = value?.[0]?.startDate;
    setShownDate(start ?? new Date());
  }, [value]);

  const isAtMinMonth =
    shownDate.getFullYear() === effectiveMinDate.getFullYear() &&
    shownDate.getMonth() === effectiveMinDate.getMonth();

  const ranges = useMemo(() => {
    return value ?? [{ startDate: null, endDate: null, key: "selection" }];
  }, [value]);

  // Whether the user has made any selection
  const hasSelection = ranges.some((r) => r.startDate || r.endDate);

  // react-date-range treats null dates as unbounded (highlights ALL visible days).
  // Convert null → today so the library stays in a single-day "no range" state
  // until the user actually picks dates.
  const safeRanges = useMemo(() => {
    const todayDate = new Date();
    return ranges.map((r) => ({
      ...r,
      startDate: r.startDate ?? todayDate,
      endDate: r.endDate ?? r.startDate ?? todayDate,
    }));
  }, [ranges]);

  const isRTL = theme.direction === "rtl";

  const selectionColor = hasSelection
    ? theme.palette.primary.main
    : "transparent";

  return (
    <Box
      sx={{
        display: "inline-block",
        width: { xs: "100%", sm: "auto" },
        "& .rdrCalendarWrapper": {
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          fontFamily: "inherit",
          fontSize: { xs: "11px", sm: "13px" },
          width: { xs: "100%", sm: "auto" },
          direction: isRTL ? "rtl" : "ltr",
        },
        "& .rdrDateRangeWrapper": {
          width: { xs: "100%", sm: "auto" },
        },
        "& .rdrMonth": {
          width: { xs: "100%", sm: "27.667em" },
          padding: { xs: "0 0.5em 0.8em", sm: "0 0.833em 1.666em" },
        },
        "& .rdrMonthAndYearWrapper": {
          height: { xs: "44px", sm: "60px" },
          paddingTop: { xs: "4px", sm: "10px" },
        },
        "& .rdrWeekDays": {
          padding: { xs: "0 0.5em", sm: "0 0.833em" },
        },
        "& .rdrDays": {
          padding: { xs: "0 0.5em 0.4em", sm: "0 0.833em 0.666em" },
        },
        "& .rdrDay": {
          lineHeight: { xs: "2.6em", sm: "3em" },
          height: { xs: "2.6em", sm: "3em" },
          color: theme.palette.text.primary,
        },
        "& .rdrDateDisplayWrapper": {
          backgroundColor: theme.palette.background.secondary,
        },
        "& .rdrDateDisplayItem": {
          backgroundColor: theme.palette.background.paper,
          borderColor: "transparent",
          boxShadow: `0 1px 2px 0 ${alpha(theme.palette.text.primary, 0.1)}`,
        },
        "& .rdrDateDisplayItem input": {
          color: theme.palette.text.secondary,
        },
        "& .rdrDateDisplayItemActive": {
          borderColor: theme.palette.primary.main,
        },
        "& .rdrDateDisplayItemActive input": {
          color: theme.palette.text.primary,
        },
        "& .rdrMonthAndYearPickers": {
          gap: 0,
          direction: "ltr",
        },
        "& .rdrMonthPicker": {
          pointerEvents: "none",
          margin: 0,
          // maxWidth: "75px",
        },
        "& .rdrMonthPicker select": {
          color: theme.palette.text.primary,
          fontWeight: 700,
          fontSize: "16px",
          appearance: "none",
          WebkitAppearance: "none",
          MozAppearance: "none",
          border: "none",
          background: "transparent",
          cursor: "default",
          padding: 0,
          textAlign: "end",

        },
        "& .rdrYearPicker select": {
          color: theme.palette.text.primary,
          fontWeight: 700,
          fontSize: "16px",
        },
        "& .rdrNextPrevButton": {
          backgroundColor: theme.palette.background.secondary,
        },
        "& .rdrNextPrevButton:hover": {
          backgroundColor: theme.palette.divider,
        },
        "& .rdrPprevButton": {
          visibility: isAtMinMonth ? "hidden" : "visible",
          pointerEvents: isAtMinMonth ? "none" : "auto",
        },
        "& .rdrPprevButton i": {
          borderColor: isRTL
            ? `transparent transparent transparent ${theme.palette.text.primary}`
            : `transparent ${theme.palette.text.primary} transparent transparent`,
        },
        "& .rdrNextButton i": {
          borderColor: isRTL
            ? `transparent ${theme.palette.text.primary} transparent transparent`
            : `transparent transparent transparent ${theme.palette.text.primary}`,
        },
        "& .rdrWeekDay": {
          color: theme.palette.text.secondary,
        },
        "& .rdrDayNumber span": {
          color: `${theme.palette.text.primary} !important`,
        },
        "& .rdrDayHovered .rdrDayNumber span": {
          border: "none",
        },
        "& .rdrCalendarWrapper:not(.rdrDateRangeWrapper) .rdrDayHovered .rdrDayNumber:after": {
          border: "none",
        },
        "& .rdrDay:not(.rdrDayPassive) .rdrStartEdge ~ .rdrDayNumber span, & .rdrDay:not(.rdrDayPassive) .rdrEndEdge ~ .rdrDayNumber span, & .rdrDay:not(.rdrDayPassive) .rdrSelected ~ .rdrDayNumber span":
          {
            color: hasSelection
              ? `${theme.palette.whiteContainer.main} !important`
              : `${theme.palette.text.primary} !important`,
          },
        "& .rdrDay:not(.rdrDayPassive) .rdrInRange ~ .rdrDayNumber span": {
          color: `${theme.palette.neutral[1050]} !important`,
        },
        "& .rdrInRange": {
          background: `${theme.palette.customColor.tagBg} !important`,
        },
        "& .rdrStartEdge": isRTL ? {
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          borderTopRightRadius: "inherit",
          borderBottomRightRadius: "inherit",
        } : {},
        "& .rdrEndEdge": isRTL ? {
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          borderTopLeftRadius: "inherit",
          borderBottomLeftRadius: "inherit",
        } : {},
        "& .rdrDayStartPreview": isRTL ? {
          borderLeftWidth: 0,
          borderRightWidth: "1px",
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          borderTopRightRadius: "1.333em",
          borderBottomRightRadius: "1.333em",
        } : {},
        "& .rdrDayEndPreview": isRTL ? {
          borderRightWidth: 0,
          borderLeftWidth: "1px",
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          borderTopLeftRadius: "1.333em",
          borderBottomLeftRadius: "1.333em",
        } : {},
        "& .rdrDayPassive .rdrDayNumber span": {
          color: `${theme.palette.neutral[400]} !important`,
        },
        "& .rdrDayDisabled": {
          backgroundColor: theme.palette.background.default,
        },
        "& .rdrDayDisabled .rdrDayNumber span": {
          color: `${theme.palette.neutral[500]} !important`,
        },
        "& .rdrDayToday .rdrDayNumber span:after": {
          background: theme.palette.primary.main,
        },
        "& .rdrDayToday:not(.rdrDayPassive) .rdrStartEdge ~ .rdrDayNumber span:after, & .rdrDayToday:not(.rdrDayPassive) .rdrEndEdge ~ .rdrDayNumber span:after, & .rdrDayToday:not(.rdrDayPassive) .rdrSelected ~ .rdrDayNumber span:after":
          {
            background: hasSelection
              ? theme.palette.whiteContainer.main
              : theme.palette.primary.main,
          },
        "& .rdrDayToday:not(.rdrDayPassive) .rdrInRange ~ .rdrDayNumber span:after": {
          background: theme.palette.neutral[1050],
        },
        "& .rdrMonthName": {
          display: "none",
        },
        "& .rdrDefinedRangesWrapper": {
          backgroundColor: theme.palette.background.paper,
          borderColor: theme.palette.divider,
        },
        "& .rdrStaticRange": {
          backgroundColor: theme.palette.background.paper,
          borderColor: theme.palette.divider,
          color: theme.palette.text.primary,
        },
        "& .rdrStaticRange:hover .rdrStaticRangeLabel, & .rdrStaticRange:focus .rdrStaticRangeLabel":
          {
            backgroundColor: theme.palette.background.secondary,
          },
        "& .rdrInputRangeInput": {
          borderColor: theme.palette.divider,
          color: theme.palette.text.secondary,
          backgroundColor: theme.palette.background.paper,
        },
        "& .rdrInputRangeInput:focus, & .rdrInputRangeInput:hover": {
          borderColor: theme.palette.primary.main,
          color: theme.palette.text.primary,
          outline: "none",
        },
        "& .rdrDayStartPreview, & .rdrDayEndPreview, & .rdrDayInPreview": {
          border: "none",
          background: alpha(theme.palette.primary.main, 0.15),
        },
      }}
    >
      <DateRange
        ranges={safeRanges}
        onChange={onChange}
        color={selectionColor}
        rangeColors={[selectionColor]}
        minDate={effectiveMinDate}
        maxDate={maxDate}
        months={months}
        direction={direction}
        showDateDisplay={showDateDisplay}
        onShownDateChange={setShownDate}
        weekdayDisplayFormat="EEEEE"
        {...rest}
      />
    </Box>
  );
}
