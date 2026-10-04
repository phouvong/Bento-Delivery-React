import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import { Avatar, Box, Stack, Typography, alpha } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { useTranslation } from "react-i18next";
import type { ChatCartItem } from "./types";

interface ChatCartChipsProps {
  items: ChatCartItem[];
  productImageUrl?: string;
}

interface StoreGroup {
  key: string;
  storeName: string;
  items: ChatCartItem[];
  subtotal: number;
}

const resolveImage = (
  item: ChatCartItem,
  productImageUrl?: string
): string | undefined => {
  const fullUrl =
    item.image_full_url ?? (item.item as any)?.image_full_url ?? null;
  if (fullUrl) return fullUrl;
  const raw = item.image ?? (item.item as any)?.image;
  if (!raw) return undefined;
  if (/^https?:\/\//i.test(raw)) return raw;
  if (!productImageUrl) return undefined;
  return `${productImageUrl.replace(/\/$/, "")}/${raw}`;
};

const resolveName = (item: ChatCartItem) =>
  item.name ?? (item.item as any)?.name ?? "";

const resolveUnitPrice = (item: ChatCartItem) =>
  Number(
    item.unit_price ??
      item.discounted_price ??
      item.price ??
      (item.item as any)?.discounted_price ??
      (item.item as any)?.unit_price ??
      0
  );

const resolveLineTotal = (item: ChatCartItem) => {
  const explicit = Number(item.line_total ?? item.total_price);
  if (Number.isFinite(explicit) && explicit > 0) return explicit;
  return resolveUnitPrice(item) * (Number(item.quantity) || 0);
};

const resolveVariation = (item: ChatCartItem): string | undefined =>
  typeof item.variation === "string" && item.variation.trim() !== ""
    ? item.variation
    : undefined;

// Group cart items by store, preserving the order stores first appear in.
const groupByStore = (items: ChatCartItem[]): StoreGroup[] => {
  const groups = new Map<string, StoreGroup>();
  items.forEach((item, idx) => {
    const key = String(item.store_id ?? item.store_name ?? `store-${idx}`);
    const existing = groups.get(key);
    if (existing) {
      existing.items.push(item);
      existing.subtotal += resolveLineTotal(item);
    } else {
      groups.set(key, {
        key,
        storeName: item.store_name ?? "",
        items: [item],
        subtotal: resolveLineTotal(item),
      });
    }
  });
  return [...groups.values()];
};

const ChatCartChips = ({ items, productImageUrl }: ChatCartChipsProps) => {
  const theme = useTheme();
  const { t } = useTranslation();
  if (!items?.length) return null;

  const totalQty = items.reduce(
    (acc, it) => acc + (Number(it.quantity) || 0),
    0
  );
  const storeGroups = groupByStore(items);
  const grandTotal = storeGroups.reduce((acc, g) => acc + g.subtotal, 0);
  const showStoreHeaders = storeGroups.some((g) => g.storeName);

  return (
    <Stack
      sx={{
        width: "100%",
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        overflow: "hidden",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{
          px: 1.25,
          py: 0.75,
          backgroundColor: alpha(theme.palette.primary.main, 0.08),
          color: theme.palette.primary.main,
        }}
      >
        <ShoppingCartCheckoutIcon sx={{ fontSize: 16 }} />
        <Typography fontSize={12} fontWeight={700}>
          {t("Cart updated")}
        </Typography>
        <Typography fontSize={11.5} color="text.secondary" sx={{ ml: "auto" }}>
          {`${totalQty} ${t(totalQty === 1 ? "item" : "items")}`}
        </Typography>
      </Stack>

      <Stack
        divider={
          <Box sx={{ borderTop: `1px solid ${theme.palette.divider}` }} />
        }
      >
        {storeGroups.map((group) => (
          <Stack key={group.key}>
            {showStoreHeaders && group.storeName ? (
              <Stack
                direction="row"
                alignItems="center"
                spacing={0.75}
                sx={{
                  px: 1.25,
                  py: 0.5,
                  backgroundColor: alpha(theme.palette.neutral[400], 0.08),
                }}
              >
                <StorefrontOutlinedIcon
                  sx={{ fontSize: 14, color: "text.secondary" }}
                />
                <Typography
                  fontSize={11.5}
                  fontWeight={700}
                  color="text.secondary"
                  noWrap
                >
                  {group.storeName}
                </Typography>
                <Typography
                  fontSize={11}
                  fontWeight={600}
                  color="text.secondary"
                  sx={{ ml: "auto", flexShrink: 0 }}
                >
                  {`${t("Subtotal")}: ${getAmountWithSign(group.subtotal)}`}
                </Typography>
              </Stack>
            ) : null}

            {group.items.map((it, idx) => {
              const name = resolveName(it);
              const img = resolveImage(it, productImageUrl);
              const variation = resolveVariation(it);
              const qty = Number(it.quantity) || 0;
              return (
                <Stack
                  key={`${it.id ?? it.cart_id ?? it.item_id ?? idx}`}
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ px: 1.25, py: 0.75 }}
                >
                  <Avatar
                    src={img}
                    alt={name}
                    variant="rounded"
                    sx={{
                      width: 36,
                      height: 36,
                      flexShrink: 0,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                    }}
                  />
                  <Stack flex={1} minWidth={0}>
                    <Typography fontSize={12.5} fontWeight={600} noWrap>
                      {name}
                    </Typography>
                    <Typography fontSize={11} color="text.secondary" noWrap>
                      {[variation, qty > 0 ? `${t("Qty")}: ${qty}` : null]
                        .filter(Boolean)
                        .join(" · ")}
                    </Typography>
                  </Stack>
                  <Typography
                    fontSize={12.5}
                    fontWeight={700}
                    color="primary.main"
                  >
                    {getAmountWithSign(resolveLineTotal(it))}
                  </Typography>
                </Stack>
              );
            })}
          </Stack>
        ))}
      </Stack>

      {storeGroups.length > 1 && (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            px: 1.25,
            py: 0.75,
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography fontSize={12} fontWeight={700}>
            {t("Grand Total")}
          </Typography>
          <Typography fontSize={12.5} fontWeight={700} color="primary.main">
            {getAmountWithSign(grandTotal)}
          </Typography>
        </Stack>
      )}
    </Stack>
  );
};

export default ChatCartChips;
