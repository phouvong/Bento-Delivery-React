import React, { useState } from "react";
import {
  Box,
  CircularProgress,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  alpha,
  styled,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import NextImage from "components/NextImage";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { getAddOnsNames } from "helper-functions/orderLineSummary";
import BundleOrderDetailsViewModal from "components/my-orders/order-details/other-order/BundleOrderDetailsViewModal";

// The cart's bundle_details shape (`unit_price`/`variation_summary` per item)
// differs from the order-details modal's expected shape (`price`/
// `variationText`) — map it rather than touching the shared modal.
const toModalBundleDetails = (bundleDetails) => ({
  ...bundleDetails,
  items: (bundleDetails?.items ?? []).map((item) => ({
    ...item,
    price: item?.price ?? item?.unit_price,
    variationText: item?.variationText ?? item?.variation_summary,
    addOnSummary:
      item?.addOnSummary ??
      item?.add_on_summary ??
      getAddOnsNames(item?.addons),
  })),
});

const QtyButton = styled(IconButton)(({ theme }) => ({
  padding: "6px",
  borderRadius: "8px",
  minWidth: "auto",
  backgroundColor: "transparent",
  color: theme.palette.text.primary,
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const BundleAvatars = ({ items, size, max = 3 }) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const avatarSize = size ?? (isDesktop ? 36 : 24);
  const visible = items.slice(0, max);
  const overflow = items.length - visible.length;
  return (
    <Stack
      direction="row"
      alignItems="center"
      gap="4px"
      sx={{ flexShrink: 0, minWidth: 0 }}
    >
      <Stack direction="row" alignItems="center">
        {visible.map((it, i) => (
          <Tooltip
            key={it?.item_id ?? i}
            title={it?.name ?? ""}
            arrow
            disableHoverListener={!it?.name}
          >
            <Box
              sx={{
                width: avatarSize,
                height: avatarSize,
                borderRadius: "50%",
                border: (theme) => `1px solid ${theme.palette.neutral[200]}`,
                overflow: "hidden",
                ml: i === 0 ? 0 : "-4px",
                zIndex: visible.length - i,
                flexShrink: 0,
                backgroundColor: "background.secondary",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <NextImage
                src={it?.image_full_url}
                alt=""
                width={avatarSize}
                height={avatarSize}
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </Box>
          </Tooltip>
        ))}
      </Stack>
      {overflow > 0 && (
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 600,
            color: "neutral.500",
            lineHeight: 1.3,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          +{overflow}
        </Typography>
      )}
    </Stack>
  );
};

const CartBundleItem = ({
  bundleDetails,
  quantity,
  showStepper = true,
  onIncrement,
  onDecrement,
  isLoading = false,
  disableGutters = false,
}) => {
  const theme = useTheme();
  const qty = quantity ?? bundleDetails?.quantity ?? 1;
  const items = Array.isArray(bundleDetails?.items) ? bundleDetails.items : [];
  const unitPrice = bundleDetails?.final_price ?? 0;
  const originalUnitPrice = bundleDetails?.base_price ?? unitPrice;
  const showStrike = originalUnitPrice > unitPrice;
  const [viewModalOpen, setViewModalOpen] = useState(false);

  return (
    <>
    <Stack
      sx={{
        py: 1,
        px: disableGutters ? 0 : 1.5,
        borderBottom: disableGutters
          ? "none"
          : `1px solid ${alpha(theme.palette.divider, 0.6)}`,
        "&:last-child": { borderBottom: "none" },
      }}
      spacing={0.75}
    >
      <Stack direction="row" spacing={1} alignItems="flex-start">
        <Stack
          flex={1}
          spacing={0.75}
          sx={{ minWidth: 0, cursor: "pointer" }}
          onClick={() => setViewModalOpen(true)}
        >
          {items.length > 0 && <BundleAvatars items={items} />}

          <Stack spacing={0.25}>
            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: 600,
                color: theme.palette.text.primary,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {bundleDetails?.name}
            </Typography>
            <Stack direction="row" alignItems="baseline" spacing={0.75}>
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                }}
              >
                {getAmountWithSign(unitPrice)}
              </Typography>
              {showStrike && (
                <Typography
                  sx={{
                    fontSize: "11px",
                    color: theme.palette.text.disabled,
                    textDecoration: "line-through",
                  }}
                >
                  {getAmountWithSign(originalUnitPrice)}
                </Typography>
              )}
            </Stack>
          </Stack>
        </Stack>

        {showStepper ? (
          <Stack
            direction="row"
            alignItems="center"
            gap={0}
            sx={{
              flexShrink: 0,
              backgroundColor: theme.palette.action.hover,
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            {qty === 1 ? (
              <QtyButton
                onClick={onDecrement}
                disabled={isLoading}
                sx={{ color: theme.palette.error.main }}
              >
                <i
                  className="fi fi-rr-trash"
                  style={{
                    fontSize: "20px",
                    lineHeight: 1,
                    color: "currentColor",
                  }}
                />
              </QtyButton>
            ) : (
              <QtyButton onClick={onDecrement} disabled={isLoading}>
                <RemoveIcon sx={{ fontSize: 20 }} />
              </QtyButton>
            )}
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 700,
                width: "32px",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {isLoading ? <CircularProgress size={14} thickness={6} /> : qty}
            </Typography>
            <QtyButton onClick={onIncrement} disabled={isLoading}>
              <AddIcon sx={{ fontSize: 20 }} />
            </QtyButton>
          </Stack>
        ) : (
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
              flexShrink: 0,
              minWidth: "32px",
              px: 1,
              py: 0.75,
              borderRadius: "8px",
              backgroundColor: theme.palette.action.hover,
            }}
          >
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 700,
                color: theme.palette.text.primary,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {qty}
            </Typography>
          </Stack>
        )}
      </Stack>
    </Stack>
      <BundleOrderDetailsViewModal
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        data={{
          bundleDetails: toModalBundleDetails(bundleDetails),
          quantity: qty,
          totalPrice: bundleDetails?.total_final_price ?? unitPrice * qty,
        }}
      />
    </>
  );
};

export default CartBundleItem;
