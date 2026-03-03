import MainApi from "../../MainApi";
import { useQuery } from "react-query";
import { moduleList } from "../../ApiRoutes";
import { onErrorResponse } from "../../api-error-response/ErrorResponses";
import { useEffect, useState } from "react";

const getModule = async () => {
  const { data } = await MainApi.get(moduleList);
  return data;
};

const normalizeZoneIdForKey = (zoneId) => {
  if (!zoneId || zoneId === "undefined" || zoneId === "null" || /nan/i.test(zoneId))
    return null;

  try {
    const parsed = JSON.parse(zoneId);
    if (Array.isArray(parsed)) {
      const ids = parsed
        .map((item) => Number(item))
        .filter((item) => Number.isFinite(item));
      return ids.length > 0 ? JSON.stringify(ids) : null;
    }
    const asNumber = Number(parsed);
    return Number.isFinite(asNumber) ? JSON.stringify([asNumber]) : null;
  } catch {
    const trimmed = String(zoneId).trim();
    const asNumber = Number(trimmed);
    if (Number.isFinite(asNumber)) return JSON.stringify([asNumber]);

    const parts = trimmed
      .split(",")
      .map((item) => Number(item.trim()))
      .filter((item) => Number.isFinite(item));
    return parts.length > 0 ? JSON.stringify(parts) : null;
  }
};

const getZoneIdsKeyFromStorage = () => {
  if (typeof window === "undefined") return null;
  return normalizeZoneIdForKey(localStorage.getItem("zoneid"));
};

export default function useGetModule() {
  const [zoneIdsKey, setZoneIdsKey] = useState(() => getZoneIdsKeyFromStorage());

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateZoneIds = () => {
      setZoneIdsKey(getZoneIdsKeyFromStorage());
    };

    updateZoneIds();
    window.addEventListener("storage", updateZoneIds);
    window.addEventListener("focus", updateZoneIds);
    const intervalId = window.setInterval(updateZoneIds, 1000);

    return () => {
      window.removeEventListener("storage", updateZoneIds);
      window.removeEventListener("focus", updateZoneIds);
      window.clearInterval(intervalId);
    };
  }, []);

  const query = useQuery(["module-list", zoneIdsKey], getModule, {
    enabled: false,
    onError: onErrorResponse,
  });

  useEffect(() => {
    if (!zoneIdsKey) return;
    query.refetch();
  }, [zoneIdsKey, query.refetch]);

  return query;
}
