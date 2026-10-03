import { Skeleton, Stack, Typography, alpha } from "@mui/material";
import { useTheme } from "@mui/material";
import moment from "moment";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  getOrderStatusNote,
  getOrderStatusTone,
  isClosedOrderStatus,
  resolveOrderEta,
} from "helper-functions/orderEta";
import { capitalizeLabel } from "helper-functions/stringHelpers";

/**
 * The Estimated Arrival block on order details.
 *
 * Every figure comes from `customer/order/track`'s `eta`, which is computed
 * server-side (Maps travel time + preparation buffer + transit buffer, with the
 * preparation buffer swapped for the real processing time once processing
 * starts) and already localised into the store's timezone. Nothing here
 * recalculates a duration — reformatting would shift the times for any viewer
 * outside that timezone.
 *
 * The server nulls `eta` for delivered / canceled / failed orders, so a closed
 * order renders its outcome rather than an estimate.
 */

interface EstimatedArrivalProps {
  trackData: any;
  isLoading?: boolean;
}

const EstimatedArrival: React.FC<EstimatedArrivalProps> = ({
  trackData,
  isLoading,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const status = trackData?.order_status;
  const eta = resolveOrderEta(trackData);
  const closed = isClosedOrderStatus(status);
  const tone = getOrderStatusTone(status);
  const statusColor = theme.palette?.[tone]?.main ?? theme.palette.primary.main;
  const note = getOrderStatusNote(status);

  if (isLoading) {
    return (
      <Stack gap="6px" sx={{ minWidth: "180px" }}>
        <Skeleton variant="text" width={110} height={16} />
        <Skeleton variant="text" width={150} height={22} />
      </Stack>
    );
  }

  // Nothing to show at all before the order resolves.
  if (!trackData?.order_status) return null;

  const deliveredAt = trackData?.delivered;
  const isDelivered = String(status).toLowerCase() === "delivered";

  // A closed order shows its outcome. Delivered replaces the estimate with the
  // time it actually arrived; cancelled / failed / refunded show only the
  // status line, never a stale estimate.
  if (closed) {
    return (
      <Stack gap="2px">
        {isDelivered && deliveredAt ? (
          <>
            <Typography
              fontSize={{ xs: "11px", md: "12px" }}
              color={theme.palette.neutral[500]}
            >
              {t("Delivered at")}
            </Typography>
            <Typography
              fontSize={{ xs: "13px", md: "15px" }}
              fontWeight="700"
              color={statusColor}
            >
              {moment(deliveredAt).format("h:mm A")}
            </Typography>
          </>
        ) : null}
        {note ? (
          <Typography
            fontSize={{ xs: "11px", md: "12px" }}
            color={theme.palette.neutral[500]}
          >
            {t("Your order is")}{" "}
            <Typography
              component="span"
              fontSize={{ xs: "11px", md: "12px" }}
              fontWeight="700"
              color={statusColor}
            >
              {t(capitalizeLabel(status))}
            </Typography>
            {". "}
            {t(note)}
          </Typography>
        ) : null}
      </Stack>
    );
  }

  // Running order with no ETA from the server — say so rather than showing a
  // guessed window or an empty gap.
  const arrival = eta?.window || eta?.label;

  return (
    <Stack
      gap="2px"
      sx={{
        borderRadius: "8px",
        px: { xs: 0, md: "10px" },
        py: { xs: 0, md: "6px" },
        backgroundColor: {
          xs: "transparent",
          md: alpha(statusColor, 0.06),
        },
      }}
    >
      <Typography
        fontSize={{ xs: "11px", md: "12px" }}
        fontWeight="500"
        color={theme.palette.neutral[500]}
        lineHeight={1.3}
      >
        {t("Estimated Arrival")}
      </Typography>
      <Typography
        fontSize={{ xs: "13px", md: "15px" }}
        fontWeight="700"
        lineHeight={1.3}
        color={eta?.overdue ? theme.palette.warning.main : statusColor}
      >
        {arrival || t("Calculating…")}
      </Typography>
      {note ? (
        <Typography
          fontSize={{ xs: "11px", md: "12px" }}
          color={theme.palette.neutral[500]}
          lineHeight={1.4}
        >
          {t("Your order is")}{" "}
          <Typography
            component="span"
            fontSize={{ xs: "11px", md: "12px" }}
            fontWeight="700"
            color={statusColor}
          >
            {t(capitalizeLabel(status))}
          </Typography>
          {". "}
          {t(note)}
        </Typography>
      ) : null}
    </Stack>
  );
};

export default EstimatedArrival;
