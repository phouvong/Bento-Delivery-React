import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { Calendar } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopTimePicker } from "@mui/x-date-pickers/DesktopTimePicker";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import CustomModal from "components/modal";
import { borderRadius, height, maxWidth, textAlign, width } from "@mui/system";
import {
  checkSchedule,
  getScheduleErrorMessage,
} from "components/home/module-wise-components/service/utils/providerScheduleValidation";

export default function CustomBookingModal({
  open,
  onClose,
  value,
  onConfirm,
  scrollToIndex,
  providerData,
}) {
  const theme = useTheme();
  const { t } = useTranslation();
  const isRTL = theme.direction === "rtl";

  const [localDates, setLocalDates] = useState([]);
  const [shownDate, setShownDate] = useState(new Date());
  const [warnIndex, setWarnIndex] = useState(null);
  const rowRefs = useRef([]);

  const today = new Date();
  const isAtMinMonth =
    shownDate.getFullYear() === today.getFullYear() &&
    shownDate.getMonth() === today.getMonth();

  useEffect(() => {
    if (open) {
      setLocalDates(
        (value?.dates ?? []).map((d) => ({
          date: dayjs(d.date),
          time: d.time ?? null,
        }))
      );
    }
  }, [open]);

  useEffect(() => {
    if (open && scrollToIndex != null) {
      const timer = setTimeout(() => {
        rowRefs.current[scrollToIndex]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [open, scrollToIndex]);

  const toggleDate = (date) => {
    const d = dayjs(date).startOf("day");
    setLocalDates((prev) => {
      const idx = prev.findIndex((e) => e.date.isSame(d, "day"));
      if (idx >= 0) return prev.filter((_, i) => i !== idx);
      return [...prev, { date: d, time: null }].sort(
        (a, b) => a.date.valueOf() - b.date.valueOf()
      );
    });
  };

  const updateTime = (index, time) => {
    setLocalDates((prev) =>
      prev.map((d, i) => (i === index ? { ...d, time } : d))
    );
    if (warnIndex === index) setWarnIndex(null);
  };

  const removeDate = (index) => {
    setLocalDates((prev) => prev.filter((_, i) => i !== index));
  };

  const handleConfirm = () => {
    const missingIndex = localDates.findIndex((d) => !d.time);
    if (missingIndex !== -1) {
      setWarnIndex(missingIndex);
      toast.error(t("Please set arrival time for all selected dates"));
      rowRefs.current[missingIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }
    const now = dayjs();
    const pastIdx = localDates.findIndex((entry) => {
      const parsedTime = dayjs(entry.time, "hh:mm A");
      return entry.date
        .hour(parsedTime.hour())
        .minute(parsedTime.minute())
        .second(0)
        .isBefore(now);
    });
    if (pastIdx !== -1) {
      setWarnIndex(pastIdx);
      toast.error(
        t(
          "Some selected date-times are in the past. Please choose a future time."
        )
      );
      rowRefs.current[pastIdx]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    // Schedule validation against provider schedules
    const schedules = providerData?.schedules;
    if (schedules !== undefined && schedules !== null) {
      if (!schedules || schedules.length === 0) {
        toast.error(t("This provider has no available schedule"), {
          id: "provider-not-available",
        });
        return;
      }
      const schedInvalidIdx = localDates.findIndex((entry) => {
        const parsedTime = dayjs(entry.time, "hh:mm A");
        const dt = entry.date
          .hour(parsedTime.hour())
          .minute(parsedTime.minute())
          .second(0);
        return !checkSchedule(dt, schedules).available;
      });
      if (schedInvalidIdx !== -1) {
        const parsedTime = dayjs(localDates[schedInvalidIdx].time, "hh:mm A");
        const dt = localDates[schedInvalidIdx].date
          .hour(parsedTime.hour())
          .minute(parsedTime.minute())
          .second(0);
        const { reason } = checkSchedule(dt, schedules);
        setWarnIndex(schedInvalidIdx);
        toast.error(t(getScheduleErrorMessage(reason)), {
          id: "provider-not-available",
        });
        rowRefs.current[schedInvalidIdx]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        return;
      }
    }

    onConfirm({
      dates: localDates.map((d) => ({ date: d.date.toDate(), time: d.time })),
    });
    onClose();
  };

  const hasSelection = localDates.length > 0;

  const dayContentRenderer = (date) => {
    const d = dayjs(date);
    const isSelected = localDates.some((e) => e.date.isSame(d, "day"));
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "1.9em",
          height: "1.9em",
          borderRadius: "50%",
          ...(isSelected
            ? {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.whiteContainer.main,
              }
            : {}),
        }}
      >
        {date.getDate()}
      </span>
    );
  };

  const calendarSx = {
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
    "& .rdrDay": {
      color: theme.palette.text.primary,
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
    "& .rdrStartEdge": isRTL
      ? {
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          borderTopRightRadius: "inherit",
          borderBottomRightRadius: "inherit",
        }
      : {},
    "& .rdrEndEdge": isRTL
      ? {
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          borderTopLeftRadius: "inherit",
          borderBottomLeftRadius: "inherit",
        }
      : {},
    "& .rdrDayStartPreview": isRTL
      ? {
          borderLeftWidth: 0,
          borderRightWidth: "1px",
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          borderTopRightRadius: "1.333em",
          borderBottomRightRadius: "1.333em",
        }
      : {},
    "& .rdrDayEndPreview": isRTL
      ? {
          borderRightWidth: 0,
          borderLeftWidth: "1px",
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          borderTopLeftRadius: "1.333em",
          borderBottomLeftRadius: "1.333em",
        }
      : {},
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
    "& .rdrDayToday:not(.rdrDayPassive) .rdrInRange ~ .rdrDayNumber span:after":
      {
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
      borderRadius: 2,
    },
    "& .rdrSelected, & .rdrStartEdge, & .rdrEndEdge": {
      background: "none !important",
    },
    "& .rdrDaySelected .rdrDayNumber span": {
      color: `${theme.palette.text.primary} !important`,
    },
    "& .rdrDayHovered .rdrDayNumber span": {
      border: "none",
    },
    "& .rdrCalendarWrapper:not(.rdrDateRangeWrapper) .rdrDayHovered .rdrDayNumber:after":
      {
        border: "none",
      },
    "& .rdrDayNumber span": {
      color: `${theme.palette.text.primary} !important`,
      borderRadius: "6px !important",
      height: "100% !important",
      px: 2,
    },
  };

  const timepickerSx = {
    width: "100%",
    mx: "auto",
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      fontSize: "12px",
      px: 1.5,
      py: 1,
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.background.paper,
      "& fieldset": { borderColor: theme.palette.divider },
      "&:hover fieldset": { borderColor: theme.palette.text.secondary },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.text.secondary,
        borderWidth: "1px",
      },
    },
    "& .MuiInputBase-input": {
      fontSize: "12px",
      resize: "none",
      // Keep the time (and its placeholder) on a single line even though the
      // field is a multiline textarea.
      whiteSpace: "nowrap",
      overflow: "hidden",
    },
    "& .MuiButtonBase-root": {
      paddingInlineStart: 0,
    },
    "& .MuiInputAdornment-root .MuiSvgIcon-root": {
      color: theme.palette.text.secondary,
      fontSize: { xs: "16px", md: "18px" },
      marginLeft: 0,
    },
  };

  return (
    <CustomModal
      openModal={open}
      handleClose={onClose}
      closeButton
      maxWidth="800px"
    >
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Box sx={{ px: { xs: 2, md: 3 }, pb: 2 }}>
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
            }}
          >
            {t("Your service booking date")}
          </Typography>
        </Box>

        {/* Two-panel body */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{ px: { xs: 2, md: 3 }, pb: 2 }}
        >
          {/* Calendar */}
          <Box
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: "10px",
              overflow: "hidden",
              flexShrink: 0,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box sx={calendarSx}>
              <Calendar
                date={null}
                onChange={toggleDate}
                minDate={today}
                onShownDateChange={setShownDate}
                dayContentRenderer={dayContentRenderer}
                weekdayDisplayFormat="EEEEE"
                showDateDisplay={false}
              />
            </Box>
          </Box>

          {/* Day Wise Arrival Time */}
          <Box
            sx={{
              flex: 1,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: "10px",
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
              p: 2,
              overflow: "hidden",
            }}
          >
            {/* Panel header */}
            <Box
              sx={{
                flexShrink: 0,
                pb: 2,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "14px",
                  color: theme.palette.text.primary,
                }}
              >
                {t("Day Wise Arrival Time")}
              </Typography>
              <Typography
                sx={{ fontSize: "12px", color: theme.palette.text.secondary }}
              >
                {t(
                  "Choose when you want to get your service on selected days."
                )}
              </Typography>
            </Box>

            <Box
              sx={{
                flex: 1,
                backgroundColor: theme.palette.background.default,
                borderRadius: "10px",
                display: "flex",
                flexDirection: "column",
                minWidth: 0,
                overflow: "hidden",
              }}
            >
              {/* Column labels */}
              {localDates.length > 0 && (
                <Stack
                  direction="row"
                  alignItems="center"
                  sx={{
                    px: 2,
                    py: 1,
                    backgroundColor: theme.palette.background.default,
                    color: theme.palette.text.primary,
                    flexShrink: 0,
                  }}
                >
                  <Typography
                    sx={{
                      width: { xs: 90, md: 110 },
                      flexShrink: 0,
                      fontSize: "14px",
                      fontWeight: 700,
                    }}
                  >
                    {t("Day")}
                  </Typography>
                  <Typography
                    sx={{
                      flex: 1,
                      fontSize: "14px",
                      fontWeight: 700,
                      textAlign: "center",
                    }}
                  >
                    {t("Time")}
                  </Typography>
                  <Typography
                    sx={{
                      width: 48,
                      flexShrink: 0,
                      fontSize: "14px",
                      fontWeight: 700,
                      textAlign: "center",
                    }}
                  >
                    {t("Action")}
                  </Typography>
                </Stack>
              )}

              {/* Scrollable rows */}
              <Box sx={{ overflowY: "auto", flex: 1, maxHeight: 300 }}>
                {localDates.length === 0 ? (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: 120,
                    }}
                  >
                    <Typography sx={{ fontSize: "14px" }}>
                      {t("Select dates from the calendar")}
                    </Typography>
                  </Box>
                ) : (
                  localDates.map((entry, index) => {
                    const isHighlighted = scrollToIndex === index;
                    const isWarned = warnIndex === index;
                    const isScheduleConflict = (() => {
                      if (!entry.time) return false;
                      const schedules = providerData?.schedules;
                      if (!schedules || schedules.length === 0) return false;
                      const parsedTime = dayjs(entry.time, "hh:mm A");
                      const dt = entry.date
                        .hour(parsedTime.hour())
                        .minute(parsedTime.minute())
                        .second(0);
                      return !checkSchedule(dt, schedules).available;
                    })();
                    return (
                      <Stack
                        key={entry.date.valueOf()}
                        ref={(el) => (rowRefs.current[index] = el)}
                        direction="row"
                        alignItems="center"
                        sx={{
                          gap: { xs: 1, md: 2 },
                          px: 2,
                          py: 1,
                          borderBottom:
                            index < localDates.length - 1
                              ? `1px solid ${theme.palette.divider}`
                              : "none",
                          // Blink animation for actively warned rows (past date / missing time)
                          ...((isHighlighted || isWarned) && {
                            "@keyframes rowBlink": {
                              "0%": { backgroundColor: "transparent" },
                              "25%": {
                                backgroundColor: alpha(
                                  theme.palette.error.main,
                                  0.1
                                ),
                              },
                              "50%": { backgroundColor: "transparent" },
                              "75%": {
                                backgroundColor: alpha(
                                  theme.palette.error.main,
                                  0.1
                                ),
                              },
                              "100%": { backgroundColor: "transparent" },
                            },
                            animation: "rowBlink 1.4s ease 0.35s 2",
                          }),
                          // Static error background for schedule conflicts (no blink)
                          ...(isScheduleConflict &&
                            !isHighlighted &&
                            !isWarned && {
                              backgroundColor: alpha(
                                theme.palette.error.main,
                                0.1
                              ),
                            }),
                        }}
                      >
                        {/* Fixed-width day column — variable label widths
                            ("Wed, Jul 15" vs "Fri, Jul 24") were pushing each
                            row's time box to a different x position. */}
                        <Typography
                          sx={{
                            width: { xs: 90, md: 110 },
                            flexShrink: 0,
                            fontSize: { xs: "12px", md: "14px" },
                            color: theme.palette.text.primary,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {entry.date.format("ddd, MMM D")}
                        </Typography>
                        <Box
                          sx={{ flex: 1, px: 0, mx: "auto", maxWidth: "190px" }}
                        >
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DesktopTimePicker
                              value={
                                entry.time ? dayjs(entry.time, "hh:mm A") : null
                              }
                              onChange={(newVal) => {
                                if (newVal?.isValid())
                                  updateTime(index, newVal.format("hh:mm A"));
                              }}
                              slotProps={{
                                popper: { sx: { zIndex: 1600 } },
                                actionBar: { actions: [] },
                                textField: {
                                  size: "small",
                                  placeholder: t("Ex: 06:00 PM"),
                                  multiline: true,
                                  maxRows: 2,
                                  inputProps: { readOnly: true, wrap: "off" },
                                  sx: timepickerSx,
                                },
                              }}
                            />
                          </LocalizationProvider>
                        </Box>
                        <Box
                          sx={{
                            width: 48,
                            display: "flex",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() => removeDate(index)}
                            sx={{ color: theme.palette.error.red }}
                          >
                            <HighlightOffIcon />
                          </IconButton>
                        </Box>
                      </Stack>
                    );
                  })
                )}
              </Box>
            </Box>
          </Box>
        </Stack>

        {/* Footer */}
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
            onClick={onClose}
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
