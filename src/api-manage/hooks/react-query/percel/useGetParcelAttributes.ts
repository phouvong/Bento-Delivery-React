import { useQuery } from "react-query";
import MainApi from "api-manage/MainApi";
import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { parcel_dimension_api, parcel_weight_api } from "api-manage/ApiRoutes";
import { getApiContent } from "api-manage/getApiContent";
import { getStoredZoneId } from "helper-functions/getToken";

/**
 * `parcel-weight` and `parcel-dimension` describe what the customer is sending.
 * Both are zone-scoped and share one payload shape, so they share one fetcher:
 *
 *   content: {
 *     status: boolean,                    // admin toggle for the whole section
 *     unit: { type, unit, label, name, supported[] },
 *     data: [ … ]                         // the selectable rows
 *   }
 *
 * `unit.label` ("kg", "in") is what the UI suffixes onto each row — never
 * hardcode it, the admin can switch a zone to lb/cm.
 */
export interface ParcelAttributeUnit {
  type: "weight" | "dimension";
  unit: string;
  label: string;
  name: string;
  supported?: string[];
}

export interface ParcelWeightOption {
  id: number;
  name: string;
  from_weight: number;
  to_weight: number;
  charge: number;
}

export interface ParcelDimensionOption {
  id: number;
  name: string;
  max_length: number;
  max_width: number;
  max_height: number;
  charge: number;
}

export interface ParcelAttributeContent<T> {
  status: boolean;
  unit?: ParcelAttributeUnit;
  data?: T[];
}

const getParcelAttribute = async <T,>(
  endpoint: string,
  zoneId: number | string
): Promise<ParcelAttributeContent<T> | undefined> => {
  // Both endpoints 422 without it, so never fire the call half-formed.
  if (zoneId === undefined || zoneId === null || zoneId === "") return undefined;
  const { data } = await MainApi.get(`${endpoint}?zone_id=${zoneId}`);
  return getApiContent<ParcelAttributeContent<T>>(data);
};

const useParcelAttribute = <T,>(
  key: string,
  endpoint: string,
  enabled: boolean,
  zoneIdOverride?: number | string
) => {
  const zoneId = zoneIdOverride ?? getStoredZoneId();
  return useQuery(
    [key, zoneId],
    () => getParcelAttribute<T>(endpoint, zoneId),
    {
      enabled: enabled && zoneId !== undefined,
      onError: onSingleErrorResponse,
    }
  );
};

export const useGetParcelWeight = (
  enabled = true,
  zoneId?: number | string
) =>
  useParcelAttribute<ParcelWeightOption>(
    "parcel-weight",
    parcel_weight_api,
    enabled,
    zoneId
  );

export const useGetParcelDimension = (
  enabled = true,
  zoneId?: number | string
) =>
  useParcelAttribute<ParcelDimensionOption>(
    "parcel-dimension",
    parcel_dimension_api,
    enabled,
    zoneId
  );
