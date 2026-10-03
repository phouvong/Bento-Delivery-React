import { Box, Stack, Typography, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import useGetCartDiscountEligibility from "api-manage/hooks/react-query/add-cart/useGetCartDiscountEligibility";
import useGetHappyHourStores from "api-manage/hooks/react-query/happy-hour/useGetHappyHourStores";
import useHappyHourActive from "api-manage/hooks/custom-hooks/useHappyHourActive";
import useCountdown, { pad } from "api-manage/hooks/custom-hooks/useCountdown";
import { getAmountWithSign } from "helper-functions/CardHelpers";

const Container = styled(Stack, {
  shouldForwardProp: (prop) => prop !== "rounded",
})(({ theme, rounded }) => ({
  width: "100%",
  gap: "8px",
  backgroundColor: theme.palette.progressOffer.bg,
  boxShadow: "0px 0px 16px -1px rgba(0,0,0,0.1)",
  borderRadius: rounded ? "16px" : 0,
  paddingLeft: "20px",
  paddingRight: "16px",
  paddingTop: "8px",
  paddingBottom: "8px",
}));

const Track = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "3px",
  backgroundColor: theme.palette.progressOffer.track,
  borderRadius: "12px",
  overflow: "hidden",
}));

const Fill = styled(Box)(({ theme }) => ({
  height: "100%",
  backgroundColor: theme.palette.progressOffer.fill,
  borderRadius: "12px",
  transition: "width 0.4s ease",
}));

const TimerChip = styled(Box)(({ theme }) => ({
  minWidth: "28px",
  height: "29px",
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.progressOffer.chip,
  borderRadius: "6px",
  padding: "6px",
}));

const CartDiscountEligibilityBanner = ({
  storeId,
  hasCartItems = true,
  rounded = false,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { data: rawCartData } = useGetCartDiscountEligibility(
    storeId,
    !!storeId && hasCartItems,
  );
  // react-query keeps the last successful `data` around after `enabled`
  // flips false — it just stops refetching, it doesn't clear the cache. So
  // once the cart empties out, the stale pre-removal amount would otherwise
  // hang around forever; ignore it explicitly instead of trusting the query.
  const cartData = hasCartItems ? rawCartData : undefined;
  const {
    isActive: happyHourIsActive,
    happyHour,
    expireAt: happyHourExpireAt,
  } = useHappyHourActive();

  const { data: happyHourStoresData } = useGetHappyHourStores(
    { running: true, limit: 100 },
    happyHourIsActive && !cartData,
  );
  const happyHourStore = storeId
    ? (happyHourStoresData?.data ?? happyHourStoresData?.stores)?.find(
        (store) => Number(store?.id) === Number(storeId),
      )
    : undefined;

  const fallbackMinPurchase =
    Number(happyHourStore?.happy_hour?.min_order_amount) ||
    Number(happyHour?.min_order_amount) ||
    0;
  const fallbackData =
    !cartData && happyHourIsActive && happyHourStore
      ? {
          source: "happy_hour",
          percentage:
            Number(happyHourStore?.happy_hour?.discount) ||
            Number(happyHour?.discount) ||
            0,
          min_purchase: fallbackMinPurchase,
          max_discount: happyHourStore?.happy_hour?.max_discount ?? null,
          qualifying_amount: 0,
          shortfall: fallbackMinPurchase,
          is_qualified: false,
          discount_amount: 0,
        }
      : null;

  const data = cartData ?? fallbackData;

  const isHappyHour = data?.source === "happy_hour";
  const { days, hours, minutes, seconds, expired } = useCountdown(
    isHappyHour ? happyHourExpireAt : null,
  );

  if (!data || !(Number(data?.percentage) > 0)) return null;
  if (isHappyHour && (!happyHourExpireAt || expired)) return null;

  const minPurchase = Number(data?.min_purchase) || 0;
  const hasMinPurchase = minPurchase > 0;
  const qualifyingAmount = Number(data?.qualifying_amount) || 0;
  const shortfall = Number(data?.shortfall) || 0;
  const discountAmount = Number(data?.discount_amount) || 0;
  // No minimum spend means every basket already qualifies — nothing to add.
  const isQualified = !!data?.is_qualified || !hasMinPurchase;

  const progress = isQualified
    ? 100
    : Math.min(100, Math.max(0, (qualifyingAmount / minPurchase) * 100));

  const showDays = days > 0;
  const showHours = showDays || hours > 0;
  const segments = [
    ...(showDays ? [pad(days)] : []),
    ...(showHours ? [pad(hours)] : []),
    pad(minutes),
    pad(seconds),
  ];

  return (
    <Container rounded={rounded}>
      <Stack direction="row" alignItems="center" gap="5px" width="100%">
        <Box
          sx={{
            width: "14px",
            height: "14px",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <i
            className="fi fi-sr-badge-percent"
            style={{
              fontSize: "14px",
              lineHeight: 1,
              display: "flex",
              color: theme.palette.progressOffer.fill,
            }}
          />
        </Box>

        <Typography
          sx={{
            flex: 1,
            minWidth: 0,
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: 1.3,
            letterSpacing: "-0.42px",
            color: "neutral.500",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            "& strong": { fontWeight: 600, color: "neutral.1050" },
          }}
        >
          {isQualified ? (
            discountAmount > 0 ? (
              <>
                {t("Get")}{" "}
                <strong>{getAmountWithSign(discountAmount)}</strong>{" "}
                {t("OFF!")}
              </>
            ) : (
              <>
                {t("Get")} <strong>{data.percentage}%</strong>{" "}
                {t("OFF this order!")}
              </>
            )
          ) : (
            <>
              {t("Add")} <strong>{getAmountWithSign(shortfall)}</strong>{" "}
              {t("more to get")} <strong>{data.percentage}%</strong>{" "}
              {t("discount")}
            </>
          )}
        </Typography>

        {isHappyHour && !expired && (
          <Stack direction="row" alignItems="center" gap="4px" flexShrink={0}>
            {segments.map((value, index) => (
              <Fragment key={index}>
                {index > 0 && (
                  <Typography
                    sx={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "progressOffer.fill",
                      lineHeight: 1.2,
                    }}
                  >
                    :
                  </Typography>
                )}
                <TimerChip>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: 600,
                      lineHeight: 1.2,
                      letterSpacing: "-0.42px",
                      color: "rgba(255,255,255,0.95)",
                      fontVariantNumeric: "tabular-nums",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {value}
                  </Typography>
                </TimerChip>
              </Fragment>
            ))}
          </Stack>
        )}
      </Stack>

      <Track>
        <Fill sx={{ width: `${progress}%` }} />
      </Track>
    </Container>
  );
};

export default CartDiscountEligibilityBanner;
