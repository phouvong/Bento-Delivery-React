import { Box, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import NextImage from "components/NextImage";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import StatusBadge from "components/common/StatusBadge";
import CustomFormatedDateTime from "components/date/CustomFormatedDateTime";

// ── Helpers ─────────────────────────────────────────────────────────────────
const prettyStatus = (status = "") =>
  status.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());

/**
 * RideShare order card — display only (no click / details action).
 *
 * Kept as a separate component from NewOrderCard on purpose: the ride-share
 * payload uses a completely different key shape (driver / vehicle / time / fare
 * fields) than store-based orders, so sharing one card would mean constant
 * key juggling. This card just surfaces the relevant ride info.
 *
 * Props:
 *  - ride: a single ride-request object from the ride-share orders list
 *  - bg: card background (default transparent)
 */
const RideCard = ({ ride, bg = "transparent" }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const status = ride?.current_status ?? "";
  const rideId = ride?.ref_id ?? ride?.id;

  const driverName =
    `${ride?.driver?.f_name || ""} ${ride?.driver?.l_name || ""}`.trim() ||
    t("Driver");

  const vehicleName = ride?.vehicle_category?.name ?? ride?.vehicle?.name ?? "";
  const vehicleImage =
    ride?.vehicle_category?.image_full_url ?? ride?.driver?.image_full_url;

  // The moment the ride happened (ride timeline lives under `time`).
  const rideDate = ride?.time?.created_at ?? ride?.created_at;

  // Amount paid for the ride. Falls back through the fare chain; switch to
  // `paid_fare` if the total-paid figure is preferred instead.
  const amount = ride?.actual_fare ?? ride?.estimated_fare ?? ride?.paid_fare ?? 0;

  const thumbnailSize = isMobile ? 36 : 44;

  return (
    <Box
      sx={{
        backgroundColor: bg,
        display: "grid",
        gridTemplateColumns: { xs: "1fr 1fr", md: "2fr 2fr 1fr" },
        gridTemplateAreas: {
          xs: `"col1 col1" "col2 col2" "col3 col3"`,
          md: `"col1 col2 col3"`,
        },
        gap: { xs: "10px", md: "16px" },
        alignItems: "center",
        width: "100%",
      }}
    >
      {/* Col 1: Driver name + Ride # + Status */}
      <Stack
        spacing={isMobile ? "4px" : "6px"}
        sx={{ minWidth: 0, gridArea: "col1" }}
      >
        <Typography
          sx={{
            fontSize: { xs: "16px", md: "18px" },
            fontWeight: 700,
            color: "neutral.1050",
            lineHeight: 1.1,
            letterSpacing: "-0.54px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {driverName}
        </Typography>
        <Stack direction="row" alignItems="center" gap="8px" flexWrap="wrap">
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 400,
              color: "neutral.500",
              lineHeight: 1.3,
              whiteSpace: "nowrap",
            }}
          >
            {t("Ride")} #{rideId}
          </Typography>
          {status && (
            <StatusBadge status={status} label={prettyStatus(status)} />
          )}
        </Stack>
      </Stack>

      {/* Col 2: Vehicle thumbnail + vehicle name + ride date */}
      <Stack
        direction="row"
        alignItems="center"
        gap="12px"
        sx={{ minWidth: 0, gridArea: "col2" }}
      >
        {vehicleImage && (
          <Box
            sx={{
              width: thumbnailSize,
              height: thumbnailSize,
              borderRadius: "50%",
              overflow: "hidden",
              flexShrink: 0,
              backgroundColor: "background.secondary",
            }}
          >
            <NextImage
              src={vehicleImage}
              alt={vehicleName || "vehicle"}
              width={String(thumbnailSize)}
              height={String(thumbnailSize)}
              objectFit="cover"
            />
          </Box>
        )}
        <Stack spacing="2px" sx={{ minWidth: 0 }}>
          {vehicleName && (
            <Typography
              sx={{
                fontSize: { xs: "13px", md: "14px" },
                fontWeight: 600,
                color: "neutral.1050",
                lineHeight: 1.3,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {vehicleName}
            </Typography>
          )}
          {rideDate && (
            <Typography
              sx={{
                fontSize: { xs: "12px", md: "13px" },
                fontWeight: 400,
                color: "neutral.500",
                lineHeight: 1.3,
                whiteSpace: "nowrap",
              }}
            >
              <CustomFormatedDateTime date={rideDate} />
            </Typography>
          )}
        </Stack>
      </Stack>

      {/* Col 3: Amount */}
      <Box
        sx={{
          minWidth: 0,
          gridArea: "col3",
          display: "flex",
          alignItems: "center",
          justifyContent: { xs: "flex-start", md: "flex-end" },
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "18px", md: "20px" },
            fontWeight: 700,
            color: "neutral.1050",
            lineHeight: 1.1,
            letterSpacing: "-0.6px",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {getAmountWithSign(amount)}
        </Typography>
      </Box>
    </Box>
  );
};

export default RideCard;
