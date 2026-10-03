import { useMemo } from "react";
import { useSelector } from "react-redux";
import useGetZoneId from "api-manage/hooks/react-query/google-api/useGetZone";
import { getZoneIdWithModule } from "helper-functions/getZoneIdWithModule";

const readStored = (key: string) => {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(window.localStorage.getItem(key) || "null");
  } catch {
    return null;
  }
};

/** The user's first zone that offers parcel; undefined when none does. */
const useParcelZoneId = () => {
  const currentLatLng = useMemo(() => readStored("currentLatLng"), []);
  // Same query key as the header, so this shares its cached request.
  const { isLoading } = useGetZoneId(currentLatLng, !!currentLatLng);
  const zonesById = useSelector((state: any) => state.zoneData?.zonesById);

  const zoneId = getZoneIdWithModule(readStored("zoneid"), zonesById, "parcel");

  return { zoneId, isResolving: isLoading && zoneId === undefined };
};

export default useParcelZoneId;
