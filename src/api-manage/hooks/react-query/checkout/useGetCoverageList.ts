import { useQuery } from "react-query";
import MainApi from "api-manage/MainApi";
import { delivery_coverage_list_api } from "api-manage/ApiRoutes";
import { getApiContent } from "api-manage/getApiContent";
import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { getStoredZoneId } from "helper-functions/getToken";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";

/**
 * `delivery-charge/coverage-list?zone_id=N` — the areas or zip codes the zone
 * prices by. Verified live:
 *
 *   { "type": "zip_code_wise", "coverage": [ { "id": 1, "name": "12345" }, … ] }
 *   { "type": null,            "coverage": [] }            // zone prices another way
 *
 * `type` is the discriminator: a selection is only asked for on `area_wise` and
 * `zip_code_wise`. Distance-wise and fixed zones return a null type, and the
 * field stays hidden (TC_67).
 *
 * Keyed by zone, not module — the same list came back for modules 1/4/5/6.
 */

export type CoverageType = "area_wise" | "zip_code_wise" | null;

export interface CoverageOption {
  id: number;
  name: string;
}

export interface CoverageListContent {
  type: CoverageType;
  coverage?: CoverageOption[];
}

const getCoverageList = async (zoneId: number | string) => {
  const { data } = await MainApi.get(
    `${delivery_coverage_list_api}?zone_id=${zoneId}`
  );
  return getApiContent<CoverageListContent>(data);
};

export default function useGetCoverageList(zoneId?: number | string) {
  const zone = zoneId ?? getStoredZoneId();
  const moduleType = getCurrentModuleType();
  return useQuery(["delivery-coverage-list", zone, moduleType], () => getCoverageList(zone), {
    // Below this the call only 422s ("The zone id field is required").
    enabled: zone !== undefined && zone !== null && zone !== "",
    staleTime: 5 * 60 * 1000,
    onError: onSingleErrorResponse,
  });
}

/** True when this zone prices by area or zip and therefore needs a selection. */
export const coverageRequiresSelection = (content?: CoverageListContent) =>
  (content?.type === "area_wise" || content?.type === "zip_code_wise") &&
  (content?.coverage?.length ?? 0) > 0;

/**
 * Which key the selected id travels under in `checkout-summary`.
 *
 * The server only honours the key that matches the zone's rule — verified on a
 * `zip_code_wise` zone: `zip_code_id` moved the fee 10 → 40 → 50 while `area_id`
 * was ignored and left it at 10. Sending the wrong one is silent: the customer
 * picks, nothing changes, and the order bills the unpriced amount.
 *
 * Matched loosely rather than against an exact string — the only types observed
 * live are `zip_code_wise` and `null`, so the precise spelling of the area
 * variant is unconfirmed and `area`/`area_wise` should both work.
 */
export const coverageIdKey = (type: CoverageType) =>
  String(type ?? "").toLowerCase().includes("area") ? "areaId" : "zipCodeId";
