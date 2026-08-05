import {
  Box,
  Button,
  Collapse,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import IconButton from "@mui/material/IconButton";
import LoadingButton from "@mui/lab/LoadingButton";
import StatusBadge from "components/common/StatusBadge";
import CustomFormatedTime from "components/date/CustomFormatedTime";
import CustomModal from "components/modal";
import useCancelServiceBooking from "components/home/module-wise-components/service/service-api-manage/hooks/react-query/booking/useCancelServiceBooking";
import { getGuestId } from "helper-functions/getToken";
import moment from "moment";
import { useState } from "react";
import toast from "react-hot-toast";
import { capitalizeLabel } from "helper-functions/stringHelpers";

const CustomBookingList = ({ bookings, expanded, onToggle, isPending, t }) => {
  const theme = useTheme();
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const { mutate: cancelBooking, isLoading: isCancelling } =
    useCancelServiceBooking();

  const closeConfirm = () => setBookingToCancel(null);

  const handleConfirmCancel = () => {
    if (!bookingToCancel?.id) return;
    cancelBooking(
      { booking_id: bookingToCancel.id, guest_id: getGuestId() },
      {
        onSuccess: (response) => {
          toast.success(
            response?.message ?? t("Booking cancelled successfully"),
          );
          closeConfirm();
        },
      },
    );
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        borderRadius: "8px",
        overflow: "hidden",
        width: "100%",
        mt: { xs: "16px", md: "20px" },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        onClick={onToggle}
        sx={{
          px: { xs: "14px", md: "16px" },
          py: { xs: "10px", md: "12px" },
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "14px", md: "16px" },
            fontWeight: 700,
            color: theme.palette.text.primary,
          }}
        >
          {t("Selected Days & Time")} ({bookings.length})
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            backgroundColor: theme.palette.background.secondary,
          }}
        >
          {expanded ? (
            <KeyboardArrowUpIcon
              sx={{ color: theme.palette.text.secondary, fontSize: "24px" }}
            />
          ) : (
            <KeyboardArrowDownIcon
              sx={{ color: theme.palette.text.secondary, fontSize: "24px" }}
            />
          )}
        </Box>
      </Stack>

      <Collapse in={expanded}>
        <Stack
          sx={{
            maxHeight: "300px",
            overflowY: "auto",
            scrollbarWidth: "thin",
            scrollbarColor: "transparent transparent",
            "&::-webkit-scrollbar": { width: "4px" },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "transparent",
              borderRadius: "999px",
              transition: "background-color 0.25s ease",
            },
            "&:hover": {
              scrollbarColor: `${theme.palette.divider} transparent`,
            },
            "&:hover::-webkit-scrollbar-thumb": {
              backgroundColor: theme.palette.divider,
            },
          }}
        >
          {bookings.map((booking, index) => (
            <Stack
              key={booking?.id ?? index}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{
                px: { xs: "14px", md: "16px" },
                py: { xs: "10px", md: "12px" },
                borderBottom:
                  index < bookings.length - 1
                    ? `1px solid ${theme.palette.divider}`
                    : "none",
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                gap="8px"
                flexWrap="wrap"
              >
                <Typography
                  sx={{
                    fontSize: { xs: "12px", md: "14px" },
                    color: theme.palette.text.primary,
                  }}
                >
                  {moment(booking?.schedule_at).format("ddd, MMM D")}
                </Typography>
                <StatusBadge
                  status={booking?.booking_status}
                  label={capitalizeLabel(booking?.booking_status)}
                />
              </Stack>

              <Typography
                sx={{
                  flex: 1,
                  textAlign: "center",
                  fontSize: { xs: "12px", md: "14px" },
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                }}
              >
                <CustomFormatedTime date={booking?.schedule_at} />
              </Typography>

              {isPending(booking) ? (
                <IconButton
                  size="small"
                  onClick={() => setBookingToCancel(booking)}
                  sx={{ color: theme.palette.error.red }}
                >
                  <i
                    className="fi fi-rr-trash"
                    style={{
                      fontSize: "18px",
                      lineHeight: 1,
                      color: "currentColor",
                    }}
                  />
                </IconButton>
              ) : (
                <Box sx={{ width: "34px" }} />
              )}
            </Stack>
          ))}
        </Stack>
      </Collapse>

      <CustomModal
        openModal={!!bookingToCancel}
        handleClose={closeConfirm}
        closeButton
        maxWidth="360px"
      >
        <DialogTitle sx={{ pb: 0 }}>
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: 700,
              color: theme.palette.text.primary,
            }}
          >
            {t("Cancel Booking")}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography
            sx={{ fontSize: "14px", color: theme.palette.text.secondary }}
          >
            {t("Are you sure you want to cancel this scheduled service")}
            {bookingToCancel?.schedule_at && (
              <>
                {" ("}
                {moment(bookingToCancel.schedule_at).format("ddd, MMM D")}
                {", "}
                <CustomFormatedTime date={bookingToCancel.schedule_at} />
                {")"}
              </>
            )}
            ?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: "24px", pb: "20px", gap: "10px" }}>
          <Button onClick={closeConfirm} variant="outlined" sx={{ flex: 1 }}>
            {t("Back")}
          </Button>
          <LoadingButton
            onClick={handleConfirmCancel}
            loading={isCancelling}
            variant="contained"
            color="error"
            sx={{ flex: 1 }}
          >
            {t("Cancel Booking")}
          </LoadingButton>
        </DialogActions>
      </CustomModal>
    </Box>
  );
};

export default CustomBookingList;
