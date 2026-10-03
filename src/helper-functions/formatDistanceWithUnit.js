const KM_PER_MILE = 1.60934;

// distanceInKm must already be in km before calling this
export const formatDistanceWithUnit = (distanceInKm, configData) => {
  if (distanceInKm === null || distanceInKm === undefined || isNaN(distanceInKm)) {
    return null;
  }

  const unit = configData?.distance_unit || "km";
  const unitLabel = configData?.distance_unit_label || unit;

  const displayValue = unit === "mi" ? distanceInKm / KM_PER_MILE : distanceInKm;

  const decimals = Math.min(configData?.digit_after_decimal_point ?? 2, 2);
  return `${displayValue.toFixed(decimals)} ${unitLabel}`;
};
