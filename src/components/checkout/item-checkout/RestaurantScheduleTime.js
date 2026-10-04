import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@emotion/react";
import { useTranslation } from "react-i18next";
import { getAllSchedule, getDayNumber } from "../../../utils/CustomFunctions";
import CustomAlert from "../../alert/CustomAlert";

const RestaurantScheduleTime = (props) => {
  const {
    storeData,
    configData,
    today,
    tomorrow,
    numberOfDay,
    setScheduleAt,
    handleChange,
    setDayNumber,
    onClose,
    onConfirm,
    variant,
  } = props;

  const { t } = useTranslation();
  const theme = useTheme();
  const isModal = variant === "modal" || Boolean(onClose) || Boolean(onConfirm);

  const todayNumber = getDayNumber(today);
  const tomorrowNumber = getDayNumber(tomorrow);

  const slotDurationTime =
    configData?.schedule_order_slot_duration === 0
      ? 30
      : configData?.schedule_order_slot_duration;

  const [draftDay, setDraftDay] = useState(numberOfDay ?? todayNumber);
  const [draftSlot, setDraftSlot] = useState("");

  useEffect(() => {
    if (typeof numberOfDay !== "undefined") {
      setDraftDay(numberOfDay);
    }
  }, [numberOfDay]);

  const isToday = draftDay === todayNumber;

  const baseSlots = useMemo(
    () =>
      getAllSchedule(draftDay, storeData?.schedules, slotDurationTime) || [],
    [draftDay, storeData?.schedules, slotDurationTime]
  );

  const slots = useMemo(() => {
    if (isToday) {
      const nowLabel = t("Now");
      const withoutNow = baseSlots.filter((s) => s.label !== nowLabel);
      return [
        { value: "instant", label: t("Instant Delivery") },
        ...withoutNow,
      ];
    }
    return baseSlots;
  }, [isToday, baseSlots, t]);

  const applyDayChange = (dayNumber) => {
    setDraftDay(dayNumber);
    setDraftSlot(dayNumber === todayNumber ? "instant" : "");
    if (!isModal) {
      if (setDayNumber) setDayNumber(dayNumber);
      else if (handleChange) handleChange({ target: { value: dayNumber } });
    }
  };

  const applySlotChange = (slotValue) => {
    setDraftSlot(slotValue);
    if (!isModal) {
      setScheduleAt?.(slotValue);
    }
  };

  const handleConfirm = () => {
    if (!draftSlot) return;
    if (setDayNumber) setDayNumber(draftDay);
    else if (handleChange) handleChange({ target: { value: draftDay } });
    setScheduleAt?.(draftSlot);
    onConfirm?.({ day: draftDay, slot: draftSlot });
    onClose?.();
  };

  if (!storeData?.schedule_order) return null;

  const tabSx = (active) => ({
    flex: 1,
    py: { xs: 1, md: 1.25 },
    textAlign: "center",
    fontWeight: active ? 700 : 500,
    fontSize: { xs: "14px", md: "16px" },
    color: active ? theme.palette.primary.main : theme.palette.text.secondary,
    borderBottom: active
      ? `2px solid ${theme.palette.primary.main}`
      : `2px solid transparent`,
    cursor: "pointer",
    userSelect: "none",
    transition: "color 0.15s ease, border-color 0.15s ease",
  });

  const slotSx = (selected) => ({
    width: "100%",
    py: { xs: 1.25, md: 1.5 },
    px: 1,
    textAlign: "center",
    borderRadius: "10px",
    fontWeight: selected ? 700 : 500,
    fontSize: { xs: "13px", md: "14px" },
    cursor: "pointer",
    backgroundColor: selected ? theme.palette.primary.main : "transparent",
    color: selected
      ? theme.palette.whiteContainer.main
      : theme.palette.text.primary,
    whiteSpace: "nowrap",
    transition: "background-color 0.15s ease, color 0.15s ease",
    "&:hover": {
      backgroundColor: selected
        ? theme.palette.primary.dark
        : alpha(
            theme.palette.neutral?.[400] || theme.palette.text.secondary,
            0.08
          ),
    },
  });

  const neutralBase =
    theme.palette.neutral?.[400] || theme.palette.text.secondary;

  return (
    <Stack
      sx={{
        width: "100%",
        backgroundColor: theme.palette.background.paper,
        borderRadius: isModal ? { xs: "16px 16px 0 0", md: "16px" } : "10px",
        p: { xs: 1.75, md: 2.5 },
        gap: { xs: 1.5, md: 2 },
      }}
    >
      <Stack
        direction="row"
        alignItems="flex-start"
        justifyContent="space-between"
        gap={1}
      >
        <Stack spacing={0.25} flex={1} minWidth={0}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: "16px", md: "18px" },
              color: theme.palette.text.primary,
            }}
          >
            {t("Select Your Time Slot")}
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "12px", md: "13px" },
              color: theme.palette.text.secondary,
            }}
          >
            {t("Choose preferable time when you want delivery")}
          </Typography>
        </Stack>
        {isModal && onClose && (
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              color: theme.palette.text.secondary,
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </Stack>

      <Stack
        direction="row"
        sx={{
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={tabSx(isToday)} onClick={() => applyDayChange(todayNumber)}>
          {t("Today")}
        </Box>
        <Box
          sx={tabSx(!isToday)}
          onClick={() => applyDayChange(tomorrowNumber)}
        >
          {t("Tomorrow")}
        </Box>
      </Stack>

      <Box
        sx={{
          p: { xs: 1.25, md: 1.5 },
          pr: { xs: 0.75, md: 1 },
          backgroundColor: alpha(neutralBase, 0.06),
          borderRadius: "12px",
          maxHeight: { xs: "260px", md: "320px" },
          overflowY: "auto",
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: alpha(neutralBase, 0.25),
            borderRadius: "6px",
          },
        }}
      >
        {slots.length > 0 ? (
          <Grid container columnSpacing={1.5} rowSpacing={1}>
            {slots.map((slot, idx) => {
              const selected = draftSlot === slot.value;
              return (
                <Grid item xs={6} key={`${slot.value}-${idx}`}>
                  <Box
                    sx={slotSx(selected)}
                    onClick={() => applySlotChange(slot.value)}
                  >
                    {slot.label}
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <CustomAlert type="info" text={t("Store closed.")} />
        )}
      </Box>

      {isModal && (
        <Stack direction="row" gap={1.25} justifyContent="space-between">
          <Button
            onClick={onClose}
            variant="contained"
            disableElevation
            sx={{
              flex: 1,
              py: { xs: 1.25, md: 1.5 },
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 700,
              fontSize: { xs: "14px", md: "15px" },
              backgroundColor: alpha(neutralBase, 0.12),
              color: theme.palette.text.primary,
              boxShadow: "none",
              "&:hover": {
                backgroundColor: alpha(neutralBase, 0.18),
                boxShadow: "none",
              },
            }}
          >
            {t("Cancel")}
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            disableElevation
            sx={{
              flex: 1,
              py: { xs: 1.25, md: 1.5 },
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 700,
              fontSize: { xs: "14px", md: "15px" },
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.whiteContainer.main,
              boxShadow: "none",
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
                boxShadow: "none",
              },
            }}
          >
            {t("Confirm Schedule")}
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

RestaurantScheduleTime.propTypes = {};

export default RestaurantScheduleTime;
