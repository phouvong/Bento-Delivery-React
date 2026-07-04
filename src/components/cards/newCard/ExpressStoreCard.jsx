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

const CardRoot = styled(Box)(({ theme, cardWidth, noshadow }) => ({
  width: cardWidth || "340px",
  backgroundColor: theme.palette.background.paper,
  borderRadius: "16px",
  overflow: "hidden",
  cursor: "pointer",
  boxShadow: noshadow ? "none" : "0px 1px 4px 0px rgba(0,0,0,0.05)",
  transition: "box-shadow 0.2s ease",
  "&:hover": {
    boxShadow: noshadow
      ? "none"
      : "0px 4px 4px -4px rgba(0,0,0,0.05), 0px 16px 32px -4px rgba(0,0,0,0.05)",
  },
}));

const ItemsSection = styled(Box)({
  padding: "16px",
  height: "200px",
  display: "flex",
  gap: "12px",
  overflow: "hidden",
  alignItems: "flex-start",
});

const StoreBar = styled(Box)(({ theme, showProducts }) => ({
  padding: "16px",
  borderTop: showProducts
    ? `1px solid ${theme.palette.customColor.tagBg}`
    : "none",
  display: "flex",
  alignItems: "center",
  gap: "8px",
}));

const Logo = styled(Box)(({ theme }) => ({
  position: "relative",
  width: 44,
  height: 44,
  borderRadius: "9999px",
  overflow: "hidden",
  flexShrink: 0,
  backgroundColor: theme.palette.background.secondary,
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

const EmptyItems = styled(Box)(({ theme }) => ({
  padding: "16px",
  height: "200px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
}));

// ─── Item card ─────────────────────────────────────────────────────────────

const ItemCard = ({ item }) => {
  const displayPrice =
    item?.discount > 0
      ? item.price -
        (item.discount_type === "percent"
          ? (item.price * item.discount) / 100
          : item.discount)
      : item?.price;
  const showStrike = item?.discount > 0 && item?.price > displayPrice;

  return (
    <Box
      sx={{
        width: 84,
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
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

// ─── Main ──────────────────────────────────────────────────────────────────

/**
 * Props:
 * - store: { name, logo_full_url, delivery_time, distance, active, open, verified_seller }
 * - items: [{ image_full_url, name, price, discount, discount_type }]
 */
const ExpressStoreCard = ({
  store,
  items = [],
  showProducts = true,
  width,
  noShadow,
}) => {
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
    <CardRoot
      onClick={handleClick}
      cardWidth={width}
      noshadow={noShadow ? 1 : 0}
    >
      {showProducts ? (
        items.length > 0 ? (
          <ItemsSection>
            {items.slice(0, 4).map((it) => (
              <ItemCard key={it.id} item={it} />
            ))}
          </ItemsSection>
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
        )
      ) : null}

      {/* Bottom — Store bar */}
      <StoreBar showProducts={showProducts}>
        <Logo>
          {store?.logo_full_url && (
            <NextImage
              src={store.logo_full_url}
              alt={store?.name}
              width="44"
              height="44"
              objectFit="cover"
            />
          )}
          <ClosedNow
            active={store?.active}
            open={store?.open}
            borderRadius="9999px"
          />
        </Logo>
        <Stack sx={{ flex: 1, minWidth: 0, gap: "6px" }}>
          <Stack direction="row" alignItems="center" sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 700,
                color: "neutral.1050",
                lineHeight: 1.1,
                letterSpacing: "-0.42px",
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
            <Stack direction="row" alignItems="center" gap="4px">
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
        </Stack>
      </StoreBar>
    </CardRoot>
  );
};

export default ExpressStoreCard;
