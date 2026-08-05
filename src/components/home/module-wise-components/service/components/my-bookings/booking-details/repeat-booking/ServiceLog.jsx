import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Box,
  CircularProgress,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import StatusBadge from "components/common/StatusBadge";
import CustomFormatedTime from "components/date/CustomFormatedTime";
import useDownloadServiceInvoice from "components/home/module-wise-components/service/service-api-manage/hooks/react-query/booking/useDownloadServiceInvoice";
import { capitalizeLabel } from "helper-functions/stringHelpers";
import moment from "moment";
import { useRouter } from "next/router";
import { useState } from "react";

const FINISHED_STATUSES = ["completed", "cancelled", "canceled"];

const statusBucket = (booking) => {
  const status = (booking?.booking_status ?? "").toLowerCase();
  if (status === "ongoing") return "ongoing";
  if (FINISHED_STATUSES.includes(status)) return "completed";
  return "upcoming";
};

const COL_BOOKING = { flex: 1, flexShrink: 0 };
const COL_SCHEDULE = { flex: 1, minWidth: 0 };
const COL_ACTIONS = { width: 92, flexShrink: 0 };

const SectionHeader = ({ label }) => (
  <Stack
    direction="row"
    alignItems="center"
    gap={{ xs: "16px", md: "20px" }}
    sx={{ mb: "8px" }}
  >
    <Box sx={{ flex: 1, height: "1px", backgroundColor: "divider" }} />
    <Typography
      sx={{
        fontSize: { xs: "14px", md: "16px" },
        fontWeight: 700,
        color: "neutral.500",
        lineHeight: 1.1,
        letterSpacing: "-0.54px",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </Typography>
    <Box sx={{ flex: 1, height: "1px", backgroundColor: "divider" }} />
  </Stack>
);

const RowActionButton = ({ children, onClick, disabled }) => (
  <IconButton
    size="small"
    onClick={onClick}
    disabled={disabled}
    sx={{
      width: "40px",
      height: "40px",
      borderRadius: "8px",
      backgroundColor: "background.secondary",
      color: "text.primary",
    }}
  >
    {children}
  </IconButton>
);

const ServiceLogRow = ({ booking, showStatus, onView, t }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [menuAnchor, setMenuAnchor] = useState(null);

  const momentDate = booking?.schedule_at ? moment(booking.schedule_at) : null;
  const isPending = (booking?.booking_status ?? "").toLowerCase() === "pending";

  const { mutate: downloadInvoice, isLoading: isDownloading } =
    useDownloadServiceInvoice();

  const openMenu = (e) => setMenuAnchor(e.currentTarget);
  const closeMenu = () => setMenuAnchor(null);

  const handleView = () => {
    closeMenu();
    onView(booking);
  };

  const handleDownload = () => {
    if (!booking?.id || isDownloading) return;
    downloadInvoice(booking.id);
  };

  const bookingLabel = (
    <Stack direction="row" alignItems="center" gap="8px" flexWrap="wrap">
      <Typography
        sx={{
          fontSize: { xs: "14px", md: "16px" },
          fontWeight: 700,
          color: "text.primary",
        }}
      >
        {t("Booking Id")} #{booking?.display_id ?? booking?.id}
      </Typography>
      {showStatus && !isPending && (
        <StatusBadge
          status={booking?.booking_status}
          label={t(capitalizeLabel(booking?.booking_status))}
        />
      )}
    </Stack>
  );

  const scheduleInfo = (
    <Stack gap="4px" sx={COL_SCHEDULE}>
      <Typography
        sx={{ fontSize: { xs: "12px", md: "14px" }, color: "text.secondary" }}
      >
        {t("Service Provided at")}
      </Typography>

      {momentDate && (
        <Stack direction="row" alignItems="baseline" gap="4px" flexWrap="wrap">
          <Typography
            sx={{ fontSize: { xs: "12px", md: "14px" }, color: "text.primary" }}
          >
            {t("Date")} :
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "12px", md: "14px" },
              fontWeight: 600,
              color: "text.link",
            }}
          >
            {momentDate.format("DD MMM YYYY")}, {momentDate.format("dddd")},{" "}
            <CustomFormatedTime date={booking.schedule_at} />
          </Typography>
        </Stack>
      )}
    </Stack>
  );

  const dropdownMenu = (
    <Menu
      anchorEl={menuAnchor}
      open={Boolean(menuAnchor)}
      onClose={closeMenu}
      PaperProps={{
        sx: {
          borderRadius: "10px",
          boxShadow: `0 4px 16px ${alpha(theme.palette.text.primary, 0.12)}`,
          minWidth: 160,
        },
      }}
    >
      <MenuItem onClick={handleView} sx={{ gap: "8px" }}>
        <ListItemIcon sx={{ minWidth: "auto", color: "neutral.500" }}>
          <i
            className="fi fi-rr-eye"
            style={{ fontSize: "16px", display: "flex" }}
          />
        </ListItemIcon>
        <Typography sx={{ fontSize: "14px" }}>{t("View")}</Typography>
      </MenuItem>
      <MenuItem
        onClick={() => {
          closeMenu();
          handleDownload();
        }}
        disabled={isDownloading}
        sx={{ gap: "8px" }}
      >
        <ListItemIcon sx={{ minWidth: "auto", color: "neutral.500" }}>
          {isDownloading ? (
            <CircularProgress size={16} />
          ) : (
            <i
              className="fi fi-rr-download"
              style={{ fontSize: "16px", display: "flex" }}
            />
          )}
        </ListItemIcon>
        <Typography sx={{ fontSize: "14px" }}>{t("Download")}</Typography>
      </MenuItem>
    </Menu>
  );

  if (isMobile) {
    return (
      <Box sx={{ py: "14px" }}>
        <Stack
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
          gap="12px"
        >
          {bookingLabel}
          {!isPending && (
            <IconButton
              size="small"
              onClick={openMenu}
              sx={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                border: "1px solid",
                borderColor: "divider",
                backgroundColor: "background.paper",
                color: "text.primary",
                flexShrink: 0,
              }}
            >
              <MoreVertIcon sx={{ fontSize: 18 }} />
            </IconButton>
          )}
        </Stack>

        <Box>{scheduleInfo}</Box>

        {!isPending && dropdownMenu}
      </Box>
    );
  }

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      gap="16px"
      sx={{ py: "16px" }}
    >
      <Box sx={COL_BOOKING}>{bookingLabel}</Box>

      {scheduleInfo}

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        gap="10px"
        sx={COL_ACTIONS}
      >
        {!isPending && (
          <>
            <RowActionButton onClick={handleDownload} disabled={isDownloading}>
              {isDownloading ? (
                <CircularProgress size={16} />
              ) : (
                <i
                  className="fi fi-rr-download"
                  style={{ fontSize: "16px", lineHeight: 1, display: "flex" }}
                />
              )}
            </RowActionButton>
            <RowActionButton onClick={handleView}>
              <i
                className="fi fi-rr-eye"
                style={{ fontSize: "16px", lineHeight: 1, display: "flex" }}
              />
            </RowActionButton>
          </>
        )}
      </Stack>
    </Stack>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
const ServiceLog = ({ data, parentBookingId, t }) => {
  const theme = useTheme();
  const router = useRouter();

  const bookings = Array.isArray(data?.bookings) ? data.bookings : [];

  if (!bookings.length) return null;

  const sorted = [...bookings].sort(
    (a, b) =>
      moment(a?.schedule_at).valueOf() - moment(b?.schedule_at).valueOf(),
  );

  const ongoing = sorted.filter(
    (booking) => statusBucket(booking) === "ongoing",
  );
  const completed = sorted.filter(
    (booking) => statusBucket(booking) === "completed",
  );
  const upcoming = sorted.filter(
    (booking) => statusBucket(booking) === "upcoming",
  );

  const goToBookingDetails = (booking) => {
    if (!booking?.id) return;
    router.push({
      pathname: "/profile",
      query: {
        page: "my-orders",
        orderId: booking.id,
        parentBookingId,
        ...(router.query.orderTabModule
          ? { orderTabModule: router.query.orderTabModule }
          : {}),
      },
    });
  };

  const sections = [
    { key: "ongoing", label: t("Ongoing"), items: ongoing, showStatus: true },
    {
      key: "completed",
      label: t("Completed"),
      items: completed,
      showStatus: true,
    },
    {
      key: "upcoming",
      label: t("Upcoming"),
      items: upcoming,
      showStatus: true,
    },
  ].filter((section) => section.items.length);

  return (
    <Box
      sx={{
        // border: `1px solid ${alpha(theme.palette.neutral[400], 0.2)}`,
        borderRadius: "8px",
        padding: { xs: "14px", md: "16px" },
        paddingTop: { xs: "0px", md: "0px" },
        width: "100%",
      }}
    >
      <Stack spacing={{ xs: "16px", md: "24px" }}>
        {sections.map((section) => (
          <Stack key={section.key} spacing={0}>
            <SectionHeader label={section.label} />
            <Stack
              divider={<Divider sx={{ borderColor: "divider" }} />}
              spacing={0}
            >
              {section.items.map((booking) => (
                <ServiceLogRow
                  key={booking?.id}
                  booking={booking}
                  showStatus={section.showStatus}
                  onView={goToBookingDetails}
                  t={t}
                />
              ))}
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
};

export default ServiceLog;
