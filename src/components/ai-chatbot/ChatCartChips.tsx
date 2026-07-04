import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import { Avatar, Box, Stack, Typography, alpha } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { useTranslation } from "react-i18next";
import type { ChatCartItem } from "./types";

interface ChatCartChipsProps {
  items: ChatCartItem[];
  productImageUrl?: string;
}

const resolveImage = (
  item: ChatCartItem,
  productImageUrl?: string,
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
    item.discounted_price ??
      item.price ??
      (item.item as any)?.discounted_price ??
      (item.item as any)?.unit_price ??
      0,
  );

const ChatCartChips = ({ items, productImageUrl }: ChatCartChipsProps) => {
  const theme = useTheme();
  const { t } = useTranslation();
  if (!items?.length) return null;

  const totalQty = items.reduce(
    (acc, it) => acc + (Number(it.quantity) || 0),
    0,
  );

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
        <Typography
          fontSize={11.5}
          color="text.secondary"
          sx={{ ml: "auto" }}
        >
          {`${totalQty} ${t(totalQty === 1 ? "item" : "items")}`}
        </Typography>
      </Stack>

      <Stack
        divider={
          <Box sx={{ borderTop: `1px solid ${theme.palette.divider}` }} />
        }
      >
        {items.map((it, idx) => {
          const name = resolveName(it);
          const img = resolveImage(it, productImageUrl);
          const unit = it?.unit_price;
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
                {qty > 0 && (
                  <Typography fontSize={11} color="text.secondary">
                    {`${t("Qty")}: ${qty}`}
                  </Typography>
                )}
              </Stack>
              <Typography fontSize={12.5} fontWeight={700} color="primary.main">
                {getAmountWithSign(unit * qty)}
              </Typography>
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
};

export default ChatCartChips;
