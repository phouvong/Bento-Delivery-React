/**
 * The delivery ETA as the server computes it, on `customer/order/track` only —
 * `customer/order/details` carries no `eta`, so read it off the track payload.
 *
 *   eta: {
 *     min, max, unit,                     // 0, 5, "min"
 *     text,                               // "Eta any minute now" — localised
 *     overdue,                            // past the window
 *     from, to, window,                   // "03:12 PM", "03:17 PM", "03:12 PM - 03:17 PM"
 *     from_at, to_at, timezone,           // absolute, in the store's timezone
 *     stage                               // "before_processing"
 *   }
 *
 * `text` and `window` arrive already localised and formatted in the store's
 * timezone — which is often not the viewer's — so they are rendered verbatim
 * rather than reformatted client-side. The window moves as the order ages, so
 * it re-reads on every track refetch.
 */

export interface OrderEta {
  min?: number;
  max?: number;
  unit?: string;
  text?: string;
  overdue?: boolean;
  from?: string;
  to?: string;
  window?: string;
  from_at?: string;
  to_at?: string;
  timezone?: string;
  stage?: string;
}

export interface ResolvedOrderEta {
  /** The headline phrase — self-describing, so it needs no "Estimated delivery:" label. */
  label: string;
  /** "03:12 PM - 03:17 PM", for the supporting line. Empty when the server sent
   *  none, or when the range is inverted (end before start). */
  window: string;
  /** The window ends on a later calendar day than it starts — label it so it
   *  does not read as reversed. */
  spansDays: boolean;
  /** The `from_at`/`to_at` calendar dates, formatted in the store's timezone —
   *  e.g. "Sep 23, 2026" / "Sep 27, 2026". Always shown alongside the window
   *  (a delayed order's date is never safe to assume/omit). */
  fromDateLabel: string;
  toDateLabel: string;
  timezone: string;
  overdue: boolean;
}

/**
 * Returns null when the order carries no server ETA — callers then fall back to
 * whatever they showed before rather than inventing a window.
 */
export const resolveOrderEta = (trackData): ResolvedOrderEta | null => {
  const eta: OrderEta | undefined = trackData?.eta;
  if (!eta) return null;

  // A window that only prints clock times reads as reversed when it crosses
  // midnight — a live pending order returned "11:53 AM - 10:58 AM" spanning two
  // days. `from_at`/`to_at` carry the dates, so use them to tell a genuine
  // cross-day window (label it) from a truly inverted one (drop the range).
  const fromAt = eta?.from_at ? new Date(eta.from_at) : null;
  const toAt = eta?.to_at ? new Date(eta.to_at) : null;
  const bothParsed =
    fromAt && toAt && !Number.isNaN(+fromAt) && !Number.isNaN(+toAt);
  const inverted = bothParsed && +toAt < +fromAt;

  // Formatted in the store's timezone, same principle as the raw from/to
  // strings: don't shift it for the viewer. Always shown — an order can be
  // delayed by weeks/months, so "today" is never a safe assumption to omit
  // the date on, and the year matters once the window crosses into a
  // different year than the viewer's now.
  const dateFormatOpts: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: eta?.timezone || undefined,
  };
  // "Same calendar day" per the store's own timezone, not the viewer's local
  // Date-object day — two viewers in different zones must agree on whether
  // from/to fall on the same date.
  const dayKeyOpts: Intl.DateTimeFormatOptions = {
    timeZone: eta?.timezone || undefined,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  const dayKey = (d: Date) => d.toLocaleDateString("en-CA", dayKeyOpts);
  const fromDayKey = fromAt ? dayKey(fromAt) : null;
  const toDayKey = toAt ? dayKey(toAt) : null;

  const spansDays = bothParsed && !inverted && fromDayKey !== toDayKey;

  const fromDateLabel =
    bothParsed && fromAt ? fromAt.toLocaleDateString(undefined, dateFormatOpts) : "";
  const toDateLabel =
    bothParsed && toAt ? toAt.toLocaleDateString(undefined, dateFormatOpts) : "";

  const rawWindow =
    eta?.window || [eta?.from, eta?.to].filter(Boolean).join(" - ");
  const window = inverted
    ? ""
    : fromDateLabel && toDateLabel && eta?.from && eta?.to
      ? spansDays
        ? `${fromDateLabel}, ${eta.from} - ${toDateLabel}, ${eta.to}`
        : `${fromDateLabel}, ${eta.from} - ${eta.to}`
      : rawWindow;
  const range =
    eta?.min !== undefined && eta?.max !== undefined
      ? `${eta.min}-${eta.max}${eta?.unit ? ` ${eta.unit}` : ""}`
      : "";
  const label = eta?.text || window || range;
  if (!label) return null;

  return {
    label,
    window,
    spansDays,
    fromDateLabel,
    toDateLabel,
    timezone: eta?.timezone ?? "",
    overdue: eta?.overdue === true,
  };
};

/**
 * Statuses that end an order. The server already nulls `eta` for all of them —
 * verified live: delivered / canceled / failed orders all come back with
 * `eta: null` — so this exists to stop the *legacy* client-side estimate from
 * rendering on a closed order, and to pick the delivered-time replacement.
 */
const CLOSED_STATUSES = ["delivered", "canceled", "cancelled", "failed", "refunded", "refund_requested"];

export const isClosedOrderStatus = (status?: string) =>
  CLOSED_STATUSES.includes(String(status ?? "").toLowerCase());

/**
 * Palette role per status, so the status word can be coloured consistently
 * without every caller hardcoding one.
 */
export const getOrderStatusTone = (status?: string) => {
  switch (String(status ?? "").toLowerCase()) {
    case "delivered":
      return "success";
    case "canceled":
    case "cancelled":
    case "failed":
    case "refunded":
    case "refund_requested":
      return "error";
    case "pending":
      return "warning";
    case "picked_up":
    case "handover":
      return "primary";
    default:
      return "info";
  }
};

/**
 * The sentence under the ETA: "Your order is <Status>. <what happens next>".
 * Both halves are returned separately so the status word can be coloured.
 * Keys are passed through `t()` by the caller.
 */
export const getOrderStatusNote = (status?: string) => {
  switch (String(status ?? "").toLowerCase()) {
    case "pending":
      return "Waiting for confirmation.";
    case "confirmed":
      return "The store will start preparing it shortly.";
    case "processing":
      return "Your order is being prepared.";
    case "handover":
      return "Your order is ready for the delivery man.";
    case "picked_up":
      return "Your order is on the way.";
    case "delivered":
      return "Your order has been delivered.";
    default:
      return "";
  }
};
