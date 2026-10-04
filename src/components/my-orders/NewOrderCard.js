import {
  Box,
  Button,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useState } from "react";
import NextImage from "components/NextImage";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { setDeliveryManInfoByDispatch } from "redux/slices/searchFilter";
import StatusBadge from "components/common/StatusBadge";
import TrackParcelOrderDrawer from "components/home/module-wise-components/parcel/TrackParcelOrderDrawer";

// ── Status logic ──────────────────────────────────────────────────────────────

const TRACK_STATUSES = [
  "confirmed",
  "accepted",
  "processing",
  "picked_up",
  "ongoing",
  "on the way",
  "on_the_way",
];
const DELIVERED_STATUSES = ["delivered", "completed"];

const getActionType = (status = "") => {
  const s = status.toLowerCase().replace(/_/g, " ");
  if (DELIVERED_STATUSES.includes(s)) return "reorder";
  if (TRACK_STATUSES.includes(s) || TRACK_STATUSES.includes(status))
    return "track";
  return "details";
};

// ── Item thumbnails ───────────────────────────────────────────────────────────

const ItemThumbnails = ({ details = [], size = 36 }) => {
  const theme = useTheme();
  const visible = details.slice(0, 2);
  const overflow = details.length - visible.length;

  return (
    <Stack direction="row" alignItems="center" sx={{ flexShrink: 0 }}>
      {visible.map((d, i) => (
        <Box
          key={d?.id ?? i}
          sx={{
            width: size,
            height: size,
            borderRadius: "50%",
            border: `2px solid ${theme.palette.background.paper}`,
            overflow: "hidden",
            ml: i === 0 ? 0 : `-${size * 0.22}px`,
            flexShrink: 0,
            backgroundColor: "background.secondary",
          }}
        >
          {d?.image_full_url && (
            <NextImage
              src={d?.image_full_url}
              alt={d?.name ?? ""}
              width={String(size)}
              height={String(size)}
              objectFit="cover"
            />
          )}
        </Box>
      ))}
      {overflow > 0 && (
        <Box
          sx={{
            width: size,
            height: size,
            borderRadius: "50%",
            backgroundColor: "background.secondary",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ml: `-${size * 0.22}px`,
            flexShrink: 0,
          }}
        >
          <Typography
            sx={{ fontSize: "13px", fontWeight: 600, color: "neutral.500" }}
          >
            +{overflow}
          </Typography>
        </Box>
      )}
    </Stack>
  );
};

// ── Item description ──────────────────────────────────────────────────────────

const itemNamesFrom = (details = []) =>
  details
    .slice(0, 3)
    .map((d) => d?.name)
    .filter(Boolean)
    .join(", ");

// ── Main component ────────────────────────────────────────────────────────────

/**
 * New order card — Figma 2348:220813 (desktop) / 2348:220990 (mobile)
 *
 * Props:
 *  - order: order object from API
 *  - bg: backgroundColor of the card (default: "transparent")
 *  - configData
 */
const NewOrderCard = ({ order, bg = "transparent", configData }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [parcelDrawerOpen, setParcelDrawerOpen] = useState(false);

  const status = order?.order_status ?? "";
  // When the reorder feature is disabled in config, a delivered order should
  // not surface a "Re-order" button — fall back to "Details" instead.
  const rawActionType = getActionType(status);
  const actionType =
    rawActionType === "reorder" &&
    (!configData?.repeat_order_option || !order?.can_reorder)
      ? "details"
      : rawActionType;

  const storeName =
    order?.module_type === "parcel"
      ? order?.parcel_category?.name ?? t("Parcel")
      : order?.store?.name ?? "";

  const itemDescription = itemNamesFrom(order?.items_preview ?? []);
  const thumbnailSize = isMobile ? 28 : 36;

  // Preserve the selected order module tab across the details round-trip so
  // "Back to Orders" returns to the same module the user was browsing.
  const orderTabModule = router.query.orderTabModule;
  const keepOrderTabModule = orderTabModule ? { orderTabModule } : {};

  const goToDetails = () => {
    router.push({
      pathname: "/profile",
      query: { page: "my-orders", orderId: order?.id, ...keepOrderTabModule },
    });
  };

  const handleTrackOrder = (e) => {
    e?.stopPropagation?.();
    if (order?.delivery_man)
      dispatch(setDeliveryManInfoByDispatch(order.delivery_man));
    if (order?.module_type === "parcel") {
      setParcelDrawerOpen(true);
    } else {
      router.push({
        pathname: "/profile",
        query: {
          page: "my-orders",
          orderId: order?.id,
          tab: "track-order",
          ...keepOrderTabModule,
        },
      });
    }
  };

  const handleAction = (e) => {
    e?.stopPropagation?.();
    if (actionType === "track") {
      handleTrackOrder(e);
    } else {
      goToDetails();
    }
  };

  const actionLabel =
    actionType === "track"
      ? t("Track Order")
      : actionType === "reorder"
      ? t("Re-order")
      : t("Details");

  return (
    <>
      <Box
        onClick={goToDetails}
        sx={{
          backgroundColor: bg,
          cursor: "pointer",
          display: "grid",
          gridTemplateColumns: { xs: "1fr 1fr", md: "2fr 2fr 1fr 1fr" },
          gridTemplateAreas: {
            xs: `"col1 col1" "col2 col2" "col3 col4"`,
            md: `"col1 col2 col3 col4"`,
          },
          gap: { xs: "10px", md: "16px" },
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* Col 1: Store name + Order # + Status */}
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
            {storeName}
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
              {t("Order")} #{order?.id}
            </Typography>
            <StatusBadge
              status={status}
              label={status
                .replaceAll("_", " ")
                .replace(/\b\w/g, (c) => c.toUpperCase())}
            />
          </Stack>
        </Stack>

        {/* Col 2: Item thumbnails + description */}
        <Stack
          direction="row"
          alignItems="center"
          gap="16px"
          sx={{ minWidth: 0, gridArea: "col2" }}
        >
          <ItemThumbnails
            details={order?.items_preview ?? []}
            size={thumbnailSize}
          />
          {itemDescription && (
            <Typography
              sx={{
                fontSize: { xs: "12px", md: "14px" },
                fontWeight: 400,
                color: "neutral.500",
                lineHeight: 1.3,
                width: "162px",
                flexShrink: 0,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {itemDescription}
            </Typography>
          )}
        </Stack>

        {/* Col 3: Price */}
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
            {getAmountWithSign(order?.order_amount)}
          </Typography>
        </Box>

        {/* Col 4: Action button */}
        <Box
          sx={{
            gridArea: "col4",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Button
            variant="contained"
            size="small"
            onClick={handleAction}
            sx={{
              height: "36px",
              px: "16px",
              borderRadius: "8px",
              textTransform: "none",
              fontSize: "14px",
              fontWeight: 600,
              letterSpacing: "-0.42px",
              flexShrink: 0,
              boxShadow: "none",
              "&:hover": { boxShadow: "none" },
            }}
          >
            {actionLabel}
          </Button>
        </Box>
      </Box>

      {parcelDrawerOpen && (
        <TrackParcelOrderDrawer
          orderId={order?.id}
          sideDrawerOpen={parcelDrawerOpen}
          setSideDrawerOpen={setParcelDrawerOpen}
          closeHandler={() => setParcelDrawerOpen(false)}
        />
      )}
    </>
  );
};

export default NewOrderCard;
