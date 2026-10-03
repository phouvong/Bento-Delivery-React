import {
  Box,
  CircularProgress,
  Drawer,
  IconButton,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import NextImage from "components/NextImage";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import useGetBundleDetails from "api-manage/hooks/react-query/bundle/useGetBundleDetails";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import BundleSubItemViewModal from "./BundleSubItemViewModal";

// ─── Helpers ───────────────────────────────────────────────────────────────

const getBundleSubItems = (bundleData) => {
  const raw = bundleData?.items;
  if (!Array.isArray(raw) || raw.length === 0) return [];
  return raw.map((sub, i) => ({
    id: sub?.item_id ?? sub?.service_id ?? i,
    isService: !!sub?.is_service,
    name: sub?.name ?? "",
    image: sub?.image_full_url,
    unitPrice: sub?.unit_price ?? 0,
    quantity: sub?.quantity ?? 1,
    variationText: sub?.variation_summary
      ? sub.variation_summary
      : Array.isArray(sub?.variations)
        ? sub?.is_service
          ? sub.variations
              .map((v) => v?.name)
              .filter(Boolean)
              .join(", ")
          : sub.variations
              .map((v) => {
                const values = v?.values?.label;
                const valueText = Array.isArray(values)
                  ? values.join(", ")
                  : "";
                return v?.name && valueText
                  ? `${v.name}: ${valueText}`
                  : null;
              })
              .filter(Boolean)
              .join(", ")
        : "",
    addOnSummary: sub?.add_on_summary ?? "",
  }));
};

// ─── BundleItemRow — a single sub-item card, per Figma "Best Value Bundle" ──

const BundleItemRow = ({ subItem, onClick }) => {
  const { t } = useTranslation();
  const detailLine = [
    subItem.variationText,
    subItem.addOnSummary ? `${t("Addon")}: ${subItem.addOnSummary}` : "",
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Stack
      direction="row"
      alignItems="center"
      onClick={onClick}
      sx={{
        width: "100%",
        gap: { xs: "10px", md: "12px" },
        p: { xs: "12px", md: "16px" },
        border: (theme) => `1px solid ${theme.palette.neutral[200]}`,
        borderRadius: "12px",
        backgroundColor: "background.paper",
        cursor: onClick ? "pointer" : "default",
        "&:hover": onClick
          ? { borderColor: (theme) => theme.palette.neutral[300] }
          : undefined,
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: { xs: 56, md: 70 },
          height: { xs: 56, md: 70 },
          flexShrink: 0,
          backgroundColor: "background.secondary",
          border: (theme) => `1px solid ${theme.palette.neutral[200]}`,
          borderRadius: "8px",
          overflow: "hidden",
          "& img": {
            position: "absolute",
            inset: 0,
            width: "100% !important",
            height: "100% !important",
            objectFit: "cover",
          },
        }}
      >
        <NextImage src={subItem.image} alt={subItem.name} width="70" height="70" objectFit="cover" />
      </Box>

      <Stack sx={{ flex: 1, minWidth: 0, gap: "6px" }}>
        <Typography
          sx={{
            fontSize: "16px",
            fontWeight: 400,
            color: "customColor.textNeutral",
            lineHeight: 1.1,
            letterSpacing: "-0.48px",
            textTransform: "capitalize",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {subItem.name}
        </Typography>
        <Stack direction="row" alignItems="baseline" flexWrap="wrap" gap="4px">
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: 700,
              color: "neutral.1050",
              lineHeight: 1.1,
              letterSpacing: "-0.54px",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {getAmountWithSign(subItem.unitPrice)}
          </Typography>
        </Stack>
        {!!detailLine && (
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 400,
              color: "neutral.500",
              lineHeight: 1.2,
              letterSpacing: "-0.36px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {detailLine}
          </Typography>
        )}
      </Stack>

      <Box
        sx={{
          flexShrink: 0,
          minWidth: "36px",
          borderRadius: "8px",
          backgroundColor: "background.secondary",
          px: "8px",
          py: "8px",
          textAlign: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: "16px",
            fontWeight: 700,
            color: "neutral.1050",
            lineHeight: 1.1,
            letterSpacing: "-0.48px",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {subItem.quantity}
        </Typography>
      </Box>
    </Stack>
  );
};

// ─── BundleViewDrawer — reusable bundle/combo contents viewer + add-to-cart ──
// Desktop: side drawer, opens from the reading-direction-aware trailing edge
// (right in LTR, left in RTL). Mobile: bottom sheet, capped at 90dvh.

const BundleViewDrawer = ({
  open,
  onClose,
  item,
  displayPrice,
  originalPrice,
  isProductExist,
  count,
  updateLoading,
  isLoading,
  onAdd,
  onSetQuantity,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { configData } = useSelector((s) => s.configData);
  const showTaxInclusiveLabel = configData?.tax_included === 1;

  // Always fetch fresh on open, per the API guide's documented flow — the
  // list response's own items[] (when present) can be a stale cached
  // snapshot, and price/availability can change under a happy hour.
  const { data: bundleDetails, isLoading: detailsLoading } =
    useGetBundleDetails(item?.id, open);
  const subItems = getBundleSubItems(bundleDetails);
  const [viewingSubItem, setViewingSubItem] = useState(null);

  // Local pre-add quantity — lets the user pick how many to add (e.g. 5)
  // and confirm once, instead of adding 1 then incrementing repeatedly.
  // Reset to the item's current cart quantity (or 1) every time the
  // drawer opens.
  const [localQty, setLocalQty] = useState(count > 0 ? count : 1);
  useEffect(() => {
    if (open) setLocalQty(count > 0 ? count : 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const maxQty = item?.maximum_cart_quantity || item?.stock || undefined;
  const hasQtyChanged = isProductExist && localQty !== count;

  const totalPrice = displayPrice * localQty;
  const totalOriginalPrice = originalPrice * localQty;

  const handleMinus = (e) => {
    e.stopPropagation();
    setLocalQty((q) => Math.max(1, q - 1));
  };
  const handlePlus = (e) => {
    e.stopPropagation();
    setLocalQty((q) => (maxQty != null ? Math.min(maxQty, q + 1) : q + 1));
  };

  const handleConfirm = (e) => {
    e.stopPropagation();
    if (isLoading || updateLoading) return;
    if (!isProductExist) {
      onAdd?.(localQty);
    } else if (hasQtyChanged) {
      onSetQuantity?.(localQty);
    } else {
      onClose?.();
    }
  };

  return (
    <>
      <Drawer
      anchor={isMobile ? "bottom" : "right"}
      open={open}
      onClose={onClose}
      elevation={0}
      sx={{ zIndex: 1400 }}
      slotProps={{ backdrop: { sx: { backgroundColor: "rgba(0,0,0,0.4)" } } }}
      PaperProps={{
        sx: isMobile
          ? {
              width: "100%",
              maxHeight: "90dvh",
              borderRadius: "16px 16px 0 0",
            }
          : {
              width: 460,
              maxWidth: "100vw",
              boxShadow: "0px 24px 48px -8px rgba(0,0,0,0.24)",
            },
      }}
    >
      <Stack sx={{ height: "100%", minHeight: 0 }}>
        {/* Header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            px: { xs: "16px", md: "20px" },
            py: { xs: "12px", md: "16px" },
            flexShrink: 0,
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "18px", md: "20px" },
              fontWeight: 700,
              color: "neutral.1050",
              lineHeight: 1.1,
              letterSpacing: "-0.6px",
            }}
          >
            {t("Best Value Bundle")}
          </Typography>
          <IconButton size="small" onClick={onClose} sx={{ borderRadius: "50%" }}>
            <i
              className="fi fi-rr-cross-small"
              style={{
                fontSize: "20px",
                lineHeight: 1,
                display: "flex",
                color: theme.palette.neutral[1050],
              }}
            />
          </IconButton>
        </Stack>

        {/* Sub-item list */}
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            px: { xs: "16px", md: "24px" },
            py: { xs: "12px", md: "16px" },
            display: "flex",
            flexDirection: "column",
            gap: { xs: "14px", md: "20px" },
            scrollbarWidth: "thin",
            scrollbarColor: `${theme.palette.divider} transparent`,
            "&::-webkit-scrollbar": { width: "4px" },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: theme.palette.divider,
              borderRadius: "999px",
            },
          }}
        >
          {detailsLoading ? (
            [...Array(3)].map((_, i) => (
              <Stack key={i} direction="row" alignItems="center" gap="12px">
                <Skeleton
                  variant="rounded"
                  width={70}
                  height={70}
                  sx={{ borderRadius: "8px", flexShrink: 0 }}
                />
                <Stack sx={{ flex: 1, gap: "6px" }}>
                  <Skeleton variant="text" width="70%" />
                  <Skeleton variant="text" width="40%" />
                </Stack>
              </Stack>
            ))
          ) : subItems.length > 0 ? (
            subItems.map((subItem) => (
              <BundleItemRow
                key={subItem.id}
                subItem={subItem}
                onClick={() => setViewingSubItem(subItem)}
              />
            ))
          ) : (
            <Typography sx={{ fontSize: "14px", color: "neutral.500", textAlign: "center", py: 4 }}>
              {t("No items to show")}
            </Typography>
          )}
        </Box>

        {/* Footer */}
        <Stack
          sx={{
            flexShrink: 0,
            gap: "8px",
            px: { xs: "16px", md: "32px" },
            py: { xs: "12px", md: "20px" },
            backgroundColor: "background.paper",
            boxShadow: `0px -1px 4px ${theme.palette.neutral[200]}`,
          }}
        >
          <Stack direction="row" alignItems="center" gap="4px">
            <Stack direction="row" alignItems="center" gap="4px" sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 500,
                  color: "neutral.1050",
                  lineHeight: 1.1,
                  letterSpacing: "-0.48px",
                }}
              >
                {t("Total")}
              </Typography>
              {showTaxInclusiveLabel && (
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "neutral.400",
                    lineHeight: 1.1,
                    letterSpacing: "-0.42px",
                  }}
                >
                  {t("(Inc. VAT/TAX)")}
                </Typography>
              )}
            </Stack>
            <Stack direction="row" alignItems="center" gap="4px" flexShrink={0}>
              <Typography
                sx={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "neutral.1050",
                  lineHeight: 1.1,
                  letterSpacing: "-0.6px",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {getAmountWithSign(totalPrice)}
              </Typography>
              {totalOriginalPrice > totalPrice && (
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: 400,
                    color: "neutral.500",
                    lineHeight: 1.2,
                    letterSpacing: "-0.48px",
                    textDecoration: "line-through",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {getAmountWithSign(totalOriginalPrice)}
                </Typography>
              )}
            </Stack>
          </Stack>

          <Stack direction="row" alignItems="center" gap={{ xs: "12px", md: "20px" }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              sx={{
                height: 44,
                borderRadius: "8px",
                backgroundColor: "background.default",
                px: "12px",
                flexShrink: 0,
              }}
            >
              <IconButton
                size="small"
                onClick={handleMinus}
                disabled={localQty <= 1}
                sx={{ width: 36, height: 36, padding: 0, borderRadius: "8px" }}
              >
                <i
                  className="fi fi-rr-minus-small"
                  style={{
                    fontSize: "18px",
                    lineHeight: 1,
                    display: "flex",
                    color: localQty <= 1 ? theme.palette.neutral[400] : theme.palette.neutral[1050],
                  }}
                />
              </IconButton>
              <Typography
                sx={{
                  width: 32,
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "neutral.1050",
                  textAlign: "center",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {localQty}
              </Typography>
              <IconButton
                size="small"
                onClick={handlePlus}
                disabled={maxQty != null && localQty >= maxQty}
                sx={{ width: 36, height: 36, padding: 0, borderRadius: "8px" }}
              >
                <i
                  className="fi fi-rr-plus-small"
                  style={{
                    fontSize: "18px",
                    lineHeight: 1,
                    display: "flex",
                    color:
                      maxQty != null && localQty >= maxQty
                        ? theme.palette.neutral[400]
                        : theme.palette.neutral[1050],
                  }}
                />
              </IconButton>
            </Stack>

            <Box
              onClick={handleConfirm}
              sx={{
                flex: 1,
                height: 44,
                borderRadius: "12px",
                backgroundColor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                cursor: isLoading || updateLoading ? "default" : "pointer",
                opacity: isLoading || updateLoading ? 0.7 : 1,
                px: "16px",
              }}
            >
              {(isLoading || updateLoading) && (
                <CircularProgress size={16} sx={{ color: "background.paper" }} />
              )}
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "background.paper",
                  lineHeight: 1.1,
                  letterSpacing: "-0.48px",
                  textTransform: "capitalize",
                  whiteSpace: "nowrap",
                }}
              >
                {!isProductExist ? t("Add To Cart") : t("Update Cart")}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </Drawer>

      <BundleSubItemViewModal
        open={!!viewingSubItem}
        onClose={() => setViewingSubItem(null)}
        subItem={viewingSubItem}
        storeInfo={{
          storeName: item?.store_name,
          storeLogoUrl:
            item?.store_logo_full_url ?? item?.store?.logo_full_url,
          rating: item?.avg_rating,
          verifiedSeller: item?.verified_seller,
        }}
      />
    </>
  );
};

export default BundleViewDrawer;
