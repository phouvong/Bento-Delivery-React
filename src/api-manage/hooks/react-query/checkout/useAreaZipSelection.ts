import { useEffect, useMemo, useState } from "react";
import { getStoredZoneId } from "helper-functions/getToken";
import useGetCoverageList, {
  coverageIdKey,
  coverageRequiresSelection,
} from "api-manage/hooks/react-query/checkout/useGetCoverageList";

/**
 * Owns the Area / ZIP Code selection for one checkout.
 *
 * Every module checkout needs the same three things — the coverage list, the
 * selected id in the shape `checkout-summary` wants, and the "you must choose
 * one" gate on the confirm button — so they live here rather than being
 * repeated per screen.
 *
 * The selection resets whenever the zone changes, because a zip code from the
 * previous address is not valid against the new one (TC_68).
 */

interface UseAreaZipSelectionArgs {
  /** Take-away and dine-in carry no delivery charge, so no selection is asked. */
  orderType?: string;
  /** Self-delivery stores price their own fee — the admin rule does not apply. */
  selfDelivery?: boolean;
  /**
   * Overrides the browsing zone. Parcel prices off the pickup zone, which
   * can differ from the zone the customer's app session is browsing in.
   */
  zoneId?: number | string;
}

export const useAreaZipSelection = ({
  orderType,
  selfDelivery,
  zoneId: zoneIdOverride,
}: UseAreaZipSelectionArgs) => {
  // Deliberately NOT parameterised. `coverage-list` takes `zone_id` as a query
  // param and *ignores* the `zoneId` header — verified: header zone 1 + query
  // zone 2 returns zone 2's list. So the zone passed here decides which areas
  // are offered, while `checkout-summary` prices against the header's zone.
  // Pass anything else (a store's `zone_id`, say) and the two diverge: the ids
  // offered are rejected with 403 "The selected option is not available in this
  // zone", or the field silently vanishes when that zone has no rule.
  const zoneId = zoneIdOverride ?? getStoredZoneId();
  const { data: coverage, isLoading } = useGetCoverageList(zoneId);
  const [value, setValue] = useState<number | null>(null);
  const [error, setError] = useState(false);

  const hidden =
    orderType === "take_away" || orderType === "dine_in" || !!selfDelivery;
  const required = !hidden && coverageRequiresSelection(coverage);

  // A zip code from the previous address means nothing against a new zone.
  useEffect(() => {
    setValue(null);
    setError(false);
  }, [zoneId, coverage?.type]);

  useEffect(() => {
    if (value !== null) setError(false);
  }, [value]);

  /**
   * Spread into the `useGetCheckoutSummary` params. It lands in that query's
   * key, so changing the selection changes the key and the summary re-quotes —
   * which is the whole point: the fee comes from the server, not from here.
   *
   * Deliberately NOT gated on `required`. That flag depends on the coverage
   * type resolving, and while it was in this condition a selection made before
   * (or without) that resolution was silently dropped and the fee never moved.
   * If something is selected and the section is not hidden, it gets sent.
   */
  const summaryParams = useMemo(() => {
    if (hidden || value === null || value === undefined) return {};
    // `area_id` for an area-wise zone, `zip_code_id` for a zip-wise one — the
    // server ignores the key that does not match the rule.
    return { [coverageIdKey(coverage?.type)]: value };
  }, [hidden, value, coverage?.type]);

  /** Call before placing the order; returns false and flags the field when unset. */
  const validate = () => {
    if (required && value === null) {
      setError(true);
      return false;
    }
    return true;
  };

  return {
    coverage,
    isLoading,
    hidden,
    required,
    value,
    setValue,
    error,
    validate,
    summaryParams,
  };
};

export default useAreaZipSelection;
