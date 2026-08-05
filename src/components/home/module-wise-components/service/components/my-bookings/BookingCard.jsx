import { Box, Button, Stack, Typography, alpha, useMediaQuery, useTheme } from "@mui/material";
import StatusBadge from "components/common/StatusBadge";
import NextImage from "components/NextImage";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

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
// Prefer booking_details (has per-item ids for thumbnail keys); fall back to
// the flatter `services` array some list endpoints return instead — both
// shapes carry name + image_full_url, just at different nesting.
const itemsPreviewFrom = (bookingDetails = [], services = []) => {
  if (bookingDetails.length) {
    return bookingDetails.map((bd) => ({
      id: bd?.id ?? bd?.service_id,
      image_full_url: bd?.service?.thumbnail_full_url ?? bd?.image_full_url,
      name: bd?.service?.name ?? bd?.name,
    }));
  }
  return services.map((s, i) => ({
    id: s?.id ?? i,
    image_full_url: s?.image_full_url,
    name: s?.name,
  }));
};

const itemNamesFrom = (items = []) =>
  items
    .map((item) => item?.name)
    .filter(Boolean)
    .slice(0, 3)
    .join(", ");

// ── Main component ────────────────────────────────────────────────────────────

const BookingCard = ({ order, bg = "transparent", moduleId }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const status = order?.booking_status ?? "";
  const storeName = order?.provider?.name ?? "";
  const itemsPreview = itemsPreviewFrom(
    order?.booking_details ?? [],
    order?.services ?? [],
  );
  const itemDescription = itemNamesFrom(itemsPreview);
  const thumbnailSize = isMobile ? 28 : 36;
  const isRepeatBooking = order?.booking_type === "repeat";

  const goToDetails = () => {
    router.push({
      pathname: "/profile",
      query: {
        page: "my-orders",
        orderId: order?.id,
        ...(moduleId != null && { orderTabModule: moduleId }),
      },
    });
  };

  const handleAction = (e) => {
    e?.stopPropagation?.();
    goToDetails();
  };

  const actionLabel = t("Details");

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
              {t("Booking")} #{order?.id}
            </Typography>
            {isRepeatBooking && (
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  backgroundColor: (theme) =>
                    alpha(theme.palette.customColor.rebookIcon, 0.8),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Box
                  component="i"
                  className="fi fi-sr-arrows-repeat"
                  sx={{ fontSize: 10, color: "whiteContainer.main", lineHeight: 1 }}
                />
              </Box>
            )}
            <StatusBadge
              status={status}
              label={
                order?.status_label ??
                status.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())
              }
            />
          </Stack>
        </Stack>

        {/* Col 2: Item thumbnails + service names */}
        <Stack
          direction="row"
          alignItems="center"
          gap="16px"
          sx={{ minWidth: 0, gridArea: "col2" }}
        >
          <ItemThumbnails details={itemsPreview} size={thumbnailSize} />
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
            {getAmountWithSign(order?.booking_amount)}
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
    </>
  );
};

export default BookingCard;
