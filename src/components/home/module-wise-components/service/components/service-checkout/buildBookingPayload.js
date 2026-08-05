import dayjs from "dayjs";
import { getDiscountedAmount } from "helper-functions/CardHelpers";
import { resolveContactPerson } from "./get-service-at/resolveContactPerson";

export const normalizePaymentMethod = (paymentMethod, isRepeat) => {
  // Repeat bookings only accept cash_after_service — force it regardless of selection.
  if (isRepeat) return "cash_after_service";
  // cash_on_delivery from the shared payment component maps to cash_after_service for service module
  if (
    paymentMethod === "cash_on_delivery" ||
    paymentMethod === "cash_after_service"
  ) {
    return "cash_after_service";
  }
  if (
    paymentMethod === "wallet" ||
    paymentMethod === "offline_payment" ||
    paymentMethod === ""
  ) {
    return paymentMethod;
  }
  // Always the real remainder method — the wallet split is signalled by the
  // separate `partial_payment` flag, so digital stays "digital_payment" whether
  // or not it's partial (consistent with the cash_after_service case).
  return "digital_payment";
};

export const buildCustomServicePayload = ({
  reqServiceDetails,
  address,
  normalizedPaymentMethod,
  offlineMethod,
}) => {
  const { booking_date, booking_time } = reqServiceDetails?.data ?? {};
  const scheduleAt =
    booking_date && booking_time
      ? dayjs(`${booking_date} ${booking_time}`, "YYYY-MM-DD HH:mm:ss").format(
          "YYYY-MM-DD HH:mm:ss",
        )
      : null;

  return {
    selected_bid_id: reqServiceDetails?.data?.selected_offer?.id,
    service_location: {
      get_service_at: "user",
      address: address?.address ?? "",
      lat: address?.lat ?? address?.latitude,
      lng: address?.lng ?? address?.longitude,
    },
    scheduled: 1,
    schedule_at: scheduleAt,
    payment_method: normalizedPaymentMethod,
    ...(normalizedPaymentMethod === "offline_payment" &&
      offlineMethod?.id && { method_id: offlineMethod.id }),
  };
};

const buildSharedServicePayload = (params) => {
  const {
    serviceLocation,
    providerDetails,
    address,
    isRepeat,
    multiBookingType,
    repeatDates,
    scheduledAt,
    normalizedPaymentMethod,
    bookingType,
    couponCode,
    token,
    guestId,
    guestUserInfo,
    profileInfo,
    check,
    formik,
    usePartialPayment,
    offlineMethod,
  } = params;

  const isProviderLocation = serviceLocation === "provider_location";
  const contactPerson = resolveContactPerson({
    address,
    guestUserInfo,
    profileInfo,
    token,
  });

  // Partial (combined) payment: the backend expects payment_method to be the
  // literal "partial_payment" and a separate partial_payment_method naming the
  // remainder ("cash_after_service" | "digital_payment"). normalizedPaymentMethod
  // already holds that real remainder method.
  const isPartial =
    usePartialPayment &&
    (normalizedPaymentMethod === "cash_after_service" ||
      normalizedPaymentMethod === "digital_payment");

  return {
    service_location: isProviderLocation
      ? {
          get_service_at: "provider",
          address: providerDetails?.address ?? "",
          lat: providerDetails?.latitude ?? providerDetails?.lat ?? "",
          lng: providerDetails?.longitude ?? providerDetails?.lng ?? "",
        }
      : {
          get_service_at: "user",
          address: address?.address ?? "",
          lat: address?.lat ?? address?.latitude,
          lng: address?.lng ?? address?.longitude,
        },
    ...(isRepeat
      ? {
          multi_booking_type: multiBookingType,
          dates: JSON.stringify(repeatDates),
        }
      : {
          scheduled: scheduledAt ? 1 : 0,
          ...(scheduledAt && {
            schedule_at: dayjs(scheduledAt.timestamp).format(
              "YYYY-MM-DD HH:mm:ss",
            ),
          }),
        }),
    payment_method: isPartial ? "partial_payment" : normalizedPaymentMethod,
    // For a partial booking the remainder method must be named explicitly —
    // otherwise the backend auto-picks digital and a wallet + cash split is lost.
    ...(isPartial && { partial_payment_method: normalizedPaymentMethod }),
    ...(normalizedPaymentMethod === "offline_payment" &&
      offlineMethod?.id && { method_id: offlineMethod.id }),
    booking_type: bookingType,
    ...(couponCode && { coupon_code: couponCode }),
    ...(!token && guestId && { guest_id: guestId }),
    // "Create account with existing info" — guest checkout only (the
    // checkbox never renders for logged-in users, so `check` stays false).
    create_new_user: check ? 1 : 0,
    ...(check && { password: formik?.values?.password }),

    contact_person_name: contactPerson.name,
    contact_person_number: contactPerson.number,
    contact_person_email: contactPerson.email,
  };
};

export const buildNormalServicePayload = (params) => ({
  provider_id: Number(params.providerId),
  ...buildSharedServicePayload(params),
});

// displayCartList holds one row per selected variation. booking/place and
// booking/get-tax both want the same single-service "variants" array the
// add-to-cart flow sends, not a per-row quantity.
export const buildBuyNowVariants = (displayCartList) =>
  (displayCartList ?? [])
    .filter((item) => item?.selectedOption?.name)
    .map((item) => ({
      variant_key:
        item.selectedOption?.variant_key ?? item.selectedOption?.name,
      quantity: item.quantity,
    }));

export const buildBuyNowQuantityFields = (displayCartList) => {
  const variation = buildBuyNowVariants(displayCartList);
  return variation.length
    ? { variation }
    : { quantity: displayCartList?.[0]?.quantity ?? 1 };
};

// Final payable amount (post-discount), mirroring the add-to-cart price
// calculation (see getItemObject/handleChoices in ServiceInformation.jsx):
// no variation → discounted unit price * qty; with variation → each
// selected variation's own discounted price * its own qty, summed across rows.
export const buildBuyNowPrice = (buyNowItem, displayCartList) => {
  const hasVariation = (displayCartList ?? []).some(
    (item) => item?.selectedOption?.name,
  );
  if (hasVariation) {
    return (displayCartList ?? []).reduce((sum, item) => {
      const variation = item?.selectedOption;
      const unitPrice = variation?.price ?? item?.price ?? 0;
      const discountedUnitPrice = getDiscountedAmount(
        unitPrice,
        variation?.discount,
        variation?.discount_type,
      );
      return sum + discountedUnitPrice * (item?.quantity ?? 1);
    }, 0);
  }
  const unitPrice = buyNowItem?.price ?? buyNowItem?.totalPrice ?? 0;
  const discountedUnitPrice = getDiscountedAmount(
    unitPrice,
    buyNowItem?.discount,
    buyNowItem?.discount_type,
  );
  return discountedUnitPrice * (buyNowItem?.quantity ?? 1);
};

export const buildBuyNowServicePayload = (params) => {
  const { buyNowItem, isCampaignBuyNow, displayCartList } = params;

  return {
    buy_now: 1,
    is_campaign: isCampaignBuyNow ? 1 : 0,
    service_id: buyNowItem?.id,
    price: buildBuyNowPrice(buyNowItem, displayCartList),
    ...buildBuyNowQuantityFields(displayCartList),
    ...buildSharedServicePayload(params),
  };
};
