import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";

const STORE_LESS_MODULES = ["parcel", "rental", "ride-share"];

export const getToken = () => {
  if (typeof window !== "undefined") {
    return window.localStorage.getItem("token");
  }
};
export const getGuestId = () => {
  if (typeof window !== "undefined") {
    return window.localStorage.getItem("guest_id");
  }
};

export const getStoredZoneId = () => {
  if (typeof window === "undefined") return undefined;
  try {
    const parsed = JSON.parse(window.localStorage.getItem("zoneid"));
    if (Array.isArray(parsed) && parsed.length > 0) {
      const moduleType = getCurrentModuleType();
      return STORE_LESS_MODULES.includes(moduleType)
        ? parsed[0]
        : parsed[parsed.length - 1];
    }
    return Number.isFinite(Number(parsed)) ? Number(parsed) : undefined;
  } catch {
    return undefined;
  }
};
