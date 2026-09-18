import React, { useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import { Box, Stack, Button, IconButton, Typography } from "@mui/material";
import CloseIcon from "components/icons/CloseIcon";
import { alpha } from "@mui/system";
import { t } from "i18next";
import useCancelBooking from "../../rental-api-manage/hooks/react-query/cancel-booking/useCancelBooking";
import toast from "react-hot-toast";
import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { getGuestId } from "helper-functions/getToken";

const RentalCancelBooking = ({ tripDetails, refetchData, handleClose }) => {
  const { mutate: cancelMutate, isLoading: cancelLoading } = useCancelBooking();
  const handleCancelBooking = () => {
    cancelMutate(
      { method: "PUT", trip_id: tripDetails?.id, guest_id: getGuestId() },
      {
        onSuccess: (response) => {
          toast.success(response?.message);
          refetchData();
          handleClose?.();
        },
        onError: onSingleErrorResponse,
      }
    );
  };
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "462px",
        p: 3,
        position: "relative",
        mx: "auto", // Center horizontally
        backgroundColor: (theme) => theme.palette.background.paper,
        borderRadius: 2,
        boxShadow: (theme) => theme.shadows[3],
      }}
    >
      {/* Close Icon */}
      <IconButton
        onClick={handleClose}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          color: (theme) => theme.palette.text.primary,
        }}
      >
        <CloseIcon sx={{ fontSize: "16px" }} />
      </IconButton>

      {/* Cancel Icon */}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <CancelIcon
          sx={{
            color: (theme) => theme.palette.error.main,
            fontSize: "55px",
          }}
        />
      </Box>

      {/* Text Content */}
      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: (theme) => theme.palette.text.primary,
          }}
        >
          {t("Are you sure you want to cancel the booking?")}
        </Typography>

       
      </Box>

      {/* Action Buttons */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        justifyContent="center"
        sx={{ mt: 4 }}
      >
        <Button
          onClick={handleCancelBooking}
          isLoading={cancelLoading ? true : false}
          disabled={cancelLoading ? true : false}
          variant="contained"
          fullWidth
          sx={{
            py: 1.5,
            fontSize: "14px",
            borderRadius: 1,
          }}
        >
          {t(cancelLoading ? "Cancelling..." : "Yes, Cancel")}
        </Button>

        <Button
          onClick={handleClose}
          //disabled={cancelLoading ? true : false}
          variant="contained"
          fullWidth
          sx={{
            py: 1.5,
            fontSize: "14px",
            borderRadius: 1,
            backgroundColor: (theme) => theme.palette.error.main,
            "&:hover": {
              backgroundColor: (theme) => alpha(theme.palette.error.main, 0.85),
            },
          }}
        >
          {t("Not Now")}
        </Button>
      </Stack>
    </Box>
  );
};

export default RentalCancelBooking;
