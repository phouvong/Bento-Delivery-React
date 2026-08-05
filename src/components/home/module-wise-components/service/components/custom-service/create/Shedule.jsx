import { Box, Stack, Typography, alpha, useTheme } from "@mui/material";
import { Calendar } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useTranslation } from "react-i18next";
import ArrivalTimePicker from "../../service-checkout/multiple-booking/ArrivalTimePicker";
import dayjs from "dayjs";

/**
 * @param {Date|null}   date         - controlled date value
 * @param {string|null} time         - controlled time value (e.g. "10:00 AM")
 * @param {(date: Date) => void}     onDateChange
 * @param {(time: string) => void}   onTimeChange
 * @param {{ date?: string, time?: string }} errors
 */
export default function Shedule({
    date,
    time,
    onDateChange,
    onTimeChange,
    errors = {},
}) {
    const theme = useTheme();
    const { t } = useTranslation();

    const isRTL = theme.direction === "rtl";

    const calendarSx = {
        width: "100%",
        "& .rdrDateDisplayWrapper": {
            display: "none",
        },
        "& .rdrCalendarWrapper": {
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            fontFamily: "inherit",
            fontSize: "13px",
            width: "100%",
            paddingTop: 0,
            direction: isRTL ? "rtl" : "ltr",
        },
        "& .rdrMonth": {
            width: "100%",
        },
        "& .rdrMonthAndYearWrapper": {
            height: "60px",
            paddingTop: "10px",
        },
        "& .rdrDay": {
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
        "& .rdrDay:not(.rdrDayPassive) .rdrSelected ~ .rdrDayNumber span": {
            color: `${theme.palette.whiteContainer.main} !important`,
        },
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
        "& .rdrDayToday:not(.rdrDayPassive) .rdrSelected ~ .rdrDayNumber span:after": {
            background: theme.palette.whiteContainer.main,
        },
        "& .rdrDayStartPreview, & .rdrDayEndPreview, & .rdrDayInPreview": {
            border: "none",
            background: alpha(theme.palette.primary.main, 0.15),
        },
        "& .rdrMonthName": {
            display: "none",
        },
    };

    const formattedDate = date ? dayjs(date).format("D MMMM YY") : null;
    const hasSelection = Boolean(date && time);

    return (
        <Box>
            <Typography
                sx={{
                    fontSize: { xs: "16px", md: "18px" },
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    textTransform: "capitalize",
                    lineHeight: 1.2,
                    marginBottom: 2,
                }}
            >
                {t("Select Date and Time")}
            </Typography>

            <Stack
                sx={{
                    border: `1px solid ${errors.date ? theme.palette.error.main : theme.palette.divider}`,
                    borderRadius: "10px",
                    mb: errors.date ? 0.5 : 2.5,
                    overflow: "hidden",
                }}
            >
                <Box sx={calendarSx}>
                    <Calendar
                        date={date}
                        onChange={onDateChange}
                        minDate={new Date()}
                        color={theme.palette.primary.main}
                    />
                </Box>
            </Stack>
            {errors.date && (
                <Typography
                    sx={{ fontSize: "12px", color: "error.main", mb: 2, mt: 0.5 }}
                >
                    {errors.date}
                </Typography>
            )}

            <Stack sx={{ mb: errors.time ? 0.5 : 2.5 }}>
                <ArrivalTimePicker
                    value={time}
                    onChange={onTimeChange}
                    showSubLabel={false}
                    error={Boolean(errors.time)}
                />
            </Stack>
            {errors.time && (
                <Typography
                    sx={{ fontSize: "12px", color: "error.main", mb: 2, mt: 0.5 }}
                >
                    {errors.time}
                </Typography>
            )}

            {hasSelection && (
                <Typography
                    sx={{
                        fontSize: { xs: "12px", md: "14px" },
                        fontWeight: 400,
                        color: theme.palette.text.info,
                        textAlign: "center",
                    }}
                >
                    {t("Selected Date & time")}{" "}
                    <Box component="span" sx={{ fontWeight: 700 }}>
                        {formattedDate}, {time}
                    </Box>
                </Typography>
            )}
        </Box>
    );
}
