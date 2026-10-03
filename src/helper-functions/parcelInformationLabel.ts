import { capitalizeLabel } from "helper-functions/stringHelpers";

/**
 * Labels for the weight / dimension brackets chosen in the parcel information
 * modal. The modal renders them, the delivery-info card summarises them and the
 * checkout billing panel repeats that summary — so the wording lives here
 * rather than being rebuilt in three places.
 *
 * The unit is never hardcoded: it is a per-zone admin setting delivered as
 * `unit.label` by `parcel-weight` / `parcel-dimension` ("kg" or "lb", "in" or
 * "cm"). The modal stamps it onto the selection as `unit_label` when the
 * customer confirms, so later screens can render the bracket without refetching.
 * Display capitalises it ("Kg", "In") to match the design.
 */

const resolveUnit = (option, unitLabel) => {
  const raw = unitLabel ?? option?.unit_label;
  return raw ? capitalizeLabel(raw) : "";
};

const isPresent = (value) => value !== undefined && value !== null;

/** `"Light (2-4Kg)"` — name plus its range, or just the name if it has none. */
export const formatParcelWeight = (weight, unitLabel?: string) => {
  if (!weight) return "";
  const unit = resolveUnit(weight, unitLabel);
  const hasRange =
    isPresent(weight?.from_weight) && isPresent(weight?.to_weight);
  const range = hasRange
    ? ` (${weight.from_weight}-${weight.to_weight}${unit})`
    : "";
  return `${weight?.name ?? ""}${range}`.trim();
};

/** `"100 × 50 × 80 In"` — the bracket's maximum box. */
export const formatParcelDimensionSize = (dimension, unitLabel?: string) => {
  if (!dimension) return "";
  const unit = resolveUnit(dimension, unitLabel);
  const { max_length, max_width, max_height } = dimension;
  if (![max_length, max_width, max_height].every(isPresent)) return "";
  return `${max_length} × ${max_width} × ${max_height}${unit ? ` ${unit}` : ""}`;
};

/**
 * `"Small, Light (2-4Kg)"` — size first, then weight, matching the design.
 * Returns "" when nothing has been chosen so callers can fall back.
 */
export const getParcelInformationSummary = (weight, dimension) =>
  [dimension?.name, formatParcelWeight(weight)].filter(Boolean).join(", ");

/**
 * The same summary for a *placed* order. Confirmed against a live order:
 * `customer/order/track` echoes the brackets back as `weight` and `dimension`
 * (bare names, alongside `parcel_category`) — `customer/order/details` carries
 * neither, so callers must pass the **track** payload, not the details one.
 * `parcel_weight` / `parcel_dimension` are accepted as a defensive alias.
 */
export const getOrderParcelInformationSummary = (order) =>
  getParcelInformationSummary(
    order?.parcel_weight ?? order?.weight,
    order?.parcel_dimension ?? order?.dimension
  );
