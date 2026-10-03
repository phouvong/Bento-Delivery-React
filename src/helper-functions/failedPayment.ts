/**
 * `customer/order/payment-failed` serves every module from one endpoint, but
 * the payload it returns is shaped per module. Verified live:
 *
 *   mart / parcel      order_id, order_amount, order_type, prescription_order
 *   rental             type: "rental", trip_id, trip_amount, trip_type, trip_status
 *
 * Both carry `cash_on_delivery`, `digital_payment`, `offline_payment`,
 * `maximum_cod_order_amount`, `partially_paid_amount`, `zone_id`, `module_type`.
 *
 * Reading `order_id` straight off a rental payload yields undefined, which is
 * how the incomplete-order modal ended up rendering "N/A / N/A" with both
 * actions refusing to run. Everything downstream goes through this instead.
 *
 * The endpoint also answers `null` (no incomplete order) and has historically
 * returned an array, which callers already guarded for — both collapse to null.
 */

export interface ResolvedFailedPayment {
  /** `order_id` for mart/parcel, `trip_id` for rental. */
  id: number | string;
  /** `order_amount` / `trip_amount`, before subtracting any partial payment. */
  amount: number;
  /** Amount still owed once a partial payment is taken off. */
  dueAmount: number;
  orderType?: string;
  moduleType?: string;
  isRental: boolean;
  isParcel: boolean;
  prescriptionOrder: boolean;
  partiallyPaidAmount: number;
  maximumCodAmount: number;
  zoneId?: number | string;
  cashOnDelivery: boolean;
  digitalPayment: boolean;
  offlinePayment: boolean;
  /** The untouched payload, for anything not normalised here. */
  raw: any;
}

export const resolveFailedPayment = (
  payload: any
): ResolvedFailedPayment | null => {
  const raw = Array.isArray(payload) ? payload[0] : payload;
  if (!raw || typeof raw !== "object") return null;

  const id = raw?.order_id ?? raw?.trip_id;
  if (id === undefined || id === null) return null;

  const moduleType = raw?.module_type ?? raw?.module?.module_type ?? raw?.type;
  const amount = Number(raw?.order_amount ?? raw?.trip_amount) || 0;
  const partiallyPaidAmount = Number(raw?.partially_paid_amount) || 0;

  return {
    id,
    amount,
    dueAmount: partiallyPaidAmount > 0 ? amount - partiallyPaidAmount : amount,
    orderType: raw?.order_type ?? raw?.trip_type,
    moduleType,
    isRental: moduleType === "rental" || raw?.type === "rental",
    isParcel: moduleType === "parcel" || raw?.type === "parcel",
    prescriptionOrder: raw?.prescription_order === true,
    partiallyPaidAmount,
    maximumCodAmount: Number(raw?.maximum_cod_order_amount) || 0,
    zoneId: raw?.zone_id,
    cashOnDelivery: raw?.cash_on_delivery === true,
    digitalPayment: raw?.digital_payment === true,
    offlinePayment: raw?.offline_payment === true,
    raw,
  };
};
