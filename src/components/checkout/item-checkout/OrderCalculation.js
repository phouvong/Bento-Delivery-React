import InfoIcon from "@mui/icons-material/Info";
import {
  Checkbox,
  FormControlLabel,
  Grid,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Box, alpha } from "@mui/system";
import {
  getAmountWithSign,
  getReferDiscount,
} from "helper-functions/CardHelpers";
import { getToken } from "helper-functions/getToken";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { setTotalAmount } from "redux/slices/cart";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import {
  bad_weather_fees,
  getCalculatedTotal,
  getCouponDiscount,
  getInfoFromZoneData,
  getProductDiscount,
  getSubTotalPrice,
  getTaxableTotalPrice,
  handleDistance,
  handlePurchasedAmount,
} from "utils/CustomFunctions";
import CustomDivider from "../../CustomDivider";
import { CalculationGrid, TotalGrid } from "../CheckOut.style";
import useGetProActiveOffer from "api-manage/hooks/react-query/pro-plans/useGetProActiveOffer";
import useSubscribeProPlan from "api-manage/hooks/react-query/pro-plans/useSubscribeProPlan";
import ProPlanBanner from "components/pro-plan/ProPlanBanner";
import ProSavingsBanner from "components/pro-plan/ProSavingsBanner";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import useGetCheckoutSummary, {
  isQuoteUnavailable,
} from "api-manage/hooks/react-query/checkout/useGetCheckoutSummary";
import useGetCartDiscountEligibility from "api-manage/hooks/react-query/add-cart/useGetCartDiscountEligibility";

const ProOfferType = {
  FREE: "free",
  FULL_FREE: "full_free",
  PARTIAL_FREE: "partial_free",
};

const ProPlanSubscriptionModal = dynamic(() =>
  import("components/pro-plan/ProPlanSubscriptionModal"),
);
const ProPlanPaymentModal = dynamic(() =>
  import("components/pro-plan/ProPlanPaymentModal"),
);

const OrderCalculation = (props) => {
  const {
    cartList,
    storeData,
    couponDiscount,
    distanceData,
    configData,
    orderType,
    deliveryTip,
    origin,
    destination,
    zoneData,
    setDeliveryFee,
    setDeliveryFeeBeforeProDiscount,
    setMinDeliveryCharge,
    extraCharge,
    walletBalance,
    setPayableAmount,
    additionalCharge,
    payableAmount,
    cashbackAmount,
    handleExtraPackaging,
    isPackaging,
    packagingCharge,
    customerData,
    initVauleEx,
    isLoading,
    taxAmount,
    scheduleAt,
    selectedDeliveryOption,
    areaZipParams,
    setQuoteUnavailable,
    setSummaryLoading,
    currentZoneInfo,
    setDeliveryOptions,
  } = props;

  // Express / slightly_delay surcharge from the DeliverySpeedOptions row.
  // Zero on take-away or when a free-delivery coupon is in effect.
  const deliveryOptionSurcharge =
    orderType === "delivery" && couponDiscount?.coupon_type !== "free_delivery"
      ? Number(selectedDeliveryOption?.surcharge) || 0
      : 0;

  const token = getToken();
  const { t } = useTranslation();
  const [freeDelivery, setFreeDelivery] = useState("false");
  const { profileInfo } = useSelector((state) => state.profileInfo);
  const theme = useTheme();

  // Pro plan: only fetch the active offer when the feature flag is on AND the
  // user is authenticated (the endpoint is auth-only — guests would 401).
  const proFeatureEnabled = configData?.pro_member_status === 1;
  const hasToken = !!token;
  const { data: activeOfferRaw } = useGetProActiveOffer({
    enabled: proFeatureEnabled && hasToken,
  });
  const activeOffer = activeOfferRaw?.data ?? activeOfferRaw ?? null;
  const isProActive = activeOffer?.status === true;
  const proBenefit = activeOffer?.benefit ?? null;

  // store-details already cached this query under the same key, and
  // react-query's default staleTime (0) means mounting it here refreshes it

  const { data: cartDiscountEligibility } = useGetCartDiscountEligibility(
    storeData?.id,
    !!storeData?.id,
  );
  const isDiscountEligibilityQualified =
    cartDiscountEligibility?.is_qualified === true &&
    Number(cartDiscountEligibility?.discount_amount) > 0;

  const itemWiseOnlyDiscount = getProductDiscount(cartList, {
    ...storeData,
    discount: null,
  });
  const withVendorDiscount = getProductDiscount(cartList, storeData);
  const legacyVendorStandingDiscount =
    withVendorDiscount > itemWiseOnlyDiscount ? withVendorDiscount : 0;

  const vendorStandingDiscount =
    isDiscountEligibilityQualified &&
    cartDiscountEligibility?.source === "store_discount"
      ? Number(cartDiscountEligibility?.discount_amount) || 0
      : legacyVendorStandingDiscount;
  const happyHourDiscount =
    isDiscountEligibilityQualified &&
    cartDiscountEligibility?.source === "happy_hour"
      ? Number(cartDiscountEligibility?.discount_amount) || 0
      : 0;
  const storeWideDiscount = Math.max(vendorStandingDiscount, happyHourDiscount);

  const eligibilityDiscountAmount = itemWiseOnlyDiscount + storeWideDiscount;
  const eligibilityDiscountSource =
    happyHourDiscount > 0 && happyHourDiscount >= vendorStandingDiscount
      ? "happy_hour"
      : vendorStandingDiscount > 0 ||
        (isDiscountEligibilityQualified &&
          cartDiscountEligibility?.source === "store_discount")
      ? "store_discount"
      : undefined;

  // Backend shape: {type, offer_type ("free" | "partial_free"),
  // charge_discount_percentage, min_order_status, min_order_amount}.
  // Apply the min-order gate against the post-product-discount cart subtotal,
  // since the discount is what the customer actually pays before delivery.
  const proMinOrderAmount = Number(proBenefit?.min_order_amount) || 0;
  // `free_delivery` coupons don't reduce the cart subtotal — they only
  // waive the delivery fee — so they're skipped from the deduction.
  // The coupon percentage applies against (Items Price - Discount), so the
  // authoritative eligibilityDiscountAmount (matches the visible "Discount"
  // row) is passed through rather than letting getCouponDiscount recompute
  // its own client-side store discount, which can disagree with it.
  const proCouponDeduction =
    couponDiscount && couponDiscount?.coupon_type !== "free_delivery"
      ? Number(
          getCouponDiscount(
            couponDiscount,
            storeData,
            cartList,
            eligibilityDiscountAmount,
          ),
        ) || 0
      : 0;
  const proSubtotalForMinCheck = Math.max(
    0,
    handlePurchasedAmount(cartList) -
      getProductDiscount(cartList, storeData) -
      proCouponDeduction,
  );
  const proMinSatisfied =
    proBenefit?.min_order_status !== 1 ||
    proSubtotalForMinCheck >= proMinOrderAmount;

  // Already-free delivery from another mechanism (free_delivery coupon,
  // `free_delivery_over` threshold, zone rule, take-away) → no Pro benefit
  // to display or apply. The coupon flag is the explicit signal; threshold/
  // zone rules surface later through `rawDeliveryFee === 0`.
  const deliveryAlreadyFreeByCoupon =
    couponDiscount?.coupon_type === "free_delivery";

  // Eligibility conditions that don't depend on the raw fee — the fee-positive
  // check is folded in below once the server has quoted the fee.
  const proDeliveryConditionsMet =
    isProActive &&
    proBenefit?.type === "delivery_fee" &&
    orderType === "delivery" &&
    proMinSatisfied &&
    !deliveryAlreadyFreeByCoupon;
  const proDeliveryOfferType = proBenefit?.offer_type;
  const proDeliveryDiscountPct =
    Number(proBenefit?.charge_discount_percentage) || 0;

  let couponType = "coupon";

  // One server-side quote for this store: delivery, surge, Pro and tax in the
  // sequence the charge is actually billed in. Recomputing any of it here would
  // quote a price the customer is not charged, so every figure below is read
  // back from the response rather than derived.
  const checkoutSummaryQuery = useGetCheckoutSummary({
    orderType: orderType === "take_away" ? "take_away" : "delivery",
    storeId: storeData?.id,
    orderAmount:
      getSubTotalPrice(cartList) - getProductDiscount(cartList, storeData),
    distance: handleDistance(distanceData?.data, origin, destination),
    latitude: destination?.latitude,
    longitude: destination?.longitude,
    deliveryType: selectedDeliveryOption?.deliveryType,
    scheduleAt: orderType === "schedule_order" ? scheduleAt : undefined,
    couponCode: couponDiscount?.code,
    // area_id / zip_code_id — the zone's rule prices off these.
    ...(areaZipParams || {}),
  });
  const checkoutSummary = checkoutSummaryQuery?.data;
  const summaryDelivery = checkoutSummary?.delivery;
  const quoteUnavailable = isQuoteUnavailable(checkoutSummaryQuery);
  useEffect(() => {
    setQuoteUnavailable?.(quoteUnavailable);
  }, [quoteUnavailable]);
  useEffect(() => {
    setSummaryLoading?.(checkoutSummaryQuery.isFetching);
  }, [checkoutSummaryQuery.isFetching]);
  useEffect(() => {
    setDeliveryOptions?.(checkoutSummary?.delivery_options);
  }, [checkoutSummary?.delivery_options]);
  // Passed through untouched — the rows below read `price`, `price_type`,
  // `customer_note` and `customer_note_status` off it.
  const surgePrice = checkoutSummary?.surge;

  // Resolve the raw delivery fee once. Zero result implies the system is
  // already free-delivering for some other reason (free_delivery_over
  // threshold, zone rule, take-away, etc.), in which case the Pro benefit
  // shouldn't double-discount or surface a misleading savings message.
  // The "before" figure — base + surge, ahead of free-delivery and Pro.
  const rawDeliveryFee = Number(summaryDelivery?.base_delivery_charge) || 0;
  // What the customer actually pays for delivery, with those overrides applied.
  const quotedDeliveryCharge = Number(summaryDelivery?.delivery_charge) || 0;
  const quotedProDeliverySavings =
    Number(summaryDelivery?.pro_customer_savings) || 0;
  const deliveryFeeBeforeProDiscount =
    Number(summaryDelivery?.delivery_charge_before_pro_discount) ||
    rawDeliveryFee;

  // A slightly-delay discount can never push the delivery fee below the
  // current module's minimum_shipping_charge (zone pivot) — cap the discount
  // at (fee − minimum) so the surcharge row and the total never credit more
  // than the fee can actually shrink.
  const zonePivot = useMemo(
    () => getInfoFromZoneData(zoneData)?.pivot,
    [zoneData],
  );
  // Fixed-charge modules leave minimum_shipping_charge null and carry the
  // floor in minimum_delivery_charge instead (e.g. grocery: fee 200, floor 12
  // → max discount 188, matching the backend's billing).
  const quotedMinDeliveryCharge =
    summaryDelivery?.min_delivery_charge != null
      ? Number(summaryDelivery.min_delivery_charge)
      : null;
  const minimumShippingCharge =
    quotedMinDeliveryCharge ??
    (Number(zonePivot?.minimum_shipping_charge) ||
      Number(zonePivot?.minimum_delivery_charge) ||
      0);

  // pro_customer_savings already accounts for admin/vendor free delivery.
  const proDeliveryBenefitActive =
    proDeliveryConditionsMet && quotedProDeliverySavings > 0;
  // Full waiver — kept under the old name so the rest of the file's references
  // (deliveryOptionSurcharge gate, strikethrough Free label) still read clearly.
  const isFullFreeDelivery =
    proDeliveryOfferType === ProOfferType.FREE ||
    proDeliveryOfferType === ProOfferType.FULL_FREE;

  const maxDeliveryDiscount = Math.max(
    0,
    deliveryFeeBeforeProDiscount - minimumShippingCharge,
  );
  const cappedDeliveryOptionSurcharge =
    deliveryOptionSurcharge < 0
      ? -Math.min(Math.abs(deliveryOptionSurcharge), maxDeliveryDiscount)
      : deliveryOptionSurcharge;

  // Pro "discount" benefit — percentage/max_amount below are plan metadata
  // for display only (the "15% · up to ৳100" chip). The actual amount
  // deducted is read from checkout-summary's `pro.discount`, the single
  // source of truth already computed server-side against the real
  // post-store-discount subtotal (see checkoutSummary.tax.store_discount_amount).
  const proOrderDiscountPct = Number(proBenefit?.percentage) || 0;
  const proOrderDiscountMax = Number(proBenefit?.max_amount) || 0;
  const proOrderDiscountAmount = Number(checkoutSummary?.pro?.discount) || 0;
  const proOrderDiscountActive =
    isProActive &&
    proBenefit?.type === "discount" &&
    checkoutSummary?.pro?.type === "discount" &&
    proOrderDiscountAmount > 0;

  const proSavingsMessage = (() => {
    if (!proBenefit) return undefined;
    const hasMin = proBenefit?.min_order_status === 1 && proMinOrderAmount > 0;
    const minAmount = hasMin ? getAmountWithSign(proMinOrderAmount) : "";

    if (proBenefit?.type === "delivery_fee") {
      // Only surface the delivery savings message when the benefit is actually
      // applying — otherwise (take-away, min not met, already-free delivery
      // via coupon/threshold/zone) the banner would mislead the user.
      if (!proDeliveryBenefitActive) return undefined;
      if (isFullFreeDelivery) {
        return hasMin
          ? t("Free delivery as a Pro member on orders above {{amount}}", {
              amount: minAmount,
            })
          : t("Free delivery as a Pro member");
      }
      if (proDeliveryDiscountPct > 0) {
        return hasMin
          ? t(
              "{{percent}}% off on delivery fee as a Pro member on orders above {{amount}}",
              { percent: proDeliveryDiscountPct, amount: minAmount },
            )
          : t("{{percent}}% off on delivery fee as a Pro member", {
              percent: proDeliveryDiscountPct,
            });
      }
      return hasMin
        ? t("Delivery fee benefit as a Pro member on orders above {{amount}}", {
            amount: minAmount,
          })
        : t("Delivery fee benefit as a Pro member");
    }

    if (proBenefit?.type === "discount") {
      if (!proOrderDiscountActive) return undefined;
      const hasCap = proOrderDiscountMax > 0;
      const capAmount = hasCap ? getAmountWithSign(proOrderDiscountMax) : "";
      if (hasCap && hasMin) {
        return t(
          "{{percent}}% off as a Pro member (up to {{cap}}) on orders above {{amount}}",
          { percent: proOrderDiscountPct, cap: capAmount, amount: minAmount },
        );
      }
      if (hasCap) {
        return t("{{percent}}% off as a Pro member (up to {{cap}})", {
          percent: proOrderDiscountPct,
          cap: capAmount,
        });
      }
      if (hasMin) {
        return t(
          "{{percent}}% off as a Pro member on orders above {{amount}}",
          { percent: proOrderDiscountPct, amount: minAmount },
        );
      }
      return t("{{percent}}% off as a Pro member", {
        percent: proOrderDiscountPct,
      });
    }

    if (proBenefit?.type === "coupon") {
      return t("Pro coupon benefit unlocked");
    }
    return undefined;
  })();
  const [proModalOpen, setProModalOpen] = useState(false);
  const [proPaymentOpen, setProPaymentOpen] = useState(false);
  const [proSelectedPlan, setProSelectedPlan] = useState(null);
  const subscribeProMutation = useSubscribeProPlan();
  const handleProSubscribe = (plan) => {
    if (!plan) return;
    if (plan.price === 0) {
      subscribeProMutation.mutate(
        {
          plan_id: plan.id,
          payment_type: "free_trial",
          payment_method: "free_trial",
          callback_url:
            typeof window !== "undefined" ? window.location.href : "",
        },
        {
          onSuccess: (res) => {
            const redirect = res?.redirect_link ?? res?.data?.redirect_link;
            if (redirect && typeof window !== "undefined") {
              window.location.href = redirect;
              return;
            }
            toast.success(t("Subscribed successfully"));
            setProModalOpen(false);
          },
          onError: (err) => {
            toast.error(
              err?.response?.data?.message || t("Subscription failed"),
            );
          },
        },
      );
      return;
    }
    setProSelectedPlan(plan);
    setProModalOpen(false);
    setProPaymentOpen(true);
  };

  useEffect(() => {
    const billedPrice = orderType !== "delivery" ? 0 : quotedDeliveryCharge;
    setDeliveryFee(billedPrice);
    setDeliveryFeeBeforeProDiscount?.(
      orderType !== "delivery" ? 0 : deliveryFeeBeforeProDiscount,
    );
    setMinDeliveryCharge?.(
      orderType !== "delivery" ? 0 : minimumShippingCharge,
    );
  }, [
    orderType,
    quotedDeliveryCharge,
    deliveryFeeBeforeProDiscount,
    minimumShippingCharge,
  ]);

  const handleDeliveryFee = () => {
    const priceBeforeProDiscount = deliveryFeeBeforeProDiscount;
    const proDiscount = quotedProDeliverySavings;
    const billedPrice = quotedDeliveryCharge;

    if (
      proDeliveryBenefitActive &&
      proDiscount > 0 &&
      Number(priceBeforeProDiscount) > 0
    ) {
      return (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          spacing={0.5}
          width="100%"
        >
          <Typography sx={{ textDecoration: "line-through", opacity: 0.6 }}>
            {storeData && getAmountWithSign(priceBeforeProDiscount)}
          </Typography>
          <Typography color="primary" fontWeight={600}>
            {billedPrice === 0
              ? t("Free")
              : storeData && getAmountWithSign(billedPrice)}
          </Typography>
        </Stack>
      );
    }

    if (billedPrice === 0) {
      return <Typography>{t("Free")}</Typography>;
    }
    return (
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        spacing={0.5}
        width="100%"
      >
        <Typography>{"(+)"}</Typography>
        <Typography>{storeData && getAmountWithSign(billedPrice)}</Typography>
      </Stack>
    );
  };

  const handleCouponDiscount = () => {
    let couponDiscountValue = getCouponDiscount(
      couponDiscount,
      storeData,
      cartList,
      eligibilityDiscountAmount,
    );

    if (couponDiscount && couponDiscount.coupon_type === "free_delivery") {
      setFreeDelivery("true");
      return 0;
    } else {
      return getAmountWithSign(couponDiscountValue);
    }
  };

  const totalAmountForRefer = couponDiscount
    ? handlePurchasedAmount(cartList) -
      getProductDiscount(cartList, storeData) -
      getCouponDiscount(
        couponDiscount,
        storeData,
        cartList,
        eligibilityDiscountAmount,
      )
    : handlePurchasedAmount(cartList) - getProductDiscount(cartList, storeData);
  const dispatch = useDispatch();
  const referDiscount = getReferDiscount(
    totalAmountForRefer,
    customerData?.data?.discount_amount,
    customerData?.data?.discount_amount_type,
  );

  const computeTotalAmount = () => {
    let totalAmount = getCalculatedTotal(
      cartList,
      couponDiscount,
      storeData,
      configData,
      distanceData,
      couponType,
      orderType,
      freeDelivery,
      Number(deliveryTip),
      zoneData,
      origin,
      destination,
      extraCharge,
      additionalCharge,
      packagingCharge,
      referDiscount,
      checkoutSummary?.tax?.tax_amount,
      surgePrice,
      // Already Pro-discounted and free-delivery-adjusted by the server.
      orderType === "delivery" ? quotedDeliveryCharge : 0,
      eligibilityDiscountAmount,
    );
    totalAmount = Number(totalAmount) + cappedDeliveryOptionSurcharge;

    // getCalculatedTotal always subtracts the legacy client-side store
    // discount (getProductDiscount) internally, with no way to override it.
    // Add that back and subtract checkout-summary's authoritative amount
    // instead, so Total agrees with the Discount row above.
    const legacyStoreDiscount = getProductDiscount(cartList, storeData);
    totalAmount =
      Number(totalAmount) + legacyStoreDiscount - eligibilityDiscountAmount;

    if (proOrderDiscountActive && proOrderDiscountAmount > 0) {
      totalAmount = Number(totalAmount) - proOrderDiscountAmount;
    }

    return totalAmount;
  };

  const computedTotalAmount = computeTotalAmount();

  useEffect(() => {
    setPayableAmount(computedTotalAmount);
    dispatch(setTotalAmount(computedTotalAmount));
  }, [computedTotalAmount]);

  let diffDiscount = {
    value: 0,
  };
  // Kept only for its side effect on `diffDiscount` (the "additional
  // discount" banner below) — the displayed amount comes from
  // discount-eligibility's `discount_amount` alone (see above), not this
  // legacy client-side recompute.
  getProductDiscount(cartList, storeData, diffDiscount);
  const discountedPrice = eligibilityDiscountAmount;

  // Only a store-wide promotion (store discount / happy hour) gets a
  // tooltip - a plain item or bundle discount is not a "why is this
  // discounted" surprise, so it gets none.
  const discountTooltipText =
    eligibilityDiscountSource === "happy_hour"
      ? t("Happy Hour Discount")
      : eligibilityDiscountSource === "store_discount"
      ? t("Store Discount")
      : "";
  const totalAmountAfterPartial = computedTotalAmount - walletBalance;
  const finalTotalAmount = profileInfo?.is_valid_for_discount
    ? computedTotalAmount - referDiscount
    : computedTotalAmount;

  const text1 = t("After completing the order, you will receive a");
  const text2 = t(
    "cashback. The minimum purchase required to avail this offer is",
  );
  const text3 = t("However, the maximum cashback amount is");
  const extraText = t(
    "This delivery fee includes all the applicable charges on delivery",
  );
  const badText = t("and bad weather charge");
  // Append the Pro delivery-fee benefit message to the tooltip so members
  // see exactly which discount the platform is applying to their fee.
  const proDeliveryTooltipText = (() => {
    // Mirrors `proDeliveryBenefitActive` — if delivery is already free for a
    // reason other than the Pro benefit (admin/vendor/coupon), there's no
    // Pro delivery discount to mention in the tooltip.
    if (!proDeliveryBenefitActive) return "";
    const minOrderQualifier =
      proBenefit?.min_order_status === 1 && proMinOrderAmount > 0
        ? ` ${t("on orders above")} ${getAmountWithSign(proMinOrderAmount)}`
        : "";
    if (
      proDeliveryOfferType === "free" ||
      proDeliveryOfferType === "full_free"
    ) {
      return ` ${t("Free delivery as a Pro member")}${minOrderQualifier}.`;
    }
    if (proDeliveryDiscountPct > 0) {
      return ` ${proDeliveryDiscountPct}% ${t(
        "off on delivery fee as a Pro member",
      )}${minOrderQualifier}.`;
    }
    return ` ${t("Delivery fee benefit as a Pro member")}${minOrderQualifier}.`;
  })();
  // Surge amount is shown regardless of the note — the note (when the admin
  // turned it on) is additional context, not a replacement for the figure.
  const surgeAmountText =
    Number(surgePrice?.price) > 0
      ? ` ${t("A surge charge of")} ${
          surgePrice?.price_type === "percent"
            ? `${surgePrice.price}%`
            : getAmountWithSign(surgePrice.price)
        } ${t("has been applied")}.`
      : "";
  const surgeNoteText =
    Number(surgePrice?.price) > 0 &&
    surgePrice?.customer_note_status &&
    surgePrice?.customer_note
      ? ` ${surgePrice.customer_note}`
      : "";
  const deliveryToolTipsText = `${extraText}${surgeAmountText}${surgeNoteText}${proDeliveryTooltipText}`;

  return (
    <>
      {isProActive && proBenefit?.type === "coupon" && !couponDiscount && (
        <Grid item xs={12} sx={{ mt: 1 }}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.25}
            sx={{
              p: 1.25,
              borderRadius: "10px",
              border: `1px dashed ${alpha(theme.palette.primary.main, 0.5)}`,
              backgroundColor: alpha(theme.palette.primary.main, 0.06),
            }}
          >
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: alpha(theme.palette.primary.main, 0.15),
                flexShrink: 0,
              }}
            >
              <InfoIcon
                sx={{ fontSize: 16, color: theme.palette.primary.main }}
              />
            </Box>
            <Stack spacing={0.25} sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: theme.palette.primary.main,
                }}
              >
                {t("Pro coupon benefit available")}
              </Typography>
              <Typography
                sx={{
                  fontSize: "12px",
                  color: theme.palette.text.secondary,
                }}
              >
                {t(
                  "Apply your Pro coupon above to claim the discount on this order.",
                )}
              </Typography>
            </Stack>
          </Stack>
        </Grid>
      )}
      <CalculationGrid container item xs={12} spacing={1} mt="1rem">
        <Grid item md={8} xs={8}>
          {cartList.length > 1 ? t("Items Price") : t("Item Price")}
        </Grid>
        <Grid item md={4} xs={4} align="right">
          <Typography textTransform="capitalize" align="right">
            {getAmountWithSign(getSubTotalPrice(cartList))}
          </Typography>
        </Grid>
        <Grid item md={8} xs={8}>
          <Stack direction="row" alignItems="center" spacing={0.75}>
            <Typography component="span">{t("Discount")}</Typography>
            {discountTooltipText ? (
              <Tooltip title={discountTooltipText} placement="top" arrow>
                <i
                  className="fi fi-br-info"
                  style={{
                    fontSize: "11px",
                    display: "flex",
                    lineHeight: 1,
                    cursor: "pointer",
                  }}
                />
              </Tooltip>
            ) : null}
          </Stack>
        </Grid>
        <Grid item md={4} xs={4} align="right">
          <Stack
            width="100%"
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            spacing={0.5}
          >
            <Typography>{"(-)"}</Typography>
            <Typography>
              {storeData ? getAmountWithSign(discountedPrice) : null}
            </Typography>
          </Stack>
        </Grid>
        {couponDiscount ? (
          <>
            <Grid item md={8} xs={8}>
              <Stack direction="row" alignItems="center" spacing={0.75}>
                <Typography component="span">{t("Coupon Discount")}</Typography>
                {couponDiscount?.coupon_type === "pro_customer" ? (
                  <Tooltip
                    title={t("Exclusive coupon unlocked for Pro members.")}
                    placement="top"
                    arrow
                  >
                    <Typography
                      component="span"
                      sx={{
                        fontSize: "11px",
                        px: 0.75,
                        py: 0.1,
                        borderRadius: "999px",
                        backgroundColor: alpha(
                          theme.palette.primary.main,
                          0.12,
                        ),
                        color: theme.palette.primary.main,
                        fontWeight: 600,
                        cursor: "help",
                      }}
                    >
                      {t("Pro")}
                    </Typography>
                  </Tooltip>
                ) : null}
              </Stack>
            </Grid>
            <Grid item md={4} xs={4} align="right">
              {couponDiscount.coupon_type === "free_delivery" ? (
                <Typography textTransform="capitalize">
                  {t("Free Delivery")}
                </Typography>
              ) : (
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="flex-end"
                  spacing={0.5}
                >
                  <Typography>{"(-)"}</Typography>
                  <Typography>
                    {storeData && cartList && handleCouponDiscount()}
                  </Typography>
                </Stack>
              )}
            </Grid>
          </>
        ) : null}
        {customerData?.data?.is_valid_for_discount ? (
          <>
            <Grid item md={8} xs={8}>
              {t("Referral Discount")}
            </Grid>
            <Grid item md={4} xs={4} align="right">
              <Stack
                width="100%"
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
                spacing={0.5}
              >
                <Typography>{"(-)"}</Typography>
                <Typography>{getAmountWithSign(referDiscount)}</Typography>
              </Stack>
            </Grid>
          </>
        ) : null}
        {proOrderDiscountActive && proOrderDiscountAmount > 0 ? (
          <>
            <Grid item md={8} xs={8}>
              <Stack direction="row" alignItems="center" spacing={0.75}>
                <Typography component="span">{t("Pro Discount")}</Typography>
                <Typography
                  component="span"
                  sx={{
                    fontSize: "11px",
                    px: 0.75,
                    py: 0.1,
                    borderRadius: "999px",
                    backgroundColor: alpha(theme.palette.primary.main, 0.12),
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                  }}
                >
                  {`${proOrderDiscountPct}%`}
                  {proOrderDiscountMax > 0
                    ? ` · ${t("up to")} ${getAmountWithSign(
                        proOrderDiscountMax,
                      )}`
                    : ""}
                </Typography>
              </Stack>
            </Grid>
            <Grid item md={4} xs={4} align="right">
              <Stack
                width="100%"
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
                spacing={0.5}
              >
                <Typography>{"(-)"}</Typography>
                <Typography>
                  {getAmountWithSign(proOrderDiscountAmount)}
                </Typography>
              </Stack>
            </Grid>
          </>
        ) : null}
        {checkoutSummary?.tax?.tax_included !== null &&
        checkoutSummary?.tax?.tax_included === 0 ? (
          <>
            <Grid item md={8} xs={8}>
              {t("VAT/TAX")}
            </Grid>
            <Grid item md={4} xs={4} align="right">
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
                spacing={0.5}
              >
                <Typography>
                  {checkoutSummary?.tax?.tax_included === 0 && <>{"(+)"}</>}
                  {getAmountWithSign(checkoutSummary?.tax?.tax_amount)}
                </Typography>
              </Stack>
            </Grid>
          </>
        ) : null}
        {orderType === "delivery" || orderType === "schedule_order" ? (
          Number.parseInt(configData?.dm_tips_status) === 1 ? (
            <>
              <Grid item md={8} xs={8} sx={{ textTransform: "capitalize" }}>
                {t("Deliveryman tips")}
              </Grid>
              <Grid item md={4} xs={4} align="right">
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="flex-end"
                  spacing={0.5}
                >
                  <Typography>{"(+)"}</Typography>
                  <Typography>{getAmountWithSign(deliveryTip)}</Typography>
                </Stack>
              </Grid>
            </>
          ) : null
        ) : null}

        {configData?.additional_charge_status === 1 ? (
          <>
            <Grid
              item
              xs={8}
              sx={{
                textTransform: "capitalize",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap", // ensures single line
              }}
            >
              {t(configData?.additional_charge_name)}
            </Grid>
            <Grid item xs={4} align="right">
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
        {
          <>
            {isLoading ? (
              <CustomStackFullWidth
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ paddingInlineStart: "5px" }}
              >
                <Skeleton variant="text" width="50px" />
                <Skeleton variant="text" width="50px" />
              </CustomStackFullWidth>
            ) : (
              <>
                {orderType === "delivery" || orderType === "schedule_order" ? (
                  <>
                    <Grid item xs={8} sx={{ textTransform: "capitalize" }}>
                      <Stack direction="row" alignItems="center" spacing={0.75}>
                        <Typography component="span" align="center">
                          {t("Delivery fee")}
                        </Typography>
                        {(Number.parseInt(storeData?.self_delivery_system) !==
                          1 || proDeliveryBenefitActive) &&
                        !(
                          couponDiscount?.coupon_type === "free_delivery" ||
                          quotedDeliveryCharge === 0
                        ) ? (
                          <Tooltip
                            title={deliveryToolTipsText}
                            placement="top"
                            arrow={true}
                          >
                            <i
                              className="fi fi-br-info"
                              style={{
                                fontSize: "11px",
                                display: "flex",
                                lineHeight: 1,
                                cursor: "pointer",
                              }}
                            />
                          </Tooltip>
                        ) : null}
                        {proDeliveryBenefitActive &&
                        rawDeliveryFee > 0 &&
                        freeDelivery !== "true" &&
                        !deliveryAlreadyFreeByCoupon ? (
                          <Typography
                            component="span"
                            sx={{
                              fontSize: "11px",
                              px: 0.75,
                              py: 0.1,
                              borderRadius: "999px",
                              backgroundColor: alpha(
                                theme.palette.primary.main,
                                0.12,
                              ),
                              color: theme.palette.primary.main,
                              fontWeight: 600,
                            }}
                          >
                            {t("Pro")}
                          </Typography>
                        ) : null}
                      </Stack>
                    </Grid>
                    <Grid item xs={4} align="right">
                      {couponDiscount ? (
                        couponDiscount?.coupon_type === "free_delivery" ? (
                          <Typography>{t("Free")}</Typography>
                        ) : (
                          storeData && handleDeliveryFee()
                        )
                      ) : (
                        storeData && handleDeliveryFee()
                      )}
                    </Grid>
                  </>
                ) : null}
              </>
            )}
          </>
        }

        {selectedDeliveryOption &&
          selectedDeliveryOption.deliveryType !== "standard" &&
          orderType === "delivery" &&
          couponDiscount?.coupon_type !== "free_delivery" &&
          cappedDeliveryOptionSurcharge !== 0 && (
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
                    {cappedDeliveryOptionSurcharge > 0 ? "(+)" : "(-)"}
                  </Typography>
                  <Typography>
                    {getAmountWithSign(Math.abs(cappedDeliveryOptionSurcharge))}
                  </Typography>
                </Stack>
              </Grid>
            </>
          )}

        {/* {proFeatureEnabled && hasToken && !isProActive && (
          <Grid item xs={12} sx={{ mt: 1 }}>
            <ProPlanBanner onSubscribe={() => setProModalOpen(true)} />
          </Grid>
        )} */}
        {/* {proFeatureEnabled && hasToken && isProActive && (
          <Grid item xs={12} sx={{ mt: 1, mb: 0.5 }}>
            <ProSavingsBanner
              amount={
                activeOffer?.total_saved ??
                activeOffer?.plan_details?.total_saved
              }
              message={proSavingsMessage}
            />
          </Grid>
        )} */}

        <CustomDivider border="1px" />
        <TotalGrid container md={12} xs={12} mt="1rem">
          {isLoading ? (
            <CustomStackFullWidth
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ paddingInlineStart: "5px" }}
            >
              <Skeleton variant="text" width="50px" />
              <Skeleton variant="text" width="50px" />
            </CustomStackFullWidth>
          ) : (
            <>
              <Grid
                item
                md={8}
                xs={8}
                sx={{
                  textTransform: "capitalize",
                  fontWeight: "700",
                  color: (theme) => theme.palette.primary.main,
                  paddingInlineStart: "7px",
                }}
              >
                <Typography
                  component="span"
                  sx={{ textTransform: "capitalize", fontWeight: "700" }}
                >
                  {t("Total")}
                  <Typography
                    sx={{ marginInlineStart: "5px" }}
                    component="span"
                    fontSize="12px"
                    fontWeight="400"
                    color={theme.palette.primary.main}
                  >
                    {checkoutSummary?.tax?.tax_included === 1 &&
                      t("(Vat/Tax incl.)")}
                  </Typography>
                </Typography>
              </Grid>
              <Grid item md={4} xs={4} align="right">
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="flex-end"
                  spacing={0.5}
                >
                  <Typography color={theme.palette.primary.main} align="right">
                    {" "}
                    {storeData &&
                      cartList &&
                      getAmountWithSign(finalTotalAmount)}
                  </Typography>
                </Stack>
              </Grid>
            </>
          )}
        </TotalGrid>
        {diffDiscount?.value > 0 ? (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: "400",
              width: "100%",
              color: (theme) => theme.palette.neutral[1000],
              padding: "5px 0px",
              backgroundColor: "#FFF6CA",
            }}
            align="center"
          >
            {t(
              `You got ${getAmountWithSign(
                diffDiscount?.value,
              )} additional discount`,
            )}
          </Typography>
        ) : null}
        {token && cashbackAmount?.cashback_amount > 0 && (
          <Grid item xs={12}>
            <Box
              borderRadius={"5px"}
              borderLeft={`2px solid ${theme.palette.primary.main}`}
              padding={"0.3rem"}
              paddingLeft={"0.7rem"}
              backgroundColor={alpha(theme.palette.primary.main, 0.051)}
              fontSize={{ xs: "0.7rem" }}
            >
              {cashbackAmount?.cashback_amount > 0
                ? `${text1} ${
                    cashbackAmount?.cashback_type === "percentage"
                      ? cashbackAmount?.cashback_amount + "%"
                      : getAmountWithSign(cashbackAmount?.cashback_amount)
                  } ${text2} ${getAmountWithSign(
                    cashbackAmount?.min_purchase,
                  )}. ${
                    cashbackAmount?.cashback_type === "percentage"
                      ? text3 +
                        " " +
                        getAmountWithSign(cashbackAmount?.max_discount) +
                        "."
                      : ""
                  }
`
                : ""}
            </Box>
          </Grid>
        )}
      </CalculationGrid>
      {proFeatureEnabled && proModalOpen && (
        <ProPlanSubscriptionModal
          open={proModalOpen}
          onClose={() => setProModalOpen(false)}
          onSubscribe={handleProSubscribe}
          isSubmitting={subscribeProMutation.isLoading}
        />
      )}
      {proFeatureEnabled && proPaymentOpen && (
        <ProPlanPaymentModal
          open={proPaymentOpen}
          onClose={() => setProPaymentOpen(false)}
          plan={proSelectedPlan}
        />
      )}
    </>
  );
};

OrderCalculation.propTypes = {};

export default OrderCalculation;
