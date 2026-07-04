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
import { getGuestId, getToken } from "helper-functions/getToken";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { setTotalAmount } from "redux/slices/cart";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import {
  bad_weather_fees,
  getCalculatedTotal,
  getCouponDiscount,
  getDeliveryFees,
  getProductDiscount,
  getSubTotalPrice,
  getTaxableTotalPrice,
  handlePurchasedAmount,
} from "utils/CustomFunctions";
import CustomDivider from "../../CustomDivider";
import { CalculationGrid, TotalGrid } from "../CheckOut.style";
import { useGetSurgePrice } from "api-manage/hooks/react-query/order-place/useGetSurgePrice";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import useGetProActiveOffer from "api-manage/hooks/react-query/pro-plans/useGetProActiveOffer";
import useSubscribeProPlan from "api-manage/hooks/react-query/pro-plans/useSubscribeProPlan";
import ProPlanBanner from "components/pro-plan/ProPlanBanner";
import ProSavingsBanner from "components/pro-plan/ProSavingsBanner";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";

const ProOfferType = {
  FREE: "free",
  FULL_FREE: "full_free",
  PARTIAL_FREE: "partial_free",
};

const ProPlanSubscriptionModal = dynamic(() =>
  import("components/pro-plan/ProPlanSubscriptionModal")
);
const ProPlanPaymentModal = dynamic(() =>
  import("components/pro-plan/ProPlanPaymentModal")
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
  const tempExtraCharge = extraCharge ?? 0;
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
  console.log("[PRO-OFFER]", { activeOffer, isProActive, proBenefit });

  // Backend shape: {type, offer_type ("free" | "partial_free"),
  // charge_discount_percentage, min_order_status, min_order_amount}.
  // Apply the min-order gate against the post-product-discount cart subtotal,
  // since the discount is what the customer actually pays before delivery.
  const proMinOrderAmount = Number(proBenefit?.min_order_amount) || 0;
  // `free_delivery` coupons don't reduce the cart subtotal — they only
  // waive the delivery fee — so they're skipped from the deduction.
  const proCouponDeduction =
    couponDiscount && couponDiscount?.coupon_type !== "free_delivery"
      ? Number(getCouponDiscount(couponDiscount, storeData, cartList)) || 0
      : 0;
  const proSubtotalForMinCheck = Math.max(
    0,
    handlePurchasedAmount(cartList) -
      getProductDiscount(cartList, storeData) -
      proCouponDeduction
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
  // check is folded in below once we've computed it via getDeliveryFees.
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
  const { data: surgePrice, mutate } = useGetSurgePrice();
  useEffect(() => {
    if (storeData) {
      const temData = {
        zone_id: storeData?.zone_id,
        module_id: storeData?.module_id,
        date_time:
          orderType === "schedule_order"
            ? scheduleAt
            : new Date().toISOString(),
        guest_id: getGuestId(),
      };
      mutate(temData, {
        onError: onErrorResponse,
      });
    }
  }, [storeData, orderType, scheduleAt]);

  // Resolve the raw delivery fee once. Zero result implies the system is
  // already free-delivering for some other reason (free_delivery_over
  // threshold, zone rule, take-away, etc.), in which case the Pro benefit
  // shouldn't double-discount or surface a misleading savings message.
  const rawDeliveryFee =
    Number(
      getDeliveryFees(
        storeData,
        configData,
        cartList,
        distanceData?.data,
        couponDiscount,
        couponType,
        orderType,
        zoneData,
        origin,
        destination,
        tempExtraCharge,
        surgePrice
      )
    ) || 0;

  const proDeliveryBenefitActive =
    proDeliveryConditionsMet && rawDeliveryFee > 0;
  // Full waiver — kept under the old name so the rest of the file's references
  // (deliveryOptionSurcharge gate, strikethrough Free label) still read clearly.
  const isFullFreeDelivery =
    proDeliveryOfferType === ProOfferType.FREE ||
    proDeliveryOfferType === ProOfferType.FULL_FREE;
  const proCoversDelivery = proDeliveryBenefitActive && isFullFreeDelivery;

  // Discount amount the Pro benefit applies to a raw delivery fee.
  const computeProDeliveryDiscount = (rawFee) => {
    if (!proDeliveryBenefitActive) return 0;
    const fee = Number(rawFee) || 0;
    if (isFullFreeDelivery) return fee;
    if (
      proDeliveryOfferType === ProOfferType.PARTIAL_FREE &&
      proDeliveryDiscountPct > 0
    ) {
      return (fee * proDeliveryDiscountPct) / 100;
    }
    return 0;
  };

  // Pro "discount" benefit (percentage off the order subtotal, capped at
  // max_amount, gated on the same min-order threshold). Computed against the
  // post-product-discount subtotal so it stacks with item-level promos but
  // not with itself.
  const proOrderDiscountPct = Number(proBenefit?.percentage) || 0;
  const proOrderDiscountMax = Number(proBenefit?.max_amount) || 0;
  const proOrderDiscountActive =
    isProActive &&
    proBenefit?.type === "discount" &&
    proMinSatisfied &&
    proOrderDiscountPct > 0;
  const proOrderDiscountAmount = (() => {
    if (!proOrderDiscountActive) return 0;
    const raw = (proSubtotalForMinCheck * proOrderDiscountPct) / 100;
    return proOrderDiscountMax > 0 ? Math.min(raw, proOrderDiscountMax) : raw;
  })();

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
              { percent: proDeliveryDiscountPct, amount: minAmount }
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
          { percent: proOrderDiscountPct, cap: capAmount, amount: minAmount }
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
          { percent: proOrderDiscountPct, amount: minAmount }
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
              err?.response?.data?.message || t("Subscription failed")
            );
          },
        }
      );
      return;
    }
    setProSelectedPlan(plan);
    setProModalOpen(false);
    setProPaymentOpen(true);
  };

  const handleDeliveryFee = () => {
    let price = getDeliveryFees(
      storeData,
      configData,
      cartList,
      distanceData?.data,
      couponDiscount,
      couponType,
      orderType,
      zoneData,
      origin,
      destination,
      tempExtraCharge,
      surgePrice
    );

    const proDiscount = computeProDeliveryDiscount(price);
    const billedPrice = Math.max(0, Number(price) - proDiscount);
    setDeliveryFee(orderType !== "delivery" ? 0 : billedPrice);

    if (proDeliveryBenefitActive && proDiscount > 0 && Number(price) > 0) {
      return (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          spacing={0.5}
          width="100%"
        >
          <Typography sx={{ textDecoration: "line-through", opacity: 0.6 }}>
            {storeData && getAmountWithSign(price)}
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
        <Typography>{storeData && getAmountWithSign(price)}</Typography>
      </Stack>
    );
  };

  const handleCouponDiscount = () => {
    let couponDiscountValue = getCouponDiscount(
      couponDiscount,
      storeData,
      cartList
    );

    if (couponDiscount && couponDiscount.coupon_type === "free_delivery") {
      setFreeDelivery("true");
      return 0;
    } else {
      return getAmountWithSign(couponDiscountValue);
    }
  };
  console.log("ddd", handleCouponDiscount());

  const totalAmountForRefer = couponDiscount
    ? handlePurchasedAmount(cartList) -
      getProductDiscount(cartList, storeData) -
      getCouponDiscount(couponDiscount, storeData, cartList)
    : handlePurchasedAmount(cartList) - getProductDiscount(cartList, storeData);
  const dispatch = useDispatch();
  const referDiscount = getReferDiscount(
    totalAmountForRefer,
    customerData?.data?.discount_amount,
    customerData?.data?.discount_amount_type
  );
  const handleOrderAmount = () => {
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
      taxAmount?.tax_amount,
      surgePrice
    );
    totalAmount = Number(totalAmount) + deliveryOptionSurcharge;

    // Pro member with an active delivery_fee benefit → waive the fee
    // (offer_type "free") or apply the percentage discount (offer_type
    // "partial_free"). getCalculatedTotal already rolled the full fee into
    // the total, so subtract the benefit's discount portion back out.
    if (proDeliveryBenefitActive) {
      const deliveryFeeValue = getDeliveryFees(
        storeData,
        configData,
        cartList,
        distanceData?.data,
        couponDiscount,
        couponType,
        orderType,
        zoneData,
        origin,
        destination,
        tempExtraCharge,
        surgePrice
      );
      totalAmount =
        Number(totalAmount) - computeProDeliveryDiscount(deliveryFeeValue);
    }

    // Pro "discount" benefit (percentage off the subtotal, capped at
    // max_amount). getCalculatedTotal doesn't know about it, so subtract
    // the computed amount from the running total.
    if (proOrderDiscountActive && proOrderDiscountAmount > 0) {
      totalAmount = Number(totalAmount) - proOrderDiscountAmount;
    }

    setPayableAmount(totalAmount);
    dispatch(setTotalAmount(totalAmount));
    return totalAmount;
  };
  let diffDiscount = {
    value: 0,
  };
  const discountedPrice = getProductDiscount(cartList, storeData, diffDiscount);
  const totalAmountAfterPartial = handleOrderAmount() - walletBalance;
  const finalTotalAmount = profileInfo?.is_valid_for_discount
    ? handleOrderAmount() - referDiscount
    : handleOrderAmount();

  const text1 = t("After completing the order, you will receive a");
  const text2 = t(
    "cashback. The minimum purchase required to avail this offer is"
  );
  const text3 = t("However, the maximum cashback amount is");
  const extraText = t(
    "This delivery fee includes all the applicable charges on delivery"
  );
  const badText = t("and bad weather charge");
  // Append the Pro delivery-fee benefit message to the tooltip so members
  // see exactly which discount the platform is applying to their fee.
  const proDeliveryTooltipText = (() => {
    if (!(isProActive && proBenefit?.type === "delivery_fee")) return "";
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
        "off on delivery fee as a Pro member"
      )}${minOrderQualifier}.`;
    }
    return ` ${t("Delivery fee benefit as a Pro member")}${minOrderQualifier}.`;
  })();
  const deliveryToolTipsText = `${extraText}${
    surgePrice?.customer_note_status !== 0
      ? `. ${surgePrice?.customer_note} `
      : ""
  }${proDeliveryTooltipText}`;
  console.log({ proCoversDelivery });

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
                  "Apply your Pro coupon above to claim the discount on this order."
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
          {t("Discount")}
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
                          0.12
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
                        proOrderDiscountMax
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
        {taxAmount?.tax_included !== null && taxAmount?.tax_included === 0 ? (
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
                  {taxAmount?.tax_included === 0 && <>{"(+)"}</>}
                  {getAmountWithSign(taxAmount?.tax_amount)}
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
                          {Number.parseInt(storeData?.self_delivery_system) !==
                            1 || proDeliveryBenefitActive ? (
                            <Typography component="span">
                              <Tooltip
                                title={deliveryToolTipsText}
                                placement="top"
                                arrow={true}
                              >
                                <InfoIcon sx={{ fontSize: "11px" }} />
                              </Tooltip>
                            </Typography>
                          ) : null}
                        </Typography>
                        {proCoversDelivery &&
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
                                0.12
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
                    {taxAmount?.tax_included === 1 && t("(Vat/Tax incl.)")}
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
                diffDiscount?.value
              )} additional discount`
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
                    cashbackAmount?.min_purchase
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
