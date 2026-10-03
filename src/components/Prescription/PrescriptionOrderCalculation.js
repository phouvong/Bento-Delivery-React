import React, { useEffect } from "react";
import { CalculationGrid, TotalGrid } from "../checkout/CheckOut.style";
import { Grid, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import CustomDivider from "../CustomDivider";
import { t } from "i18next";
import {
  getInfoFromZoneData,
  handleDistance,
} from "utils/CustomFunctions";
import {
  getAmountWithSign,
  getReferDiscount,
} from "helper-functions/CardHelpers";
import { useDispatch, useSelector } from "react-redux";
import { getToken } from "helper-functions/getToken";
import InfoIcon from "@mui/icons-material/Info";
import useGetProActiveOffer from "api-manage/hooks/react-query/pro-plans/useGetProActiveOffer";
import useGetCheckoutSummary, {
  isQuoteUnavailable,
} from "api-manage/hooks/react-query/checkout/useGetCheckoutSummary";

const PrescriptionOrderCalculation = ({
  storeData,
  configData,
  distanceData,
  orderType,
  zoneData,
  origin,
  destination,
  totalOrderAmount,
  deliveryTip,
  taxAmount,
  setPayableAmount,
  selectedDeliveryOption,
  setDeliveryFee,
  areaZipParams,
  setQuoteUnavailable,
}) => {
  const deliveryOptionSurcharge =
    orderType === "delivery"
      ? Number(selectedDeliveryOption?.surcharge) || 0
      : 0;
  const theme = useTheme();
  const tempDistance = handleDistance(distanceData?.data, origin, destination);

  // One server-side quote: delivery, surge and the Pro benefit in the order the
  // charge is billed. Nothing below recomputes any of it.
  const checkoutSummaryQuery = useGetCheckoutSummary({
    orderType: orderType === "take_away" ? "take_away" : "delivery",
    storeId: storeData?.id,
    orderAmount: Number(totalOrderAmount) || 0,
    distance: tempDistance,
    latitude: destination?.latitude,
    longitude: destination?.longitude,
    deliveryType: selectedDeliveryOption?.deliveryType,
    // area_id / zip_code_id — the zone's rule prices off these.
    ...(areaZipParams || {}),
  });
  const checkoutSummary = checkoutSummaryQuery?.data;
  const summaryDelivery = checkoutSummary?.delivery;
  const quoteUnavailable = isQuoteUnavailable(checkoutSummaryQuery);
  useEffect(() => {
    setQuoteUnavailable?.(quoteUnavailable);
  }, [quoteUnavailable]);
  // Passed through untouched — the rows below read `price`, `price_type`,
  // `customer_note` and `customer_note_status` off it.
  const surgePrice = checkoutSummary?.surge;
  // The vehicle charge is folded into `base_delivery_charge` server-side, so
  // there is no separate figure to caption any more.
  const extraCharge = 0;
  // The "before" figure — base + surge, ahead of free-delivery and Pro.
  const computedDeliveryFee = Number(summaryDelivery?.base_delivery_charge) || 0;

  // ── Pro member: delivery_fee benefit ───────────────────────────────────
  const proFeatureEnabled = configData?.pro_member_status === 1;
  const hasToken = !!getToken();
  const { data: activeOfferRaw } = useGetProActiveOffer({
    enabled: proFeatureEnabled && hasToken,
  });
  const activeOffer = activeOfferRaw?.data ?? activeOfferRaw ?? null;
  const isProActive = activeOffer?.status === true;
  const proBenefit = activeOffer?.benefit ?? null;
  const proMinOrderAmount = Number(proBenefit?.min_order_amount) || 0;
  const proMinSatisfied =
    proBenefit?.min_order_status !== 1 ||
    Number(computedDeliveryFee || 0) >= proMinOrderAmount;
  const proDeliveryBenefitActive =
    isProActive &&
    proBenefit?.type === "delivery_fee" &&
    proMinSatisfied &&
    Number(computedDeliveryFee || 0) > 0;
  const proDeliveryOfferType = proBenefit?.offer_type;
  const proDeliveryDiscountPct =
    Number(proBenefit?.charge_discount_percentage) || 0;
  // Server-applied: it has already run the free-delivery overrides and the Pro
  // percentage in billing order.
  const proDeliveryDiscount =
    Number(summaryDelivery?.pro_customer_savings) || 0;
  const effectiveDeliveryFee = Number(summaryDelivery?.delivery_charge) || 0;

  useEffect(() => {
    setDeliveryFee?.(effectiveDeliveryFee);
  }, [effectiveDeliveryFee, setDeliveryFee]);

  const handleTotalAmount = () => {
    const totalAmount =
      effectiveDeliveryFee +
      Number(deliveryTip) +
      configData?.additional_charge +
      deliveryOptionSurcharge;
    setPayableAmount(totalAmount);
    localStorage.setItem("totalAmount", totalAmount);
    return totalAmount;
  };
  const extraText = t("This charge includes extra vehicle charge");
  const proTooltipText =
    proDeliveryBenefitActive && proDeliveryDiscount > 0
      ? ` ${t("Pro discount applied")}: -${getAmountWithSign(
          proDeliveryDiscount
        )}`
      : "";
  const deliveryToolTipsText = `${
    extraCharge > 0 ? `${extraText} ${getAmountWithSign(extraCharge)}` : ""
  }${
    surgePrice?.price > 0 && surgePrice?.customer_note_status !== 0
      ? ` ${surgePrice?.customer_note} ${
          surgePrice?.type === "amount"
            ? getAmountWithSign(surgePrice?.price)
            : `${surgePrice?.price}%`
        }`
      : ""
  }${proTooltipText}`.trim();
  return (
    <CalculationGrid container item md={12} xs={12} spacing={1}>
      <Grid item md={8} xs={8}>
        {t("Deliveryman tips")}
      </Grid>
      <Grid item md={4} xs={4} align="right">
        {getAmountWithSign(deliveryTip)}
      </Grid>
      {configData?.additional_charge_status === 1 ? (
        <>
          <Grid item md={8} xs={8}>
            {t(configData?.additional_charge_name)}
          </Grid>
          <Grid item md={4} xs={4} align="right">
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
              spacing={0.5}
            >
              <Typography>{"(+)"}</Typography>
              <Typography>
                {getAmountWithSign(configData?.additional_charge)}
              </Typography>
            </Stack>
          </Grid>
        </>
      ) : null}
      {taxAmount?.tax_included !== null && taxAmount?.tax_included === 0 ? (
        <>
          <Grid item md={8} xs={8}>
            {t("TAX")}
          </Grid>
          <Grid item md={4} xs={4} align="right">
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
              spacing={0.5}
            >
              <Typography>
                {taxAmount?.tax_included === 0 && <>{"(+)"}</>}
                {getAmountWithSign(taxAmount?.tax_amount)}
              </Typography>
            </Stack>
          </Grid>
        </>
      ) : null}
      <Grid item md={8} xs={8}>
        {t("Delivery fee")}
        {extraCharge > 0 ||
        surgePrice?.price > 0 ||
        (proDeliveryBenefitActive && proDeliveryDiscount > 0) ? (
          <Tooltip title={deliveryToolTipsText} placement="top" arrow={true}>
            <InfoIcon sx={{ fontSize: "11px" }} />
          </Tooltip>
        ) : null}
      </Grid>
      <Grid item md={4} xs={4} align="right">
        {storeData &&
          (proDeliveryBenefitActive &&
          proDeliveryDiscount > 0 &&
          Number(computedDeliveryFee) > 0 ? (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
              spacing={0.5}
            >
              <Typography sx={{ textDecoration: "line-through", opacity: 0.6 }}>
                {getAmountWithSign(computedDeliveryFee)}
              </Typography>
              <Typography color="primary" fontWeight={600}>
                {effectiveDeliveryFee === 0
                  ? t("Free")
                  : getAmountWithSign(effectiveDeliveryFee)}
              </Typography>
            </Stack>
          ) : computedDeliveryFee === 0 ? (
            t("Free")
          ) : (
            getAmountWithSign(computedDeliveryFee)
          ))}
      </Grid>

      {selectedDeliveryOption &&
        selectedDeliveryOption.deliveryType !== "standard" &&
        orderType === "delivery" &&
        deliveryOptionSurcharge !== 0 && (
          <>
            <Grid item md={8} xs={8} sx={{ textTransform: "capitalize" }}>
              {selectedDeliveryOption.deliveryType === "express"
                ? t("Express Delivery")
                : t("Slightly Delay Delivery")}
            </Grid>
            <Grid item md={4} xs={4} align="right">
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
                spacing={0.5}
              >
                <Typography>
                  {deliveryOptionSurcharge > 0 ? "(+)" : "(-)"}
                </Typography>
                <Typography>
                  {getAmountWithSign(Math.abs(deliveryOptionSurcharge))}
                </Typography>
              </Stack>
            </Grid>
          </>
        )}

      <CustomDivider />
      <TotalGrid container md={12} xs={12} mt="1rem">
        <Grid item md={8} xs={8} pl=".5rem">
          <Typography
            component="span"
            fontWeight="bold"
            color={theme.palette.primary.main}
          >
            {t("Total")}{" "}
            <Typography
              component="span"
              fontWeight="400"
              fontSize="14px"
              xs={{ marginInlineStart: "5px" }}
            >
              {taxAmount?.tax_included === 1 &&
                taxAmount?.tax_included !== null &&
                "(Vat/Tax incl.)"}
            </Typography>
          </Typography>
        </Grid>
        <Grid item md={4} xs={4} align="right">
          <Typography color={theme.palette.primary.main}>
            {storeData && getAmountWithSign(handleTotalAmount())}
          </Typography>
        </Grid>
      </TotalGrid>
    </CalculationGrid>
  );
};

export default PrescriptionOrderCalculation;
