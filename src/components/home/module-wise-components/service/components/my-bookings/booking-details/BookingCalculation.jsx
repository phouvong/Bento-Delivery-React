import { alpha, Typography, useTheme } from "@mui/material";
import { Stack } from "@mui/system";
import ProSavingsBanner from "components/pro-plan/ProSavingsBanner";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { useSelector } from "react-redux";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { OrderSummaryCalculationCard } from "../../../../../../my-orders/order-details/other-order/OrderCalculation";

const BookingCalculation = ({ data, t, trackOrderData }) => {
  const { configData } = useSelector((state) => state.configData);
  const theme = useTheme();

  // trackOrderData?.order_amount and the discount/charge fields below all come
  // straight from the backend's data?.amount object, already scoped correctly
  // for whichever booking is being viewed (a repeat series total on the parent,
  // a single occurrence's amount on a sub-booking or regular booking) — so
  // deriving Item Price from them keeps every row consistent with the Total,
  // instead of recomputing an unscaled subtotal from the raw item list.
  const additionalCharge = Number(trackOrderData?.additional_charge) || 0;
  const discountAmount = Number(trackOrderData?.store_discount_amount) || 0;
  const proCouponSavings = Number(trackOrderData?.coupon_discount_amount) || 0;
  const proOrderSavings = Number(trackOrderData?.pro_discount) || 0;
  const taxAmount = Number(trackOrderData?.total_tax_amount) || 0;
  const taxExcluded = trackOrderData?.tax_status === "excluded";

  const subtotalAfterDiscount =
    (Number(trackOrderData?.order_amount) || 0) -
    additionalCharge +
    proCouponSavings +
    proOrderSavings -
    (taxExcluded ? taxAmount : 0);
  const originalSubtotal = subtotalAfterDiscount + discountAmount;

  const due_amount =
    trackOrderData?.order_amount - trackOrderData?.partially_paid_amount;

  const proBenefitType = trackOrderData?.benefit_type;
  const proSavingsAmount =
    proBenefitType === "coupon"
      ? proCouponSavings
      : proBenefitType === "discount"
      ? proOrderSavings
      : 0;
  const proSavingsMessage =
    proBenefitType === "coupon"
      ? `${t("You saved")} ${getAmountWithSign(proCouponSavings)} ${t(
          "with a Pro coupon."
        )}`
      : undefined;
  const showProSavingsBanner = !!proBenefitType && proSavingsAmount > 0;

  return (
    <OrderSummaryCalculationCard spacing={1.5}>
      {trackOrderData?.bring_change_amount > 0 &&
      trackOrderData?.payment_method === "cash_on_delivery" ? (
        <CustomStackFullWidth
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
          sx={{
            backgroundColor: "background.default",
            padding: "10px 15px",
            borderRadius: "8px",
          }}
        >
          <Typography fontSize="14px">
            {t(
              `Please bring ${getAmountWithSign(
                trackOrderData?.bring_change_amount
              )} in change when making the delivery.`
            )}
          </Typography>
        </CustomStackFullWidth>
      ) : null}

      <Typography
        sx={{
          fontSize: "18px",
          fontWeight: 700,
          color: theme.palette.text.primary,
        }}
      >
        {t("Billing Summary")}
      </Typography>

      <CustomStackFullWidth
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
      >
        <Typography fontSize="14px">{t("Item Price")}</Typography>
        <Typography fontSize="14px">
          {getAmountWithSign(originalSubtotal)}
        </Typography>
      </CustomStackFullWidth>

      <CustomStackFullWidth
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
      >
        <Typography fontSize="14px">{t("Discount")}</Typography>
        <Typography fontSize="14px">
          -{getAmountWithSign(discountAmount)}
        </Typography>
      </CustomStackFullWidth>

      {proOrderSavings > 0 && (
        <CustomStackFullWidth
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.75}
            sx={{ minWidth: 0, flex: 1 }}
          >
            <Typography fontSize="14px">{t("Pro Discount")}</Typography>
            <Typography
              component="span"
              sx={{
                flexShrink: 0,
                fontSize: "11px",
                px: 0.75,
                py: 0.1,
                borderRadius: "999px",
                backgroundColor: alpha(theme.palette.primary.main, 0.12),
                color: theme.palette.primary.main,
                fontWeight: 600,
              }}
            >
              {t("Pro")}
            </Typography>
          </Stack>
          <Typography fontSize="14px" sx={{ flexShrink: 0 }}>
            -{getAmountWithSign(proOrderSavings)}
          </Typography>
        </CustomStackFullWidth>
      )}

      {Number.parseInt(trackOrderData?.coupon_discount_amount) !== 0 && (
        <CustomStackFullWidth
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.75}
            sx={{ minWidth: 0, flex: 1 }}
          >
            <Typography fontSize="14px">{t("Coupon Discount")}</Typography>
            {trackOrderData?.benefit_type === "coupon" && (
              <Typography
                component="span"
                sx={{
                  flexShrink: 0,
                  fontSize: "11px",
                  px: 0.75,
                  py: 0.1,
                  borderRadius: "999px",
                  backgroundColor: alpha(theme.palette.primary.main, 0.12),
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                }}
              >
                {t("Pro")}
              </Typography>
            )}
          </Stack>
          <Typography fontSize="14px" sx={{ flexShrink: 0 }}>
            -{getAmountWithSign(trackOrderData?.coupon_discount_amount)}
          </Typography>
        </CustomStackFullWidth>
      )}

      {trackOrderData?.ref_bonus_amount > 0 ? (
        <CustomStackFullWidth
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Typography fontSize="14px">{t("Referral Discount")}</Typography>
          <Typography fontSize="14px">
            -{getAmountWithSign(trackOrderData?.ref_bonus_amount)}
          </Typography>
        </CustomStackFullWidth>
      ) : null}

      {trackOrderData?.tax_status === "excluded" &&
        trackOrderData?.total_tax_amount > 0 && (
          <CustomStackFullWidth
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Typography fontSize="14px">{t("VAT/TAX")}</Typography>
            <Typography fontSize="14px">
              {" (+) "}
              {getAmountWithSign(trackOrderData?.total_tax_amount)}
            </Typography>
          </CustomStackFullWidth>
        )}

      {additionalCharge > 0 ? (
        <CustomStackFullWidth
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Typography
            fontSize="14px"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {configData?.additional_charge_name}
          </Typography>
          <Typography fontSize="14px">
            {getAmountWithSign(additionalCharge)}
          </Typography>
        </CustomStackFullWidth>
      ) : null}

      <Stack
        width="100%"
        sx={{
          mt: "20px",
          borderBottom: (theme) => `1px dotted ${theme.palette.neutral[400]}`,
        }}
      ></Stack>

      <CustomStackFullWidth
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
      >
        <Typography
          component="span"
          fontWeight="bold"
          color={theme.palette.text.primary}
        >
          {t("Total")}
          {trackOrderData?.tax_status === "included" && (
            <Typography
              component="span"
              ml={"3px"}
              fontSize="12px"
              fontWeight="normal"
              color="text.secondary"
            >
              {t("(Vat/Tax incl.)")}
            </Typography>
          )}
        </Typography>
        <Typography fontWeight="bold">
          {getAmountWithSign(trackOrderData?.order_amount)}
        </Typography>
      </CustomStackFullWidth>

      {showProSavingsBanner ? (
        <ProSavingsBanner
          amount={proSavingsAmount}
          message={proSavingsMessage}
        />
      ) : null}

      {trackOrderData?.partially_paid_amount &&
      trackOrderData?.order_status !== "canceled" ? (
        <CustomStackFullWidth
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Typography fontSize="14px" textTransform="capitalize">
            {t("Paid by wallet")}
          </Typography>
          <Typography fontSize="14px">
            {getAmountWithSign(trackOrderData?.partially_paid_amount)}
          </Typography>
        </CustomStackFullWidth>
      ) : null}

      {trackOrderData?.payment_method === "partial_payment" ? (
        <>
          {trackOrderData?.payments?.[1]?.payment_status === "unpaid" ? (
            <CustomStackFullWidth
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={2}
            >
              <Typography
                fontSize="14px"
                textTransform="capitalize"
                fontWeight="bold"
              >
                {t("Due Payment")} (
                {t(trackOrderData?.payments?.[1]?.payment_method)
                  .split("_")
                  .join(" ")}
                )
              </Typography>
              <Typography fontSize="14px" fontWeight="bold">
                {getAmountWithSign(due_amount)}
              </Typography>
            </CustomStackFullWidth>
          ) : (
            <CustomStackFullWidth
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={2}
            >
              <Typography
                fontSize="14px"
                textTransform="capitalize"
                fontWeight="bold"
              >
                {t("Paid By")} (
                {t(trackOrderData?.payments?.[1]?.payment_method)
                  .split("_")
                  .join(" ")}
                )
              </Typography>
              <Typography fontSize="14px" fontWeight="bold">
                {getAmountWithSign(due_amount)}
              </Typography>
            </CustomStackFullWidth>
          )}
        </>
      ) : null}
    </OrderSummaryCalculationCard>
  );
};

export default BookingCalculation;
