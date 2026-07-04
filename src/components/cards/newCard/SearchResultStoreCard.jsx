import { Box, Stack, Typography, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import VerifiedStoreBadge from "components/cards/VerifiedStoreBadge";
import NextImage from "components/NextImage";
import ClosedNow from "components/closed-now";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { handleStoreRedirect } from "helper-functions/handleStoreRedirect";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

// ─── Styled ────────────────────────────────────────────────────────────────

const CardRoot = styled(Box)(({ theme }) => ({
  width: "min(340px, calc(100vw - 40px))",
  backgroundColor: theme.palette.background.paper,
  borderRadius: "16px",
  padding: "16px",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  cursor: "pointer",
  overflow: "hidden",
  boxShadow: "0px 1px 4px 0px rgba(0,0,0,0.05)",
  transition: "box-shadow 0.2s ease",
  "&:hover": {
    boxShadow: "0px 4px 4px -4px rgba(0,0,0,0.05), 0px 16px 32px -4px rgba(0,0,0,0.05)",
  },
}));

const Logo = styled(Box)(({ theme }) => ({
  position: "relative",
  width: 64,
  height: 64,
  borderRadius: "9999px",
  overflow: "hidden",
  flexShrink: 0,
  backgroundColor: theme.palette.background.secondary,
}));

const AdBadge = styled(Box)({
  position: "absolute",
  bottom: 2,
  left: "50%",
  transform: "translateX(-50%)",
  backgroundColor: "rgba(0,0,0,0.7)",
  border: "1px solid rgba(0,0,0,0.24)",
  borderRadius: 9999,
  padding: "2px 6px",
  zIndex: 2,
});

const Pill = styled(Box)(({ theme, bgColor }) => ({
  backgroundColor: bgColor || theme.palette.error.dangerLight,
  borderRadius: 24,
  padding: "2px 6px",
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  flexShrink: 0,
}));

const ItemThumb = styled(Box)(({ theme }) => ({
  width: 84,
  height: 84,
  borderRadius: "12px",
  overflow: "hidden",
  flexShrink: 0,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.customColor.tagBg}`,
}));

const ItemsRow = styled(Box)({
  width: "100%",
  display: "flex",
  gap: "12px",
  overflow: "hidden",
});

const EmptyItems = styled(Box)(({ theme }) => ({
  width: "100%",
  padding: "20px 12px",
  borderRadius: "12px",
  backgroundColor: theme.palette.background.secondary,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
}));

// ─── Item card (small inside slider) ───────────────────────────────────────

const SearchItemCard = ({ item }) => {
  const displayPrice =
    item?.discount > 0
      ? item.price -
        (item.discount_type === "percent"
          ? (item.price * item.discount) / 100
          : item.discount)
      : item?.price;
  const showStrike = item?.discount > 0 && item?.price > displayPrice;

  return (
    <Box sx={{ width: 84, flexShrink: 0, display: "flex", flexDirection: "column" }}>
      <ItemThumb>
        <NextImage
          src={item?.image_full_url}
          alt={item?.name}
          width="84"
          height="84"
          objectFit="cover"
        />
      </ItemThumb>
      <Stack sx={{ pt: "12px", px: "4px", gap: "6px" }}>
        <Typography
          sx={{
            fontSize: "12px",
            fontWeight: 400,
            color: "customColor.textNeutral",
            lineHeight: 1.2,
            letterSpacing: "-0.36px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            minHeight: "29px",
          }}
        >
          {item?.name}
        </Typography>
        <Stack
          direction="row"
          alignItems="center"
          gap="4px"
          flexWrap="wrap"
          sx={{ py: "2px" }}
        >
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
            {getAmountWithSign(displayPrice)}
          </Typography>
          {showStrike && (
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 400,
                color: "customColor.ratingCount",
                lineHeight: 1.2,
                letterSpacing: "-0.42px",
                textDecoration: "line-through",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {getAmountWithSign(item.price)}
            </Typography>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

// ─── Discount badges row ───────────────────────────────────────────────────

const DiscountBadges = ({ store, theme, t }) => {
  const list = [];
  if (store?.discount?.discount > 0 || store?.discount > 0) {
    const d = store?.discount?.discount ?? store?.discount;
    const type = store?.discount?.discount_type ?? store?.discount_type;
    list.push({
      key: "pct",
      text: type === "percent" ? `-${d}%` : `-${d}`,
      icon: null,
    });
  }
  if (store?.discount?.discount_type === "bogo" || store?.bogo) {
    list.push({
      key: "bogo",
      text: t("Buy 1 Get 1 Free"),
      icon: (
        <i
          className="fi fi-sr-badge-percent"
          style={{
            fontSize: "12px",
            lineHeight: 1,
            display: "flex",
            color: theme.palette.error.dangerText,
          }}
        />
      ),
    });
  }
  if (store?.free_delivery) {
    list.push({
      key: "free",
      text: t("Free"),
      icon: (
        <i
          className="fi fi-rs-biking-mountain"
          style={{
            fontSize: "12px",
            lineHeight: 1,
            display: "flex",
            color: theme.palette.error.dangerText,
          }}
        />
      ),
    });
  }

  const visible = list.slice(0, 2);
  const overflow = list.length - visible.length;
  if (visible.length === 0) return null;

  return (
    <Stack direction="row" alignItems="center" gap="4px" flexWrap="nowrap">
      {visible.map((b) => (
        <Pill key={b.key}>
          {b.icon}
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 600,
              color: "error.dangerText",
              lineHeight: 1.3,
              whiteSpace: "nowrap",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {b.text}
          </Typography>
        </Pill>
      ))}
      {overflow > 0 && (
        <Pill bgColor={theme.palette.customColor.tagBg}>
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 600,
              color: "neutral.500",
              lineHeight: 1.3,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            +{overflow}
          </Typography>
        </Pill>
      )}
    </Stack>
  );
};

// ─── Main ──────────────────────────────────────────────────────────────────

/**
 * Props:
 * - store: { name, logo_full_url, delivery_time, distance, discount, free_delivery, ... }
 * - items: [{ image_full_url, name, price, discount, discount_type }]
 * - showAdBadge?: boolean
 */
const SearchResultStoreCard = ({ store, items = [], showAdBadge = false }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const router = useRouter();

  const handleClick = () => handleStoreRedirect(store, router);

  const formatDistance = (meters) => {
    if (!meters && meters !== 0) return null;
    const km = meters / 1000;
    return `${km.toFixed(1)} km`;
  };

  return (
    <CardRoot onClick={handleClick}>
      {/* Top — Restaurant info */}
      <Stack direction="row" alignItems="center" gap="8px">
        <Logo>
          {store?.logo_full_url && (
            <NextImage
              src={store.logo_full_url}
              alt={store?.name}
              width="64"
              height="64"
              objectFit="cover"
            />
          )}
          <ClosedNow
            active={store?.active}
            open={store?.open}
            borderRadius="9999px"
          />
          {store?.ad ? (
            <AdBadge>
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#f3f3f3",
                  lineHeight: 1.3,
                  letterSpacing: "-0.36px",
                }}
              >
                AD
              </Typography>
            </AdBadge>
          ) : null}
        </Logo>
        <Stack sx={{ flex: 1, minWidth: 0, gap: "6px" }}>
          <Stack direction="row" alignItems="center" sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 700,
                color: "neutral.1050",
                lineHeight: 1.1,
                letterSpacing: "-0.48px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                textTransform: "capitalize",
                minWidth: 0,
              }}
            >
              {store?.name}
            </Typography>
            <VerifiedStoreBadge
              verified={store?.verified_seller}
              fontSize="14px"
            />
          </Stack>
          {(store?.delivery_time || store?.distance != null) && (
            <Stack
              direction="row"
              alignItems="center"
              gap="4px"
              sx={{ pb: "2px" }}
            >
              <i
                className="fi fi-rr-clock"
                style={{
                  fontSize: "13px",
                  lineHeight: 1,
                  display: "flex",
                  color: theme.palette.customColor.deliveryText,
                }}
              />
              {store?.delivery_time && (
                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "customColor.deliveryText",
                    lineHeight: 1.3,
                    whiteSpace: "nowrap",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {store.delivery_time}
                </Typography>
              )}
              {formatDistance(store?.distance) && (
                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "customColor.deliveryText",
                    lineHeight: 1.3,
                    whiteSpace: "nowrap",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  ({formatDistance(store.distance)})
                </Typography>
              )}
            </Stack>
          )}
          <DiscountBadges store={store} theme={theme} t={t} />
        </Stack>
      </Stack>

      {/* Bottom — Items row (3 full + 4th peeking to suggest more) */}
      {items.length > 0 ? (
        <ItemsRow>
          {items.slice(0, 4).map((it) => (
            <SearchItemCard key={it.id} item={it} />
          ))}
        </ItemsRow>
      ) : (
        <EmptyItems>
          <i
            className="fi fi-rr-restaurant"
            style={{
              fontSize: "16px",
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
            }}
          >
            {t("No items available")}
          </Typography>
        </EmptyItems>
      )}
    </CardRoot>
  );
};

export default SearchResultStoreCard;
