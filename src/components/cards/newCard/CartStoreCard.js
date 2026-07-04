import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import NextImage from "components/NextImage";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { handleStoreRedirect } from "helper-functions/handleStoreRedirect";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";

export const STORE_CARD_VARIANTS = {
  ORDER_PLACED: "order_placed",
  RUNNING: "running",
};

// ─── Styled ────────────────────────────────────────────────────────────────

const CardRoot = styled(Box, { shouldForwardProp: (p) => p !== "variant" })(
  ({ theme, variant }) => ({
    width: variant === "running" ? "364px" : "280px",
    backgroundColor: theme.palette.background.secondary,
    borderRadius: "12px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    ...(variant === "order_placed" && { padding: "12px", gap: "12px" }),
  }),
);

const StoreLogo = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: "8px",
  overflow: "hidden",
  flexShrink: 0,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.customColor.tagBg}`,
}));

const RunningHeader = styled(Box)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.customColor.tagBg}`,
  paddingLeft: "16px",
  paddingRight: "12px",
  paddingTop: "12px",
  paddingBottom: "12px",
  display: "flex",
  alignItems: "flex-start",
  gap: "16px",
}));

const TrashBtn = styled(IconButton)({
  width: 36,
  height: 36,
  padding: "8px",
  borderRadius: "8px",
  flexShrink: 0,
});

const Body = styled(Box)({
  padding: "16px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
});

const PlusBtn = styled(IconButton)(({ theme }) => ({
  width: 36,
  height: 36,
  padding: "8px",
  borderRadius: "50%",
  backgroundColor: theme.palette.background.paper,
  flexShrink: 0,
  "&:hover": { backgroundColor: theme.palette.background.paper, opacity: 0.9 },
}));

const ViewCartBtn = styled(Button)(({ theme }) => ({
  height: 36,
  padding: "8px 16px",
  borderRadius: "8px",
  backgroundColor: theme.palette.primary.main,
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: 600,
  letterSpacing: "-0.42px",
  textTransform: "none",
  flexShrink: 0,
  boxShadow: "none",
  "&:hover": { backgroundColor: theme.palette.primary.dark, boxShadow: "none" },
}));

const PriceRow = styled(Box)(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  backgroundColor: theme.palette.background.paper,
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  paddingLeft: "4px",
  paddingRight: "8px",
  paddingTop: "4px",
  paddingBottom: "4px",
}));

const ReorderBtn = styled(IconButton)(({ theme }) => ({
  width: 32,
  height: 32,
  padding: 0,
  borderRadius: "8px",
  backgroundColor: theme.palette.primary.main,
  flexShrink: 0,
  "&:hover": { backgroundColor: theme.palette.primary.dark },
  "&.Mui-disabled": {
    backgroundColor: theme.palette.primary.main,
    opacity: 0.8,
  },
}));

// ─── Avatar group ──────────────────────────────────────────────────────────

const ItemAvatars = ({
  items,
  size,
  max,
  gap = "-6px",
  borderColor = "background.paper",
}) => {
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
            key={i}
            title={it?.name ?? ""}
            arrow
            disableHoverListener={!it?.name}
          >
            <Box
              sx={{
                width: size,
                height: size,
                borderRadius: "50%",
                border: "2px solid",
                borderColor,
                overflow: "hidden",
                ml: i === 0 ? 0 : gap,
                zIndex: visible.length - i,
                flexShrink: 0,
                backgroundColor: "background.secondary",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <NextImage
                src={it?.item?.image_full_url ?? it?.image_full_url}
                alt=""
                width={size}
                height={size}
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

// ─── Main Component ────────────────────────────────────────────────────────

/**
 * Unified store-wise cart/order card.
 *
 * Props:
 * - variant: "running" | "order_placed"
 * - store: { id, name, logo_full_url, slug }
 * - items: [{ image_full_url }]
 * - totalPrice: number
 * - originalPrice?: number       (running only — strikethrough)
 * - deliveryTime?: string        (running only)
 * - placedDate?: string          (order_placed only)
 * - onAdd, onDelete, onViewCart  (running)
 * - onReorder                    (order_placed)
 * - onClick                      (both)
 */
const CartStoreCard = ({
  variant = STORE_CARD_VARIANTS.RUNNING,
  store,
  items = [],
  totalPrice,
  originalPrice,
  deliveryTime,
  placedDate,
  onAdd,
  onDelete,
  onViewCart,
  onReorder,
  onClick,
  isReordering = false,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const StoreLogoEl = (
    <StoreLogo>
      <NextImage
        src={store?.logo_full_url || null}
        alt={store?.name || "Store"}
        width="40"
        height="40"
        objectFit="cover"
      />
    </StoreLogo>
  );

  // ── ORDER PLACED ─────────────────────────────────────────────────────────
  if (variant === "order_placed") {
    return (
      <CardRoot
        variant="order_placed"
        onClick={onClick}
        sx={{
          cursor: onClick ? "pointer" : "default",
          // Mobile: card bg → white (paper), items pill bg → grey (secondary)
          ...(isMobile && {
            backgroundColor: theme.palette.background.paper,
          }),
        }}
      >
        <Stack direction="row" alignItems="center" gap="8px">
          {StoreLogoEl}
          <Stack sx={{ flex: 1, minWidth: 0, gap: "2px" }}>
            <Typography
              onClick={(e) => {
                e.stopPropagation();
                handleStoreRedirect(store, router);
              }}
              sx={{
                fontSize: "16px",
                fontWeight: 700,
                color: "customColor.textNeutral",
                lineHeight: 1.1,
                letterSpacing: "-0.48px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                textTransform: "capitalize",
                cursor: "pointer",
              }}
            >
              {store?.name}
            </Typography>
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 400,
                color: "customColor.ratingCount",
                lineHeight: 1.3,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {placedDate}
            </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" alignItems="center" gap="5px">
          <PriceRow
            sx={
              isMobile
                ? { backgroundColor: theme.palette.background.secondary }
                : {}
            }
          >
            <ItemAvatars
              items={items}
              size={24}
              max={3}
              gap="-4px"
              borderColor={
                isMobile ? "background.secondary" : "background.paper"
              }
            />
            <Typography
              sx={{
                flex: 1,
                minWidth: 0,
                fontSize: "14px",
                fontWeight: 600,
                color: "neutral.1050",
                lineHeight: 1.2,
                letterSpacing: "-0.42px",
                textAlign: "right",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {getAmountWithSign(totalPrice)}
            </Typography>
          </PriceRow>
          <ReorderBtn
            disabled={isReordering}
            onClick={(e) => {
              e.stopPropagation();
              if (isReordering) return;
              onReorder?.();
            }}
          >
            {isReordering ? (
              <CircularProgress
                size={16}
                thickness={5}
                sx={{ color: "#ffffff" }}
              />
            ) : (
              <i
                className="fi fi-rr-rotate-right"
                style={{
                  fontSize: "16px",
                  lineHeight: 1,
                  display: "flex",
                  color: "#ffffff",
                }}
              />
            )}
          </ReorderBtn>
        </Stack>
      </CardRoot>
    );
  }

  // ── RUNNING ──────────────────────────────────────────────────────────────
  const hasDiscount = originalPrice != null && originalPrice > totalPrice;

  return (
    <CardRoot
      variant="running"
      onClick={onClick}
      sx={{ cursor: onClick ? "pointer" : "default" }}
    >
      <RunningHeader>
        <Stack
          direction="row"
          alignItems="center"
          gap="8px"
          sx={{ flex: 1, minWidth: 0 }}
        >
          {StoreLogoEl}
          <Stack sx={{ flex: 1, minWidth: 0, gap: "4px" }}>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 500,
                color: "neutral.1050",
                lineHeight: 1.1,
                letterSpacing: "-0.48px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                textTransform: "capitalize",
              }}
            >
              {store?.name}
            </Typography>
            {deliveryTime && (
              <Stack direction="row" alignItems="center" gap="4px">
                <i
                  className="fi fi-rr-clock"
                  style={{
                    fontSize: "12px",
                    lineHeight: 1,
                    display: "flex",
                    color: theme.palette.customColor.ratingCount,
                  }}
                />
                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "customColor.ratingCount",
                    lineHeight: 1.3,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {deliveryTime}
                </Typography>
              </Stack>
            )}
          </Stack>
        </Stack>
        <TrashBtn
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
        >
          <i
            className="fi fi-rr-trash"
            style={{
              fontSize: "20px",
              lineHeight: 1,
              display: "flex",
              color: theme.palette.error.red,
            }}
          />
        </TrashBtn>
      </RunningHeader>

      <Body>
        <Stack direction="row" alignItems="center" gap="10px">
          <ItemAvatars items={items} size={36} max={8} gap="-6px" />
          <PlusBtn
            onClick={(e) => {
              e.stopPropagation();
              onAdd?.();
            }}
          >
            <i
              className="fi fi-rr-plus"
              style={{
                fontSize: "16px",
                lineHeight: 1,
                display: "flex",
                color: theme.palette.neutral[1050],
              }}
            />
          </PlusBtn>
        </Stack>

        <Stack
          direction="row"
          alignItems="flex-end"
          justifyContent="space-between"
        >
          <Stack sx={{ gap: "2px" }}>
            {hasDiscount && (
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 400,
                  color: "customColor.ratingCount",
                  lineHeight: 1.2,
                  letterSpacing: "-0.36px",
                  textDecoration: "line-through",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {getAmountWithSign(originalPrice)}
              </Typography>
            )}
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
              {getAmountWithSign(totalPrice)}
            </Typography>
          </Stack>
          <ViewCartBtn
            variant="contained"
            onClick={(e) => {
              e.stopPropagation();
              onViewCart?.();
            }}
          >
            {t("View Cart")}
          </ViewCartBtn>
        </Stack>
      </Body>
    </CardRoot>
  );
};

export default CartStoreCard;
