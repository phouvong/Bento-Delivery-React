import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";

interface ConfigDataLike {
  verified_store_status?: number | boolean | null;
  service_module?: {
    provider_verified_badge?: number | boolean | null;
  } | null;
}

// Service module has its own toggle (service_module.provider_verified_badge)
// instead of the shared verified_store_status every other module reads.
const isVerifiedStoreEnabled = (
  configData?: ConfigDataLike | null,
): boolean => {
  if (getCurrentModuleType() === "service") {
    return (
      configData?.service_module?.provider_verified_badge === 1 ||
      configData?.service_module?.provider_verified_badge === true
    );
  }
  return (
    configData?.verified_store_status === 1 ||
    configData?.verified_store_status === true
  );
};

export default isVerifiedStoreEnabled;
