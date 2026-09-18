import { Box, Stack, Typography, alpha, useTheme } from "@mui/material";
import StatusBadge from "components/common/StatusBadge";
import CustomFormatedTime from "components/date/CustomFormatedTime";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { capitalizeLabel } from "helper-functions/stringHelpers";
import moment from "moment";

const paymentStatusColor = (theme, status) => {
  const key = (status ?? "").toLowerCase();
  if (key === "paid") return theme.palette.success.main;
  if (key === "partially_paid") return theme.palette.warning.main;
  return theme.palette.error.main;
};

const ServiceCard = ({ heading, booking, t, onViewDetails }) => {
  const theme = useTheme();
  const momentDate = booking?.schedule_at ? moment(booking.schedule_at) : null;
  // Each occurrence carries its own payment status/amount — don't fall back
  // to the parent repeat booking's totals, they cover the whole series.
  const paymentStatus = booking?.payment_status;
  const bookingAmount = booking?.booking_amount;

  return (
    <Box
      sx={{
        border: `1px solid ${alpha(theme.palette.neutral[400], 0.2)}`,
        borderRadius: "8px",
        padding: { xs: "14px", md: "16px" },
        width: "100%",
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb="10px"
      >
        <Typography
          sx={{
            fontSize: { xs: "14px", md: "16px" },
            fontWeight: 600,
            color: theme.palette.text.primary,
          }}
        >
          {heading}
        </Typography>
        <Typography
          onClick={onViewDetails}
          sx={{
            fontSize: { xs: "13px", md: "14px" },
            fontWeight: 600,
            color: theme.palette.text.link,
            cursor: "pointer",
          }}
        >
          {t("View Details")}
        </Typography>
      </Stack>

      <Box sx={{ borderBottom: `1px solid ${theme.palette.divider}`, mb: "12px" }} />

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        gap="12px"
      >
        <Stack gap="6px" sx={{ minWidth: 0 }}>
          <Stack direction="row" alignItems="center" gap="8px" flexWrap="wrap">
            <Typography
              sx={{
                fontSize: { xs: "16px", md: "18px" },
                fontWeight: 700,
                color: theme.palette.text.primary,
              }}
            >
              {t("ID")} #{booking?.display_id ?? booking?.id}
            </Typography>
            <StatusBadge
              status={booking?.booking_status}
              label={capitalizeLabel(booking?.booking_status)}
            />
          </Stack>
          {momentDate && (
            <Typography
              sx={{
                fontSize: { xs: "12px", md: "14px" },
                color: theme.palette.text.secondary,
              }}
            >
              {momentDate.format("DD-MMM-YYYY")} , {momentDate.format("dddd")} ,{" "}
              <CustomFormatedTime date={booking.schedule_at} />
            </Typography>
          )}
        </Stack>

        <Stack gap="4px" alignItems="flex-end" sx={{ flexShrink: 0 }}>
          <Typography
            sx={{
              fontSize: { xs: "13px", md: "14px" },
              fontWeight: 700,
              color: paymentStatusColor(theme, paymentStatus),
            }}
          >
            {t(capitalizeLabel(paymentStatus) || "Unpaid")}
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "16px", md: "18px" },
              fontWeight: 700,
              color: theme.palette.text.primary,
            }}
          >
            {getAmountWithSign(bookingAmount)}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ServiceCard;
