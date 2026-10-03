import React from "react";
import {
  Box,
  Stack,
  Tooltip,
  Typography,
  styled,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { t } from "i18next";
import NextImage from "components/NextImage";
import { getAmountWithSign } from "helper-functions/CardHelpers";

const CardRoot = styled(Box)(({ theme }) => ({
  width: "100%",
  cursor: "pointer",
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.customColor.tagBg}`,
  borderRadius: "12px",
  overflow: "hidden",
}));

const StoreLogo = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: "8px",
  overflow: "hidden",
  flexShrink: 0,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.customColor.tagBg}`,
}));

// Overlapping circular thumbnails with a "+N" overflow badge — same visual
// convention as `ItemAvatars` in components/cards/newCard/CartStoreCard.js.
const ItemAvatars = ({ items = [], size, max = 2 }) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const avatarSize = size ?? (isDesktop ? 42 : 36);
  const visible = items.slice(0, max);
  const overflow = items.length - visible.length;

  return (
    <Stack direction="row" alignItems="center" gap="4px" sx={{ flexShrink: 0 }}>
      <Stack direction="row" alignItems="center">
        {visible.map((item, index) => (
          <Tooltip
            key={item?.item_id ?? item?.service_id ?? index}
            title={item?.name ?? ""}
            arrow
            disableHoverListener={!item?.name}
          >
            <Box
              sx={{
                width: avatarSize,
                height: avatarSize,
                borderRadius: "50%",
                border: "2px solid",
                borderColor: "background.paper",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ml: index === 0 ? 0 : "-6px",
                zIndex: visible.length - index,
                flexShrink: 0,
                backgroundColor: "background.secondary",
                position: "relative",
              }}
            >
              <NextImage
                src={item?.image_full_url}
                alt={item?.name || ""}
                width={avatarSize}
                height={avatarSize}
                objectFit="cover"
              />
            </Box>
          </Tooltip>
        ))}
      </Stack>
      {overflow > 0 && (
        <Typography sx={{ fontSize: "14px", fontWeight: 600, color: "neutral.500" }}>
          {`+${overflow}`}
        </Typography>
      )}
    </Stack>
  );
};

// `bundle` is one row of `GET /bogo/offers/{id}`'s `content.data` — one
// store's terms for the offer: { bundle_id, store, buy_items, free_items,
// bundle_price, original_price, final_price, ... }. See §5.3 of the BOGO API guide.
const BogoStoreOfferCard = ({ bundle, onClick }) => {
  const theme = useTheme();
  const store = bundle?.store;
  const hasDiscount =
    bundle?.final_price != null &&
    bundle?.original_price != null &&
    Number(bundle.final_price) < Number(bundle.original_price);

  return (
    <CardRoot
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ padding: "16px" }}
      >
        <Stack alignItems="center" justifyContent="center" gap="6px" sx={{ flex: 1, minWidth: 0 }}>
          <ItemAvatars items={bundle?.buy_items} />
          <Typography sx={{ fontSize: "14px", color: "neutral.500" }}>
            {t("Buy Item")}
          </Typography>
        </Stack>

        <Box sx={{ flexShrink: 0, width: "20px", height: "20px", display: "flex" }}>
          <i
            className="fi fi-rs-arrow-small-right"
            style={{ fontSize: "20px", lineHeight: 1, display: "flex", color: theme.palette.neutral[500] }}
          />
        </Box>

        <Stack alignItems="center" justifyContent="center" gap="6px" sx={{ flex: 1, minWidth: 0 }}>
          <ItemAvatars items={bundle?.free_items} />
          <Typography sx={{ fontSize: "14px", color: "neutral.500" }}>
            {t("Get Item")}
          </Typography>
        </Stack>
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        gap="16px"
        sx={{
          padding: "12px 16px",
          borderTop: `1px solid ${theme.palette.customColor.tagBg}`,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          gap="8px"
          sx={{ flex: 1, minWidth: 0 }}
        >
          <StoreLogo>
            <NextImage
              src={store?.logo_full_url}
              alt={store?.name || "Store"}
              width="40"
              height="40"
              objectFit="cover"
            />
          </StoreLogo>

          <Stack gap="4px" justifyContent="center" sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 500,
                lineHeight: 1.1,
                letterSpacing: "-0.48px",
                color: "neutral.1050",
                textTransform: "capitalize",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {store?.name}
            </Typography>
            {store?.delivery_time && (
              <Stack
                direction="row"
                alignItems="center"
                gap="4px"
                sx={{ minWidth: 0 }}
              >
                <i
                  className="fi fi-rr-clock"
                  style={{
                    fontSize: "14px",
                    lineHeight: 1,
                    display: "flex",
                    flexShrink: 0,
                    color: theme.palette.neutral[500],
                  }}
                />
                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: 600,
                    lineHeight: 1.3,
                    color: "neutral.500",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {store.delivery_time}
                  {store?.distance_label ? ` (${store.distance_label})` : ""}
                </Typography>
              </Stack>
            )}
          </Stack>
        </Stack>

        <Stack alignItems="flex-end" gap="2px" sx={{ flexShrink: 0, ml: "auto" }}>
          <Typography
            sx={{
              fontSize: "20px",
              fontWeight: 700,
              letterSpacing: "-0.6px",
              color: "neutral.1050",
            }}
          >
            {getAmountWithSign(bundle?.final_price)}
          </Typography>
          {hasDiscount && (
            <Typography
              sx={{
                fontSize: "13px",
                color: "neutral.500",
                textDecoration: "line-through",
              }}
            >
              {getAmountWithSign(bundle?.original_price)}
            </Typography>
          )}
        </Stack>
      </Stack>
    </CardRoot>
  );
};

export default BogoStoreOfferCard;
