import { Box, Button, Stack, Typography, alpha, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { getToken } from "helper-functions/getToken";
import { setOpenSignInModal } from "redux/slices/utils";
import { setOfflineMethod } from "redux/slices/offlinePaymentData";
import useServiceBusinessConfig from "components/home/module-wise-components/service/service-api-manage/hooks/custom-hooks/useServiceBusinessConfig";
import MultipleBooking from "./multiple-booking/MultipleBooking";
import SingleBooking from "./single-booking/SingleBooking";

const BOOKING_TYPES = [
  { key: "regular", label: "Single Booking" },
  { key: "repeat", label: "Multiple Booking" },
];

const BookingType = ({
  configData,
  address,
  setAddress,
  scheduledAt,
  setScheduledAt,
  bookingType,
  setBookingType,
  multiBookingType,
  setMultiBookingType,
  onRepeatDatesChange,
  providerData,
  setPaymentMethod,
  disableRepeat,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const token = getToken();
  const selected = bookingType;
  const setSelected = setBookingType;

  const { singleBookingAvailable, repeatBookingEnabled } =
    useServiceBusinessConfig(configData, providerData);
  const availableTypes = BOOKING_TYPES.filter(({ key }) => {
    if (key === "regular") return singleBookingAvailable;
    return !disableRepeat && repeatBookingEnabled;
  });

  // Keep the selected tab valid if the config disables the one currently active.
  useEffect(() => {
    if (
      availableTypes.length > 0 &&
      !availableTypes.some(({ key }) => key === selected)
    ) {
      setSelected(availableTypes[0].key);
    }
  }, [availableTypes.map(({ key }) => key).join(","), selected]);

  const handleBookingTypeChange = (key) => {
    if (key === "repeat" && !token) {
      toast(t("Please log in to use Multiple Booking"), { icon: "🔒" });
      dispatch(setOpenSignInModal(true));
      return;
    }
    if (key !== selected) {
      // Reset any digital/offline payment selection made on the other tab —
      // Multiple Booking always pays cash after service, and Single Booking
      // should start fresh rather than inherit a leftover gateway choice.
      setPaymentMethod?.("cash_on_delivery");
      dispatch(setOfflineMethod(""));
    }
    setSelected(key);
  };

  const pillButtonSx = (isSelected) => ({
    minWidth: { xs: "auto", md: 140 },
    px: { xs: 2, md: 3 },
    py: { xs: 0.75, md: 1 },
    borderRadius: "8px",
    textTransform: "none",
    fontWeight: 600,
    fontSize: { xs: "12px", md: "14px" },
    boxShadow: "none",
    transition: "background-color 0.2s, color 0.2s",
    backgroundColor: isSelected ? theme.palette.primary.main : "transparent",
    color: isSelected
      ? theme.palette.whiteContainer.main
      : theme.palette.neutral[700],
    "&:hover": {
      backgroundColor: isSelected
        ? theme.palette.primary.dark
        : alpha(theme.palette.primary.main, 0.08),
      boxShadow: "none",
    },
  });

  return (
    <>
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
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems="center"
          justifyContent="space-between"
          gap={{ xs: 1.5, sm: 2 }}
          width="100%"
        >
          <Typography
            sx={{
              display: { xs: "none", md: "block" },
              fontWeight: 700,
              fontSize: "16px",
              color: theme.palette.text.primary,
              whiteSpace: "nowrap",
            }}
          >
            {t("Choose Booking Type")}
          </Typography>

          {availableTypes.length > 0 && (
            <Stack
              direction="row"
              gap={{ xs: 0.5, md: 1 }}
              justifyContent={{ xs: "flex-start", sm: "flex-end" }}
              alignItems={{ xs: "center", sm: "flex-end" }}
            >
              {availableTypes.map(({ key, label }) => {
                const isSelected = selected === key;
                return (
                  <Button
                    key={key}
                    onClick={() => handleBookingTypeChange(key)}
                    variant={isSelected ? "contained" : "text"}
                    disableElevation
                    sx={pillButtonSx(isSelected)}
                  >
                    {t(label)}
                  </Button>
                );
              })}
            </Stack>
          )}
        </Stack>
      </Box>

      {selected === "regular" ? (
        <SingleBooking
          configData={configData}
          address={address}
          setAddress={setAddress}
          scheduledAt={scheduledAt}
          setScheduledAt={setScheduledAt}
          providerData={providerData}
        />
      ) : (
        <MultipleBooking
          multiBookingType={multiBookingType}
          setMultiBookingType={setMultiBookingType}
          onDatesChange={onRepeatDatesChange}
          providerData={providerData}
        />
      )}
    </>
  );
};

export default BookingType;
