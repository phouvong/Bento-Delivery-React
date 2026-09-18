import {
  Box,
  Skeleton,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import CustomFormatedTime from "components/date/CustomFormatedTime";
import moment from "moment";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import ServiceCard from "./ServiceCard";
import CustomBookingList from "./custom-booking/CustomBookingList";
import useGetServiceBookingLog from "components/home/module-wise-components/service/service-api-manage/hooks/react-query/booking/useGetServiceBookingLog";

const FINISHED_STATUSES = ["completed", "cancelled", "canceled"];
const isFinished = (booking) =>
  FINISHED_STATUSES.includes((booking?.booking_status ?? "").toLowerCase());
const isPending = (booking) =>
  (booking?.booking_status ?? "").toLowerCase() === "pending";

const RepeatBookingInfo = ({ data, t }) => {
  const theme = useTheme();
  const router = useRouter();
  const [logExpanded, setLogExpanded] = useState(true);
  const { orderId } = router.query;
  const { data: repeatLog, isLoading: isLogLoading } = useGetServiceBookingLog(
    { id: orderId },
    true,
  );
  const instances = useMemo(
    () => (repeatLog?.bookings ?? []).filter((log) => !log?.is_repeat_parent),
    [repeatLog],
  );

  if (isLogLoading) {
    return (
      <Stack gap={{ xs: "14px", md: "16px" }} sx={{ width: "100%" }}>
        <Skeleton variant="rounded" height={140} sx={{ borderRadius: "8px" }} />
        <Skeleton variant="rounded" height={110} sx={{ borderRadius: "8px" }} />
      </Stack>
    );
  }

  if (!instances.length) return null;

  const sorted = [...instances].sort(
    (a, b) =>
      moment(a?.schedule_at).valueOf() - moment(b?.schedule_at).valueOf(),
  );

  const repeatType = (data?.multi_booking_type ?? "daily").toLowerCase();
  const isWeekly = repeatType === "weekly";
  const isCustom = repeatType === "custom";

  const daysLabel = isWeekly
    ? [
        ...new Set(
          sorted.map((booking) => moment(booking?.schedule_at).format("dddd")),
        ),
      ].join(", ")
    : null;

  const now = moment();
  const unfinished = sorted.filter((booking) => !isFinished(booking));

  const ongoingBookings = unfinished.filter(
    (booking) => !moment(booking?.schedule_at).isAfter(now),
  );

  const nextBookings = unfinished.filter((booking) =>
    moment(booking?.schedule_at).isAfter(now),
  );

  const fallbackBooking =
    !ongoingBookings.length && !nextBookings.length
      ? sorted[sorted.length - 1]
      : null;

  const completedBookings = sorted
    .filter(isFinished)
    .filter((booking) => booking?.id !== fallbackBooking?.id);

  const startDate = sorted[0]?.schedule_at;
  const endDate = sorted[sorted.length - 1]?.schedule_at;

  const goToBookingDetails = (bookingId) => {
    if (!bookingId) return;
    router.push({
      pathname: "/profile",
      query: {
        page: "my-orders",
        orderId: bookingId,
        parentBookingId: data?.id,
        ...(router.query.orderTabModule
          ? { orderTabModule: router.query.orderTabModule }
          : {}),
      },
    });
  };

  return (
    <Stack gap={{ xs: "14px", md: "16px" }} sx={{ width: "100%" }}>
      <Box
        sx={{
          border: `1px solid ${alpha(theme.palette.neutral[400], 0.2)}`,
          borderRadius: "8px",
          padding: { xs: "14px", md: "16px" },
          width: "100%",
        }}
      >
        <Stack direction="row" flexWrap="wrap" alignItems="baseline" gap="6px">
          <Typography
            sx={{
              fontSize: { xs: "16px", md: "18px" },
              fontWeight: 700,
              color: theme.palette.text.primary,
            }}
          >
            {t("Repeat This Service")}
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "16px", md: "18px" },
              fontWeight: 700,
              color: theme.palette.text.link,
            }}
          >
            {sorted.length} {t("times")}
          </Typography>
        </Stack>

        <Typography
          sx={{
            fontSize: { xs: "12px", md: "14px" },
            color: theme.palette.text.secondary,
            mt: "6px",
            mb: "10px",
          }}
        >
          {t("This booking will be continued")}
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          gap={{ xs: "4px", sm: "20px" }}
          flexWrap="wrap"
        >
          {startDate && endDate && (
            <Stack direction="row" alignItems="baseline" gap="6px">
              <Typography
                sx={{
                  fontSize: { xs: "12px", md: "14px" },
                  color: theme.palette.text.primary,
                }}
              >
                {t("Date")} :
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "12px", md: "14px" },
                  fontWeight: 600,
                  color: theme.palette.text.link,
                }}
              >
                {moment(startDate).format("Do MMM, YYYY")} -{" "}
                {moment(endDate).format("Do MMM, YYYY")}
              </Typography>
            </Stack>
          )}
          {isWeekly && daysLabel && (
            <Stack direction="row" alignItems="baseline" gap="6px">
              <Typography
                sx={{
                  fontSize: { xs: "12px", md: "14px" },
                  color: theme.palette.text.primary,
                }}
              >
                {t("Day")} :
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "12px", md: "14px" },
                  fontWeight: 600,
                  color: theme.palette.text.link,
                }}
              >
                {daysLabel}
              </Typography>
            </Stack>
          )}
          {startDate && (
            <Stack direction="row" alignItems="baseline" gap="6px">
              <Typography
                sx={{
                  fontSize: { xs: "12px", md: "14px" },
                  color: theme.palette.text.primary,
                }}
              >
                {t("Time")} :
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "12px", md: "14px" },
                  fontWeight: 600,
                  color: theme.palette.text.link,
                }}
              >
                <CustomFormatedTime date={startDate} />
              </Typography>
            </Stack>
          )}
        </Stack>
        {isCustom && (
          <CustomBookingList
            bookings={sorted}
            expanded={logExpanded}
            onToggle={() => setLogExpanded((v) => !v)}
            isPending={isPending}
            t={t}
          />
        )}
      </Box>

      <Stack
        gap={{ xs: "14px", md: "16px" }}
        sx={{
          maxHeight: "300px",
          overflowY: "auto",
          overflowX: "hidden",
          py: 1.5,
          scrollbarWidth: "thin",
          scrollbarColor: "transparent transparent",
          "&::-webkit-scrollbar": { width: "4px" },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "transparent",
            borderRadius: "999px",
            transition: "background-color 0.25s ease",
          },
          "&:hover": { scrollbarColor: `${theme.palette.divider} transparent` },
          "&:hover::-webkit-scrollbar-thumb": {
            backgroundColor: theme.palette.divider,
          },
        }}
      >
        {!isCustom && fallbackBooking && (
          <ServiceCard
            heading={t("Ongoing Service")}
            booking={fallbackBooking}
            t={t}
            onViewDetails={() => goToBookingDetails(fallbackBooking?.id)}
          />
        )}

        {!isCustom &&
          ongoingBookings.map((booking) => (
            <ServiceCard
              key={booking?.id}
              heading={t("Ongoing Service")}
              booking={booking}
              t={t}
              onViewDetails={() => goToBookingDetails(booking?.id)}
            />
          ))}

        {nextBookings.map((booking) => (
          <ServiceCard
            key={booking?.id}
            heading={t("Next Service")}
            booking={booking}
            t={t}
            onViewDetails={() => goToBookingDetails(booking?.id)}
          />
        ))}
        {!isCustom &&
          completedBookings.map((booking) => {
            const isCanceled = ["cancelled", "canceled"].includes(
              (booking?.booking_status ?? "").toLowerCase(),
            );
            return (
              <ServiceCard
                key={booking?.id}
                heading={isCanceled ? t("Canceled") : t("Completed")}
                booking={booking}
                t={t}
                onViewDetails={() => goToBookingDetails(booking?.id)}
              />
            );
          })}
      </Stack>
    </Stack>
  );
};

export default RepeatBookingInfo;
