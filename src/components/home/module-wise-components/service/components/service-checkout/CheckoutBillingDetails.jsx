import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  Box,
  CircularProgress,
  Skeleton,
  Stack,
  Typography,
  alpha,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { PrimaryButton } from "components/Map/map.style";

import CustomImageContainer from "components/CustomImageContainer";
import VariationContent from "components/added-cart-view/VariationContent";
import {
  getAmountWithSign,
  getDiscountedAmount,
} from "helper-functions/CardHelpers";
import { getCartListModuleWise } from "helper-functions/getCartListModuleWise";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import SimpleBar from "simplebar-react";
import {
  cartItemsTotalAmount,
  formatPhoneNumber,
  getCouponDiscount,
  handleTotalAmountWithAddons,
} from "utils/CustomFunctions";
import {
  setGuestUserInfo,
  setGuestUserOrderId,
} from "redux/slices/guestUserInfo";
import {
  setOrderDetailsModalOpen,
  setOrderInformation,
  setOpenSignInModal,
} from "redux/slices/utils";
import { setOrderDetailsModal } from "redux/slices/offlinePaymentData";
import usePlaceServiceBooking from "components/home/module-wise-components/service/service-api-manage/hooks/react-query/booking/usePlaceServiceBooking";
import useGetServiceBookingTax from "components/home/module-wise-components/service/service-api-manage/hooks/react-query/booking/useGetServiceBookingTax";
import useServiceBookingPayment from "components/home/module-wise-components/service/service-api-manage/hooks/react-query/booking/useServiceBookingPayment";
import useGetProActiveOffer from "api-manage/hooks/react-query/pro-plans/useGetProActiveOffer";
import useGetCashBackAmount from "api-manage/hooks/react-query/cashback/useGetCashBackAmount";
import dayjs from "dayjs";
import Router from "next/router";
import { useRouter } from "next/router";
import { getToken } from "helper-functions/getToken";
import { getCurrentModuleId } from "helper-functions/getCurrentModuleType";
import toast from "react-hot-toast";
import useServiceBusinessConfig from "components/home/module-wise-components/service/service-api-manage/hooks/custom-hooks/useServiceBusinessConfig";
import CustomServiceInfo from "./custom-service/CustomServiceInfo";
import { validateBookingForm } from "./checkoutValidation";
import {
  normalizePaymentMethod,
  buildCustomServicePayload,
  buildNormalServicePayload,
  buildBuyNowServicePayload,
  buildBuyNowQuantityFields,
  buildBuyNowPrice,
} from "./buildBookingPayload";

const SidebarSurface = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: "16px",
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: `0px 2px 12px ${alpha(theme.palette.text.primary, 0.04)}`,
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  maxHeight: "100%",
  [theme.breakpoints.up("md")]: {
    maxHeight: "calc(100vh - 200px)",
  },
}));

const CartItemRow = ({ cartItem }) => {
  const theme = useTheme();
  const itemTotal = handleTotalAmountWithAddons(
    getDiscountedAmount(
      cartItem?.totalPrice,
      cartItem?.discount,
      cartItem?.discount_type,
      cartItem?.store_discount,
      cartItem?.quantity,
    ),
    cartItem?.selectedAddons,
  );

  const originalPrice =
    cartItem?.price && cartItem?.quantity
      ? cartItem.price * cartItem.quantity
      : null;
  const showStrike =
    originalPrice != null && Number(originalPrice) > Number(itemTotal);

  return (
    <Stack
      sx={{
        py: 1.25,
        px: 1.5,
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
        "&:first-of-type": { pt: 0 },
        "&:last-child": { borderBottom: "none" },
      }}
      spacing={0.75}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <CustomImageContainer
          src={cartItem?.image_full_url}
          width="52px"
          height="52px"
          borderRadius="10px"
          objectfit="cover"
        />

        <Stack flex={1} spacing={0.2} sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: "13px",
              fontWeight: 600,
              color: theme.palette.text.primary,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              lineHeight: 1.3,
            }}
          >
            {cartItem?.name}
          </Typography>
          {cartItem?.selectedOption?.name && (
            <Typography
              sx={{
                fontSize: "11px",
                color: theme.palette.text.secondary,
                lineHeight: 1.3,
              }}
            >
              {cartItem.selectedOption.name}
            </Typography>
          )}
          <Stack direction="row" alignItems="baseline" spacing={0.75}>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 700,
                color: theme.palette.text.primary,
              }}
            >
              {getAmountWithSign(itemTotal)}
            </Typography>
            {showStrike && (
              <Typography
                sx={{
                  fontSize: "12px",
                  color: theme.palette.text.disabled,
                  textDecoration: "line-through",
                }}
              >
                {getAmountWithSign(originalPrice)}
              </Typography>
            )}
          </Stack>
        </Stack>

        <Box
          sx={{
            flexShrink: 0,
            width: 32,
            height: 32,
            borderRadius: "10px",
            backgroundColor: theme.palette.background.secondary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 700,
              color: theme.palette.text.primary,
            }}
          >
            {cartItem?.quantity ?? 1}
          </Typography>
        </Box>
      </Stack>

      <Box>
        <VariationContent cartItem={cartItem} />
      </Box>
    </Stack>
  );
};

const PolicyBox = ({ sx }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        px: 1.5,
        py: 1.25,
        borderRadius: "8px",
        backgroundColor: theme.palette.couponBg.discount,
        ...sx,
      }}
    >
      <Typography
        sx={{
          fontSize: "12px",
          color: theme.palette.text.primary,
          lineHeight: 1.6,
        }}
      >
        {t("By continuing, you will agree with")}{" "}
        <Box
          component="a"
          href="/privacy-policy"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            fontWeight: 700,
            textDecoration: "underline",
            cursor: "pointer",
            color: "inherit",
          }}
        >
          {t("Privacy Policy")}
        </Box>{" "}
        {t("and")}{" "}
        <Box
          component="a"
          href="/terms-and-conditions"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            fontWeight: 700,
            textDecoration: "underline",
            cursor: "pointer",
            color: "inherit",
          }}
        >
          {t("Terms & Condition")}
        </Box>
      </Typography>
    </Box>
  );
};

// Full-panel shimmer while the checkout context (provider/cart/config) is
// still resolving — mirrors the item rows + price breakdown layout so the
// panel doesn't flash misleading zeros before the data lands.
const BillingShimmer = () => {
  const theme = useTheme();
  return (
    <>
      <Stack sx={{ px: 1.5 }}>
        {[0, 1].map((i) => (
          <Stack
            key={i}
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              py: 1.25,
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
              "&:last-child": { borderBottom: "none" },
            }}
          >
            <Skeleton
              variant="rounded"
              width={52}
              height={52}
              sx={{ borderRadius: "10px", flexShrink: 0 }}
            />
            <Stack flex={1} spacing={0.5} sx={{ minWidth: 0 }}>
              <Skeleton variant="text" width="70%" height={16} />
              <Skeleton variant="text" width="40%" height={14} />
            </Stack>
            <Skeleton
              variant="rounded"
              width={32}
              height={32}
              sx={{ borderRadius: "10px", flexShrink: 0 }}
            />
          </Stack>
        ))}
      </Stack>
      <Stack
        sx={{
          borderTop: `1px solid ${theme.palette.divider}`,
          padding: "24px 20px 0",
          mb: 3,
        }}
        spacing={1}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <Stack
            key={i}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Skeleton variant="text" width={i === 0 ? 130 : 100} height={18} />
            <Skeleton variant="text" width={60} height={18} />
          </Stack>
        ))}
      </Stack>
    </>
  );
};

const CheckoutBillingDetails = ({
  isCustomService,
  service,
  providerId,
  address,
  scheduledAt,
  paymentMethod,
  bookingType,
  serviceLocation,
  couponDiscount,
  usePartialPayment,
  multiBookingType,
  repeatDates,
  providerData,
  reqServiceDetails,
  onTotalAmountChange,
  overrideCartList,
  isBuyNow,
  onOfflineBookingPlaced,
  isCheckoutReady = true,
  check,
  formik,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  const { mutate: placeBooking, isLoading: isPlacing } =
    usePlaceServiceBooking();
  const { mutate: taxMutate, data: taxData } = useGetServiceBookingTax();
  const { mutate: payBooking, isLoading: isPaying } =
    useServiceBookingPayment();
  const scrollableRef = useRef(null);
  const priceSectionRef = useRef(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    let scrollEl = null;
    let observer = null;
    let raf1, raf2;

    const checkScrollable = () => {
      if (!scrollEl) return;
      setIsScrollable(scrollEl.scrollHeight > scrollEl.clientHeight + 100);
    };

    const handleScroll = () => {
      if (!scrollEl) return;
      setIsAtTop(scrollEl.scrollTop < 10);
    };

    const init = () => {
      scrollEl = scrollableRef.current;
      if (!scrollEl) return;

      checkScrollable();
      scrollEl.addEventListener("scroll", handleScroll);

      observer = new ResizeObserver(checkScrollable);
      observer.observe(scrollEl);

      const contentEl =
        scrollEl.querySelector(".simplebar-content") ||
        scrollEl.firstElementChild;
      if (contentEl && contentEl !== scrollEl) {
        observer.observe(contentEl);
      }
    };

    // Double rAF ensures layout is fully settled before measuring scrollHeight
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(init);
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      if (scrollEl) scrollEl.removeEventListener("scroll", handleScroll);
      if (observer) observer.disconnect();
    };
  }, []);

  const handleScrollToggle = () => {
    if (isMobile) {
      priceSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }
    const el = scrollableRef.current;
    if (!el) return;
    if (isAtTop) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    } else {
      el.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const { cartList: aliasCartList } = useSelector((state) => state.cart);
  const { couponInfo } = useSelector((state) => state.profileInfo);
  const { configData } = useSelector((state) => state.configData);
  const { checkLeadTime, getLeadTimeErrorMessage } = useServiceBusinessConfig(
    configData,
    providerData,
  );
  const { guestUserInfo } = useSelector((state) => state.guestUserInfo);
  const { profileInfo } = useSelector((state) => state.profileInfo);
  const { offlineMethod } = useSelector((state) => state.offlinePayment);
  const providerDetails = providerData;

  const token = getToken();
  const proFeatureEnabled = configData?.pro_member_status === 1;
  const { data: activeOfferRaw } = useGetProActiveOffer({
    enabled: proFeatureEnabled && !!token,
  });
  const activeOffer = activeOfferRaw?.data ?? activeOfferRaw ?? null;
  const isProActive = activeOffer?.status === true;
  const proBenefit = activeOffer?.benefit ?? null;

  const displayCartList = useMemo(() => {
    // Book Now checkout is scoped to the single item passed down from
    // ServiceCheckoutPage — never recomputed from the regular service cart.
    if (overrideCartList) return overrideCartList;
    return getCartListModuleWise(aliasCartList).filter(
      (item) => !providerId || String(item?.store_id) === String(providerId),
    );
  }, [overrideCartList, aliasCartList, providerId]);

  const buyNowItem = isBuyNow ? displayCartList?.[0] : null;
  const isCampaignBuyNow = isBuyNow && Boolean(buyNowItem?.isCampaignService);

  const subtotal = cartItemsTotalAmount(displayCartList);
  const originalSubtotal = displayCartList?.reduce((sum, item) => {
    const itemQty = item?.quantity || 1;
    const itemPrice = item?.price || 0;
    return sum + itemPrice * itemQty;
  }, 0);

  // Provider/store-wide discount from the provider's `discount` object.
  // Computed directly because the shared getProductDiscount() returns NaN for
  // service cart items. Honours %/flat, max_discount cap, min_purchase and the
  // validity window.
  const computeProviderStoreDiscount = (base) => {
    const d = providerDetails?.discount;
    if (!d || !base) return 0;
    if (d?.end_date && d?.end_time) {
      const end = dayjs(`${d.end_date}T${d.end_time}`);
      if (end.isValid() && !end.isAfter(dayjs())) return 0;
    }
    if (Number(base) < (Number(d?.min_purchase) || 0)) return 0;
    const raw =
      d?.discount_type === "percent"
        ? (Number(base) * (Number(d?.discount) || 0)) / 100
        : Number(d?.discount) || 0;
    const max = Number(d?.max_discount) || 0;
    return Math.max(0, max > 0 ? Math.min(raw, max) : raw);
  };

  const itemLevelDiscount = Math.max(
    0,
    Number(originalSubtotal) - Number(subtotal),
  );
  const productDiscount = isCustomService
    ? 0
    : Math.max(
        itemLevelDiscount,
        computeProviderStoreDiscount(originalSubtotal),
      );

  // For custom service the billing base is the accepted bid price, not the cart
  const customOfferPrice = isCustomService
    ? Number(reqServiceDetails?.data?.selected_offer?.offer_price) || 0
    : 0;
  const effectiveSubtotal = isCustomService
    ? customOfferPrice
    : Math.max(0, Number(originalSubtotal) - productDiscount);

  const addonsAmount = 0;
  const deliveryFeeAmount = 0;
  const additionalChargeActive = configData?.additional_charge_status === 1;
  const additionalChargeName =
    configData?.additional_charge_name || "Additional Charge";
  const additionalChargeAmount = additionalChargeActive
    ? Number(configData?.additional_charge) || 0
    : 0;
  // Coupon amount computed directly (getCouponDiscount returns NaN for service
  // items). The coupon is already backend-validated, so we only need the
  // display amount: percent on the discounted base (`discountBase`, already net
  // of the product discount) capped at max_discount, or a flat amount, gated by
  // min_purchase against the gross item price (`grossBase`). Taking both bases
  // as args lets the series coupon use the SAME product discount the bill shows
  // — otherwise the per-occurrence and series discount priorities can differ
  // and the coupon subtracts a value the summary never displayed.
  const computeCoupon = (discountBase, grossBase) => {
    if (!couponDiscount || couponDiscount?.coupon_type === "free_delivery") {
      return 0;
    }
    if (isCustomService) {
      return (
        Number(
          getCouponDiscount(couponDiscount, providerDetails, displayCartList),
        ) || 0
      );
    }
    if (Number(grossBase) < (Number(couponDiscount?.min_purchase) || 0)) {
      return 0;
    }
    const max = Number(couponDiscount?.max_discount) || 0;
    const raw =
      couponDiscount?.discount_type === "percent"
        ? (Number(discountBase) * (Number(couponDiscount?.discount) || 0)) / 100
        : Number(couponDiscount?.discount) || 0;
    return Math.max(0, max > 0 ? Math.min(raw, max) : raw);
  };
  const couponAmount = computeCoupon(effectiveSubtotal, originalSubtotal);

  const proOrderDiscountPct = Number(proBenefit?.percentage) || 0;
  const proOrderDiscountMax = Number(proBenefit?.max_amount) || 0;
  const proMinOrderAmount = Number(proBenefit?.min_order_amount) || 0;
  // Pro discount base uses effectiveSubtotal so custom service offer_price is covered
  const proSubtotalForMinCheck = Math.max(0, effectiveSubtotal - couponAmount);
  const proMinSatisfied =
    proBenefit?.min_order_status !== 1 ||
    proSubtotalForMinCheck >= proMinOrderAmount;
  const proOrderDiscountActive =
    isProActive &&
    proBenefit?.type === "discount" &&
    proMinSatisfied &&
    proOrderDiscountPct > 0;
  const proDiscountAmount = (() => {
    if (!proOrderDiscountActive) return 0;
    const raw = (proSubtotalForMinCheck * proOrderDiscountPct) / 100;
    return proOrderDiscountMax > 0 ? Math.min(raw, proOrderDiscountMax) : raw;
  })();
  // Repeat bookings need their valid day count sent as repeat_count for correct tax.
  const prevTaxCartRef = useRef(null);
  const prevTaxCouponRef = useRef(null);
  const prevTaxBookingTypeRef = useRef(null);
  const prevTaxRepeatCountRef = useRef(null);
  useEffect(() => {
    if (isCustomService || !providerId) return;

    const repeatCountForTax =
      bookingType === "repeat" ? repeatDates?.length || 0 : 0;

    const cartChanged = prevTaxCartRef.current !== displayCartList;
    const couponChanged = prevTaxCouponRef.current !== couponDiscount;
    const bookingTypeChanged = prevTaxBookingTypeRef.current !== bookingType;
    const repeatCountChanged =
      prevTaxRepeatCountRef.current !== repeatCountForTax;
    if (
      !cartChanged &&
      !couponChanged &&
      !bookingTypeChanged &&
      !repeatCountChanged
    ) {
      return;
    }
    prevTaxCartRef.current = displayCartList;
    prevTaxCouponRef.current = couponDiscount;
    prevTaxBookingTypeRef.current = bookingType;
    prevTaxRepeatCountRef.current = repeatCountForTax;

    if (displayCartList.length === 0) return;

    taxMutate({
      provider_id: Number(providerId),
      repeat_count: repeatCountForTax,
      ...(isBuyNow && {
        buy_now: 1,
        is_campaign: isCampaignBuyNow ? 1 : 0,
        service_id: buyNowItem?.id,
        price: buildBuyNowPrice(buyNowItem, displayCartList),
        ...buildBuyNowQuantityFields(displayCartList),
      }),
      ...(couponInfo?.code && { coupon_code: couponInfo.code }),
      ...(!token &&
      typeof window !== "undefined" &&
      localStorage.getItem("guest_id")
        ? { guest_id: localStorage.getItem("guest_id") }
        : {}),
    });
  }, [displayCartList, couponDiscount, bookingType, repeatDates]);

  // Tax — custom service: call once with selected_bid_id when bid data is ready
  useEffect(() => {
    if (!isCustomService) return;
    const selectedBidId = reqServiceDetails?.data?.selected_offer?.id;
    if (!selectedBidId) return;
    taxMutate({ selected_bid_id: selectedBidId });
  }, [isCustomService, reqServiceDetails]);

  const taxAmount = Number(taxData?.tax_amount) || 0;
  const taxIncluded =
    taxData?.tax_included === true || taxData?.tax_status === "included";
  const firstOrderDiscount = Number(taxData?.first_order_discount) || 0;

  const totalAmount =
    effectiveSubtotal +
    addonsAmount +
    deliveryFeeAmount +
    additionalChargeAmount -
    couponAmount -
    proDiscountAmount -
    firstOrderDiscount +
    (taxIncluded ? 0 : taxAmount);

  // Capped discounts (provider, coupon, pro) apply once against the ×N series total, not per occurrence.
  const repeatCount = bookingType === "repeat" ? repeatDates?.length || 0 : 0;
  const isRepeatSeries = repeatCount > 1;
  const seriesMultiplier = isRepeatSeries ? repeatCount : 1;
  const [showSingleBooking, setShowSingleBooking] = useState(false);

  const seriesProductDiscount =
    !isRepeatSeries || isCustomService
      ? productDiscount
      : Math.max(
          itemLevelDiscount * repeatCount,
          computeProviderStoreDiscount(originalSubtotal * repeatCount),
        );

  const seriesEffectiveSubtotal = isCustomService
    ? effectiveSubtotal * seriesMultiplier
    : Math.max(0, originalSubtotal * seriesMultiplier - seriesProductDiscount);

  // Coupon on the whole series: computed on seriesEffectiveSubtotal (which nets
  // out the SAME product discount the bill displays) and capped once — not by
  // scaling the single-occurrence coupon, which would net out a different
  // per-occurrence discount and mismatch the summary.
  const seriesCouponAmount = !isRepeatSeries
    ? couponAmount
    : computeCoupon(seriesEffectiveSubtotal, originalSubtotal * seriesMultiplier);

  const seriesProBase = Math.max(
    0,
    seriesEffectiveSubtotal - seriesCouponAmount,
  );
  const seriesProMinSatisfied =
    proBenefit?.min_order_status !== 1 || seriesProBase >= proMinOrderAmount;
  const seriesProActive =
    isProActive &&
    proBenefit?.type === "discount" &&
    seriesProMinSatisfied &&
    proOrderDiscountPct > 0;
  const seriesProDiscount = !isRepeatSeries
    ? proDiscountAmount
    : seriesProActive
    ? (() => {
        const raw = (seriesProBase * proOrderDiscountPct) / 100;
        return proOrderDiscountMax > 0 ? Math.min(raw, proOrderDiscountMax) : raw;
      })()
    : 0;

  const seriesAdditionalCharge = additionalChargeAmount * seriesMultiplier;
  // taxAmount already covers the full series — backend computes it from repeat_count.
  const seriesTax = taxAmount;

  const seriesTotal =
    seriesEffectiveSubtotal +
    seriesAdditionalCharge -
    seriesCouponAmount -
    seriesProDiscount -
    firstOrderDiscount +
    (taxIncluded ? 0 : seriesTax);

  // Amount the customer commits to (series for repeat, single otherwise) —
  // drives payment / cashback / persisted total regardless of the view toggle.
  const grandTotal = isRepeatSeries ? seriesTotal : totalAmount;

  // Row display values: default shows the whole series, the toggle divides back
  // to one occurrence. Capped discounts divide the series figure (they don't
  // scale linearly); everything else multiplies the single figure.
  const rowDivisor = isRepeatSeries && showSingleBooking ? repeatCount : 1;
  const dItemPrice =
    ((originalSubtotal || subtotal) * seriesMultiplier) / rowDivisor;
  const dDiscount = seriesProductDiscount / rowDivisor;
  const dCoupon = seriesCouponAmount / rowDivisor;
  const dAdditional = seriesAdditionalCharge / rowDivisor;
  const dPro = seriesProDiscount / rowDivisor;
  const dFirstOrder = firstOrderDiscount / rowDivisor;
  const dTax = seriesTax / rowDivisor;
  const dTotal = grandTotal / rowDivisor;
  const dOriginalTotal = (originalSubtotal * seriesMultiplier) / rowDivisor;

  // Notify parent so AddPaymentMethod shows the correct "Total Bill"
  useEffect(() => {
    onTotalAmountChange?.(grandTotal);
  }, [grandTotal]);

  const [cashbackAmount, setCashbackAmount] = useState(null);
  const { refetch: refetchCashbackAmount } = useGetCashBackAmount({
    amount: grandTotal,
    handleSuccess: setCashbackAmount,
  });
  useEffect(() => {
    if (token && grandTotal > 0) {
      refetchCashbackAmount();
    }
  }, [grandTotal, token]);

  const cashbackText = (() => {
    if (!(token && cashbackAmount?.cashback_amount > 0)) return "";
    const value =
      cashbackAmount?.cashback_type === "percentage"
        ? `${cashbackAmount?.cashback_amount}%`
        : getAmountWithSign(cashbackAmount?.cashback_amount);
    const maxPart =
      cashbackAmount?.cashback_type === "percentage"
        ? ` ${t("However, the maximum cashback amount is")} ${getAmountWithSign(
            cashbackAmount?.max_discount,
          )}.`
        : "";
    return `${t(
      "After completing the order, you will receive a",
    )} ${value} ${t(
      "cashback. The minimum purchase required to avail this offer is",
    )} ${getAmountWithSign(cashbackAmount?.min_purchase)}.${maxPart}`;
  })();

  const showOriginalTotal =
    !isCustomService &&
    originalSubtotal &&
    Number(dOriginalTotal) > Number(dTotal);

  const handleConfirmBooking = () => {
    if (!isCheckoutReady) return;

    // Second gate — mirrors the check on the provider page's "Checkout"
    // button (useStoreCartData.js). Re-checked here since a guest could
    // reach this page directly (e.g. Buy Now) without passing through that
    // button at all.
    if (!token && configData?.guest_checkout_status !== 1) {
      dispatch(setOpenSignInModal(true));
      return;
    }

    const validation = validateBookingForm({
      isBuyNow,
      buyNowItem,
      isCampaignBuyNow,
      isCustomService,
      reqServiceDetails,
      providerId,
      address,
      providerData,
      bookingType,
      scheduledAt,
      repeatDates,
      checkLeadTime,
      getLeadTimeErrorMessage,
      token,
      guestUserInfo,
      profileInfo,
      paymentMethod,
      createAccountChecked: check,
      formik,
      offlineMethod,
    });
    if (!validation.valid) {
      toast.error(
        t(validation.message),
        validation.toastId ? { id: validation.toastId } : undefined,
      );
      // Password fields only show their red error state once Formik marks
      // them touched (normally on blur) — force that here so the failure
      // is visible on the form, not just the toast.
      if (
        validation.toastId === "create-account-password" ||
        validation.toastId === "create-account-confirm-password"
      ) {
        formik?.setTouched({ password: true, confirm_password: true });
      }
      return;
    }

    const guestId =
      typeof window !== "undefined" ? localStorage.getItem("guest_id") : null;
    const isRepeat = bookingType === "repeat";
    const normalizedPaymentMethod = normalizePaymentMethod(
      paymentMethod,
      isRepeat,
    );
    // Digital (full or wallet-partial) routes through the gateway; the wallet
    // split is carried by the separate partial_payment flag in the payload.
    const isGatewayPayment = normalizedPaymentMethod === "digital_payment";

    const moduleParam = router?.query?.module;
    const moduleId = getCurrentModuleId();

    const navigateToOrders = (bookingId) => {
      if (!token) {
        router.push({
          pathname: "/home",
          query: {
            ...(moduleId != null && { module: moduleId }),
          },
        });
        return;
      }
      router.push({
        pathname: "/profile",
        query: {
          page: "my-orders",
          ...(bookingId && { orderId: bookingId }),
          ...(moduleId != null && { orderTabModule: moduleId }),
          ...(moduleParam && { module: moduleParam }),
        },
      });
    };

    const sharedPayloadParams = {
      serviceLocation,
      providerDetails,
      address,
      isRepeat,
      multiBookingType,
      repeatDates,
      scheduledAt,
      normalizedPaymentMethod,
      usePartialPayment,
      bookingType,
      couponCode: couponInfo?.code,
      token,
      guestId,
      guestUserInfo,
      profileInfo,
      check,
      formik,
      offlineMethod,
    };

    const payload = isCustomService
      ? buildCustomServicePayload({
          reqServiceDetails,
          address,
          normalizedPaymentMethod,
          offlineMethod,
        })
      : isBuyNow
      ? buildBuyNowServicePayload({
          ...sharedPayloadParams,
          buyNowItem,
          isCampaignBuyNow,
          displayCartList,
        })
      : buildNormalServicePayload({ ...sharedPayloadParams, providerId });

    placeBooking(payload, {
      onSuccess: (res) => {
        const bookingId = res?.data?.booking_id ?? res?.booking_id;
        const totalBookings = res?.data?.total_bookings;

        if (!token) {
          dispatch(setGuestUserOrderId(bookingId));
          dispatch(
            setOrderInformation({
              ...res?.data,
              phone: formatPhoneNumber(
                `${guestUserInfo?.contact_person_number}`,
              ),
            }),
          );
          dispatch(setOrderDetailsModalOpen(true));
          dispatch(setGuestUserInfo(null));
        }

        // wallet / cash_after_service → backend notifies provider immediately
        if (
          normalizedPaymentMethod === "wallet" ||
          normalizedPaymentMethod === "cash_after_service"
        ) {
          toast.success(
            isRepeat && totalBookings > 1
              ? `${totalBookings} ${t("bookings placed successfully")}`
              : t("Booking placed successfully"),
          );
          // Mirrors the general checkout flow — TopDetails.js (shared by
          // order-details and booking-details) opens its success modal off
          // this flag once the destination page mounts.
          dispatch(setOrderDetailsModal(true));
          navigateToOrders(bookingId);
          return;
        }

        if (!bookingId) {
          navigateToOrders();
          return;
        }

        if (normalizedPaymentMethod === "offline_payment") {
          onOfflineBookingPlaced?.(bookingId);
          return;
        }

        if (isGatewayPayment) {
          const callbackUrl = (() => {
            if (typeof window === "undefined") return "";
            if (!token) return `${window.location.origin}/home`;
            const params = new URLSearchParams({ page: "my-orders" });
            if (bookingId) params.set("orderId", bookingId);
            if (moduleId != null) params.set("orderTabModule", moduleId);
            if (moduleParam) params.set("module", moduleParam);
            return `${window.location.origin}/profile?${params.toString()}`;
          })();

          dispatch(setOrderDetailsModal(true));
          payBooking(
            {
              booking_id: bookingId,
              payment_method: normalizedPaymentMethod,
              payment_gateway: paymentMethod,
              payment_platform: "web",
              callback: callbackUrl,
              ...(!token && guestId ? { guest_id: guestId } : {}),
            },
            {
              onSuccess: (payRes) => {
                const redirectLink =
                  payRes?.data?.redirect_link ?? payRes?.redirect_link;
                if (redirectLink) {
                  if (typeof window !== "undefined") {
                    localStorage.setItem("totalAmount", grandTotal);
                  }
                  Router.push(redirectLink);
                } else {
                  navigateToOrders(bookingId);
                }
              },
            },
          );
        }
      },
    });
  };

  return (
    <>
      <SidebarSurface>
        {/* Fixed header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            padding: { xs: "12px 16px 16px", sm: "16px 20px 20px" },
            flexShrink: 0,
          }}
        >
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: 700,
              color: theme.palette.text.primary,
            }}
          >
            {t("Billing")}
          </Typography>
        </Stack>

        {/* Scrollable body */}
        <SimpleBar
          scrollableNodeRef={scrollableRef}
          style={{ flex: 1, minHeight: 0, width: "100%" }}
        >
          {!isCheckoutReady ? (
            <BillingShimmer />
          ) : (
            <>
          {isCustomService ? (
            <CustomServiceInfo
              service={{
                image:
                  reqServiceDetails?.data?.category?.image_full_url ?? null,
                category: reqServiceDetails?.data?.category?.name ?? "",
                sub_category: reqServiceDetails?.data?.sub_category?.name ?? "",
                service_date: reqServiceDetails?.data?.booking_date
                  ? dayjs(reqServiceDetails.data.booking_date).format(
                      "D MMM YYYY",
                    )
                  : "",
                service_time: reqServiceDetails?.data?.booking_time
                  ? dayjs(
                      reqServiceDetails.data.booking_time,
                      "HH:mm:ss",
                    ).format("hh:mm A")
                  : "",
                description: reqServiceDetails?.data?.description ?? "",
              }}
            />
          ) : (
            displayCartList.map((item) => (
              <CartItemRow key={item?.cartItemId || item?.id} cartItem={item} />
            ))
          )}

          <Stack
            ref={priceSectionRef}
            sx={{
              borderTop: `1px solid ${theme.palette.divider}`,
              padding: "24px 20px 0",
              mb: 3,
            }}
            spacing={0.75}
          >
            {isRepeatSeries && (
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                gap={1}
                sx={{
                  mb: 0.5,
                  pb: 1,
                  borderBottom: `1px dashed ${theme.palette.divider}`,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: theme.palette.text.secondary,
                  }}
                >
                  {showSingleBooking
                    ? t("Per booking")
                    : `${t("Total for")} ${repeatCount} ${t("bookings")}`}
                </Typography>
                <Typography
                  onClick={() => setShowSingleBooking((v) => !v)}
                  sx={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: theme.palette.primary.main,
                    cursor: "pointer",
                    userSelect: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  {showSingleBooking
                    ? t("View total")
                    : t("View single booking")}
                </Typography>
              </Stack>
            )}
            {(isCustomService
              ? [
                  {
                    label: "Bidding Price",
                    value: getAmountWithSign(effectiveSubtotal),
                    negative: false,
                  },
                  ...(couponAmount > 0
                    ? [
                        {
                          label: "Coupon",
                          value: getAmountWithSign(couponAmount),
                          negative: true,
                        },
                      ]
                    : []),
                  ...(proOrderDiscountActive && proDiscountAmount > 0
                    ? [
                        {
                          label: "Pro Discount",
                          value: getAmountWithSign(proDiscountAmount),
                          negative: true,
                        },
                      ]
                    : []),
                  ...(firstOrderDiscount > 0
                    ? [
                        {
                          label: "First Order Discount",
                          value: getAmountWithSign(firstOrderDiscount),
                          negative: true,
                        },
                      ]
                    : []),
                  ...(taxAmount > 0
                    ? [
                        {
                          label: taxIncluded ? "Tax (Included)" : "Tax",
                          value: getAmountWithSign(taxAmount),
                          negative: false,
                        },
                      ]
                    : []),
                  ...(additionalChargeActive
                    ? [
                        {
                          label: additionalChargeName,
                          value: getAmountWithSign(additionalChargeAmount),
                          negative: false,
                        },
                      ]
                    : []),
                ]
              : [
                  {
                    label: "Item Price",
                    value: getAmountWithSign(dItemPrice),
                    negative: false,
                  },
                  {
                    label: "Discount",
                    value: getAmountWithSign(dDiscount),
                    negative: true,
                  },
                  ...(dCoupon > 0
                    ? [
                        {
                          label: "Coupon",
                          value: getAmountWithSign(dCoupon),
                          negative: true,
                        },
                      ]
                    : []),
                  ...(dPro > 0
                    ? [
                        {
                          label: "Pro Discount",
                          value: getAmountWithSign(dPro),
                          negative: true,
                        },
                      ]
                    : []),
                  ...(firstOrderDiscount > 0
                    ? [
                        {
                          label: "First Order Discount",
                          value: getAmountWithSign(dFirstOrder),
                          negative: true,
                        },
                      ]
                    : []),
                  ...(taxAmount > 0
                    ? [
                        {
                          label: taxIncluded ? "Tax (Included)" : "Tax",
                          value: getAmountWithSign(dTax),
                          negative: false,
                        },
                      ]
                    : []),
                  ...(additionalChargeActive
                    ? [
                        {
                          label: additionalChargeName,
                          value: getAmountWithSign(dAdditional),
                          negative: false,
                        },
                      ]
                    : []),
                ]
            ).map(({ label, value, negative }) => (
              <Stack
                key={label}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography
                  sx={{ fontSize: "14px", color: theme.palette.text.secondary }}
                >
                  {t(label)}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: theme.palette.text.primary,
                  }}
                >
                  {negative ? `– ${value}` : value}
                </Typography>
              </Stack>
            ))}
          </Stack>

          {cashbackText && (
            <Box
              sx={{
                mx: "20px",
                mb: 3,
                borderRadius: "5px",
                borderLeft: `2px solid ${theme.palette.primary.main}`,
                backgroundColor: alpha(theme.palette.primary.main, 0.06),
                padding: "0.4rem 0.7rem",
              }}
            >
              <Typography
                sx={{
                  fontSize: "12px",
                  lineHeight: 1.6,
                  color: theme.palette.text.primary,
                }}
              >
                {cashbackText}
              </Typography>
            </Box>
          )}

          <PolicyBox
            sx={{ display: { xs: "none", md: "block" }, mb: 3, mx: "20px" }}
          />
            </>
          )}
        </SimpleBar>

        {/* Fixed footer — subtotal + confirm */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          gap={1}
          sx={{
            flexShrink: 0,
            padding: "16px 20px",
            borderTop: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
            position: { xs: "fixed", md: "relative" },
            bottom: { xs: 0, md: "auto" },
            left: { xs: 0, md: "auto" },
            right: { xs: 0, md: "auto" },
            zIndex: { xs: theme.zIndex.appBar + 1, md: "auto" },
            width: { xs: "100%", md: "auto" },
            boxShadow: {
              xs: `0px -2px 12px ${alpha(theme.palette.text.primary, 0.08)}`,
              md: "none",
            },
          }}
        >
          <Stack direction="column" spacing={0.25}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.5}
              sx={{ cursor: isMobile || isScrollable ? "pointer" : "default" }}
              onClick={
                isMobile || isScrollable ? handleScrollToggle : undefined
              }
            >
              <Typography
                sx={{
                  fontSize: { xs: "12px", sm: "14px" },
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                }}
              >
                {t("Subtotal")}
              </Typography>
              {(isMobile || isScrollable) && (
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    backgroundColor: theme.palette.background.secondary,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <KeyboardArrowDownIcon
                    sx={{
                      fontSize: 16,
                      color: theme.palette.text.secondary,
                      transform: isAtTop ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 250ms ease",
                    }}
                  />
                </Box>
              )}
            </Stack>
            <Stack direction="row" alignItems="baseline" spacing={0.75}>
              {!isCheckoutReady ? (
                <Skeleton variant="text" width={90} height={28} />
              ) : (
                <Typography
                  sx={{
                    fontSize: { xs: "16px", sm: "18px" },
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                  }}
                >
                  {getAmountWithSign(dTotal)}
                </Typography>
              )}
              {isCheckoutReady && showOriginalTotal ? (
                <Typography
                  sx={{
                    fontSize: { xs: "12px", sm: "14px" },
                    color: theme.palette.text.disabled,
                    textDecoration: "line-through",
                  }}
                >
                  {getAmountWithSign(dOriginalTotal)}
                </Typography>
              ) : null}
            </Stack>
          </Stack>

          <PrimaryButton
            onClick={handleConfirmBooking}
            variant="contained"
            width="auto"
            borderRadius="10px"
            disabled={isPlacing || isPaying || !isCheckoutReady}
            startIcon={
              !isCheckoutReady ? (
                <CircularProgress size={16} color="inherit" />
              ) : undefined
            }
          >
            {!isCheckoutReady
              ? t("Loading...")
              : isPlacing
              ? t("Placing...")
              : isPaying
              ? t("Processing...")
              : t("Confirm Booking")}
          </PrimaryButton>
        </Stack>
      </SidebarSurface>
      <PolicyBox sx={{ display: { xs: "block", md: "none" }, mt: 2 }} />
    </>
  );
};

export default CheckoutBillingDetails;
