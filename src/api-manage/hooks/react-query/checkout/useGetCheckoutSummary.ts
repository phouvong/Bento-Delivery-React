import { useQuery } from "react-query";
import MainApi from "api-manage/MainApi";
import { checkout_summary_api } from "api-manage/ApiRoutes";
import { getApiContent } from "api-manage/getApiContent";
import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { getGuestId, getToken } from "helper-functions/getToken";

/**
 * `customer/order/checkout-summary` — one call for the whole price breakdown.
 *
 * The server runs a fixed sequence (rate → base → parcel tiers → clamp → surge
 * → free-delivery → Pro → express) and the order is not negotiable: a client
 * that recomputes in a different order quotes a different price from the one
 * the customer is charged. So nothing here recalculates — every number is read
 * back from the response.
 *
 * Verified against the live API: a parcel priced at 60 with no weight/dimension
 * bracket came back at 210 once brackets were attached, while the old
 * client-side maths still quoted the category's flat charge alone.
 *
 * Single-store by design (`store_id` is required unless the order is a parcel),
 * so a multi-store checkout calls it once per store and sums.
 */

export interface CheckoutSummaryDelivery {
  /** What the customer pays for delivery — after free-delivery and Pro. */
  delivery_charge: number;
  delivery_charge_before_pro_discount: number;
  /** Base + surge, before free-delivery and Pro. */
  original_delivery_charge: number;
  /** The "before" figure — strike this through when free delivery applies. */
  base_delivery_charge: number;
  /** Floor a saver-tier reduce_charge can't push the fee below. */
  min_delivery_charge: number | null;
  surge_amount: number;
  free_delivery_by: "admin" | "vendor" | "coupon" | null;
  pro_customer_savings: number;
  /** Dispatch routing only. Never a price. */
  vehicle_id: number | null;
}

export interface CheckoutSummaryTax {
  tax_amount: number;
  tax_status?: string;
  tax_included?: number;
  total_price?: number;
  pro_discount?: number;
  store_discount_amount?: number;
  discount_source?: string | null;
  ref_bonus_amount?: number;
}

export interface CheckoutSummaryPro {
  status: boolean;
  type: string;
  discount: number;
  delivery_savings: number;
  total_savings: number;
}

export interface CheckoutSummaryCashback {
  calculated_amount: number;
  cashback_amount: number;
  cashback_type: string;
  min_purchase: number;
  max_discount: number;
  id: number | null;
}

export interface CheckoutSummaryDeliveryOption {
  id: number;
  delivery_type: "standard" | "express" | "slightly_delay";
  delivery_type_text: string;
  extra_charge: number;
  reduce_charge: number;
  add_delivery_time: number;
  reduce_delivery_time: number;
  /** Ready-formatted range, e.g. "20 min - 1 hour". */
  time_range: string;
}

export interface CheckoutSummaryContent {
  tax?: CheckoutSummaryTax;
  delivery?: CheckoutSummaryDelivery;
  /**
   * Null on every response observed so far. When a surge is live the existing
   * screens read `price`, `price_type`, `customer_note` and
   * `customer_note_status` off it, so it is passed through untouched rather
   * than normalised into a shape that has not been seen.
   */
  surge?: Record<string, unknown> | null;
  pro?: CheckoutSummaryPro;
  cashback?: CheckoutSummaryCashback;
  delivery_options?: CheckoutSummaryDeliveryOption[];
}

export interface CheckoutSummaryParams {
  orderType: "delivery" | "take_away" | "parcel";
  /** Required unless the order is a parcel. */
  storeId?: number | string;
  orderAmount?: number;
  /** Kilometres, always — the server converts to the rate's unit. */
  distance?: number;
  latitude?: number | string;
  longitude?: number | string;
  deliveryType?: "standard" | "express" | "slightly_delay";
  scheduleAt?: string;
  couponCode?: string;
  /** Required when the zone prices by area or ZIP. */
  areaId?: number;
  zipCodeId?: number;
  // Parcel-only.
  parcelCategoryId?: number | string;
  receiverDetails?: string;
  weightId?: number | null;
  dimensionId?: number | null;
}

const isFilled = (value: unknown) =>
  value !== undefined && value !== null && value !== "";

/**
 * Only send what is actually set. `latitude`/`longitude` have no `numeric`
 * rule, so a stringified `undefined` sails past validation and blows up in the
 * server's spatial layer with a 500 — hence the coercion and the guard.
 */
export const buildCheckoutSummaryPayload = (params: CheckoutSummaryParams) => {
  const latitude = Number(params?.latitude);
  const longitude = Number(params?.longitude);
  const payload: Record<string, unknown> = {
    order_type: params?.orderType,
    guest_id: getToken() ? null : getGuestId(),
  };

  const optional: Record<string, unknown> = {
    store_id: params?.storeId,
    order_amount: params?.orderAmount,
    distance: params?.distance,
    latitude: Number.isFinite(latitude) ? latitude : undefined,
    longitude: Number.isFinite(longitude) ? longitude : undefined,
    delivery_type: params?.deliveryType,
    schedule_at: params?.scheduleAt,
    coupon_code: params?.couponCode,
    area_id: params?.areaId,
    zip_code_id: params?.zipCodeId,
    parcel_category_id: params?.parcelCategoryId,
    receiver_details: params?.receiverDetails,
    weight_id: params?.weightId,
    dimension_id: params?.dimensionId,
  };
  Object.entries(optional).forEach(([key, value]) => {
    if (isFilled(value)) payload[key] = value;
  });
  return payload;
};

/**
 * True when the request carries enough for the server to price it. Below this
 * the call would only 422, so the query stays idle and the screen keeps
 * showing its loading state.
 */
export const canQuoteCheckoutSummary = (params?: CheckoutSummaryParams) => {
  if (!params?.orderType) return false;
  if (params.orderType !== "parcel" && !isFilled(params.storeId)) return false;
  if (params.orderType === "parcel" && !isFilled(params.receiverDetails))
    return false;
  if (params.orderType === "take_away") return true;
  return (
    Number.isFinite(Number(params.latitude)) &&
    Number.isFinite(Number(params.longitude)) &&
    isFilled(params.distance)
  );
};

const getCheckoutSummary = async (params: CheckoutSummaryParams) => {
  const payload = buildCheckoutSummaryPayload(params);
  // DIAGNOSTIC: confirms in the console that a re-quote actually fired and with
  // which area/zip. Remove once the fee is confirmed to move on selection.
  // eslint-disable-next-line no-console
  try {
    const { data } = await MainApi.post(checkout_summary_api, payload);
    // eslint-disable-next-line no-console
    return getApiContent<CheckoutSummaryContent>(data);
  } catch (error: any) {
    // eslint-disable-next-line no-console
    throw error;
  }
};

/**
 * True once the server has refused to quote — e.g. an area/zip the zone no
 * longer covers answers 403 "The selected option is not available in this
 * zone." Consumers read `0` out of the missing payload, so without this the
 * checkout would show a free delivery and happily place the order at a fee the
 * server never agreed to.
 */
export const isQuoteUnavailable = (query: {
  isError?: boolean;
  data?: CheckoutSummaryContent;
}) => Boolean(query?.isError) || (!!query?.data && !query?.data?.delivery);

export default function useGetCheckoutSummary(
  params: CheckoutSummaryParams,
  options: { enabled?: boolean } = {},
) {
  const quotable = canQuoteCheckoutSummary(params);
  return useQuery(
    ["checkout-summary", buildCheckoutSummaryPayload(params)],
    () => getCheckoutSummary(params),
    {
      enabled: quotable && options?.enabled !== false,
      // Avoids a delivery-fee flash on every param change; placement is
      // still gated on isError via isQuoteUnavailable, not on `data`.
      keepPreviousData: true,
      onError: onSingleErrorResponse,
    },
  );
}
