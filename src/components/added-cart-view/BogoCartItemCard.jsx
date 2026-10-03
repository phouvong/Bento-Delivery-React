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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { t } from "i18next";
import NextImage from "components/NextImage";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import {
  getAddOnsNames,
  parseAddOns,
  parseVariationSummary,
} from "helper-functions/orderLineSummary";
import BogoOrderDetailsViewModal from "components/my-orders/order-details/other-order/BogoOrderDetailsViewModal";

// Same visual/prop convention as CartBundleItem.jsx (this project's closest
// existing "multi-item offer" row) — a BOGO cart row just has two avatar
// clusters (buy/free) instead of one, and an offer title instead of a
// bundle name.

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

const ItemAvatars = ({ items, size = 32, max = 2 }) => {
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
                width: size,
                height: size,
                borderRadius: "8px",
                border: (theme) =>
                  `2px solid ${theme.palette.background.paper}`,
                overflow: "hidden",
                ml: i === 0 ? 0 : "-4px",
                zIndex: visible.length - i,
                flexShrink: 0,
                backgroundColor: "background.secondary",
                position: "relative",
              }}
            >
              <NextImage
                src={it?.image_full_url}
                alt=""
                fill
                objectFit="cover"
                style={{ objectPosition: "center" }}
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
          }}
        >
          {`+${overflow}`}
        </Typography>
      )}
    </Stack>
  );
};

// `bogoDetails` is a cart row's `bogo_details` object (GET /customer/cart/list
// §6.2 of the BOGO API guide) — `buy_items`/`free_items` are raw cart lines
// with a nested `.item`, so avatars are mapped from `row.item_id`/`row.item.name`.
const mapAvatarItem = (row) => ({
  item_id: row?.item_id,
  name: row?.item?.name,
  image_full_url: row?.item?.image_full_url,
});

const toModalRow = (row) => ({
  ...row,
  price: row?.price ?? row?.unit_price,
  variationText:
    row?.variationText ??
    row?.variation_summary ??
    parseVariationSummary(row?.variation),
  addOnSummary:
    row?.addOnSummary ??
    row?.add_on_summary ??
    getAddOnsNames(parseAddOns(row?.selected_addons)),
});

const BogoCartItemCard = ({
  bogoDetails,
  quantity,
  showStepper = true,
  onIncrement,
  onDecrement,
  isLoading = false,
  disableGutters = false,
  enableDetailsModal = false,
}) => {
  const theme = useTheme();
  const qty = quantity ?? bogoDetails?.quantity ?? 1;
  const buyItems = (bogoDetails?.buy_items || []).map(mapAvatarItem);
  const freeItems = (bogoDetails?.free_items || []).map(mapAvatarItem);
  const unitPrice = bogoDetails?.final_price ?? bogoDetails?.bundle_price ?? 0;
  const isUnavailable = bogoDetails?.is_available === false;
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
            spacing={1}
            sx={{
              minWidth: 0,
              cursor: enableDetailsModal ? "pointer" : undefined,
            }}
            onClick={
              enableDetailsModal ? () => setViewModalOpen(true) : undefined
            }
          >
            {(buyItems.length > 0 || freeItems.length > 0) && (
              <Stack direction="row" spacing={2}>
                {buyItems.length > 0 && (
                  <Stack spacing={0.5}>
                    <Typography sx={{ fontSize: "12px", color: "neutral.500" }}>
                      {t("Buying Item")}
                    </Typography>
                    <ItemAvatars items={buyItems} />
                  </Stack>
                )}
                {freeItems.length > 0 && (
                  <Stack spacing={0.5}>
                    <Typography sx={{ fontSize: "12px", color: "neutral.500" }}>
                      {t("Free Item")}
                    </Typography>
                    <ItemAvatars items={freeItems} />
                  </Stack>
                )}
              </Stack>
            )}

            <Stack spacing={0.25}>
              <Typography
                sx={{
                  fontSize: "14px",
                  letterSpacing: "-0.42px",
                  color: theme.palette.text.primary,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {bogoDetails?.offer_title}
              </Typography>
              <Stack direction="row" alignItems="baseline" spacing={0.75}>
                {isUnavailable ? (
                  <Typography
                    sx={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: theme.palette.error.main,
                    }}
                  >
                    {bogoDetails?.unavailable_reason ||
                      t("This offer is no longer available")}
                  </Typography>
                ) : (
                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: 700,
                      color: theme.palette.text.primary,
                    }}
                  >
                    {getAmountWithSign(unitPrice)}
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
              <QtyButton
                onClick={onIncrement}
                disabled={isLoading || isUnavailable}
              >
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
      {enableDetailsModal && (
        <BogoOrderDetailsViewModal
          open={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          data={{
            bogoDetails: {
              ...bogoDetails,
              buy_items: (bogoDetails?.buy_items ?? []).map(toModalRow),
              free_items: (bogoDetails?.free_items ?? []).map(toModalRow),
            },
            quantity: qty,
          }}
        />
      )}
    </>
  );
};

export default BogoCartItemCard;
