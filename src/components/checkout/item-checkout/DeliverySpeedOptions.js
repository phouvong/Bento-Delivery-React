import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Radio,
  Stack,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import { getAmountWithSign } from "../../../helper-functions/CardHelpers";
import { getInfoFromZoneData } from "../../../utils/CustomFunctions";

// ── Time-string helpers (ported from StackFood) ──────────────────────────────
const MIN_PER_DAY = 1440;

const normalizeTimeUnit = (unit) => {
  const u = unit?.toString()?.toLowerCase?.() || "";
  if (["minute", "minutes", "min", "mins"].includes(u)) return "min";
  if (["hour", "hours", "hr", "hrs"].includes(u)) return "hour";
  if (["day", "days"].includes(u)) return "day";
  return u;
};

const parseUnitFromText = (value) => {
  const text = value?.toString()?.toLowerCase?.() || "";
  if (/(^|[\s-])(day|days)([\s-]|$)/.test(text)) return "day";
  if (/(^|[\s-])(hour|hours|hr|hrs)([\s-]|$)/.test(text)) return "hour";
  if (/(^|[\s-])(minute|minutes|min|mins)([\s-]|$)/.test(text)) return "min";
  return "";
};

const convertTimeToMinutes = (value, unit) => {
  const n = Number(value) || 0;
  const normalized = normalizeTimeUnit(unit);
  if (normalized === "day") return Math.round(n * MIN_PER_DAY);
  if (normalized === "hour") return Math.round(n * 60);
  return Math.round(n);
};

const getSlidTime = (value) => {
  // Express everything ≥ 60 minutes in hours — day values come through here
  // as `days * MIN_PER_DAY` minutes (e.g., 2 days → 2880 → "48 hr") and the
  // user wants days surfaced as hours instead of "n day".
  if (value >= 60) {
    const h = Math.floor(value / 60);
    const m = value % 60;
    return m === 0 ? `${h} hr` : `${h} hr ${m} min`;
  }
  return `${value} min`;
};

const formatDeliveryTime = (minTime, maxTime, t = (k) => k) => {
  let left = getSlidTime(minTime);
  let right = getSlidTime(maxTime);
  const isLM = left.includes("min");
  const isRM = right.includes("min");
  const isLH = left.includes("hr");
  const isRH = right.includes("hr");
  const isLD = left.endsWith(" day");
  const isRD = right.endsWith(" day");

  // Pure days range — "3 - 5 days" instead of mixing hours into the same row.
  if (isLD && isRD) {
    left = left.replace(" day", "");
    right = right.replace(" day", "");
    return left === right
      ? `(${t("upto")} ${left} ${t("days")})`
      : `(${left} - ${right}) ${t("days")}`;
  }

  if (isLM && isRM && !isLH && !isRH) {
    left = left.replace(" min", "");
    right = right.replace(" min", "");
    return left === right
      ? `(${t("upto")} ${left} min)`
      : `(${left} - ${right}) min`;
  }
  if (!isLM && !isRM && isLH && isRH) {
    left = left.replace(" hr", "");
    right = right.replace(" hr", "");
    return left === right
      ? `(${t("upto")} ${left} hr)`
      : `(${left} - ${right}) hr`;
  }
  return left === right ? `(${t("upto")} ${left})` : `(${left} - ${right})`;
};

const finalizeDeliveryTime = (
  storeDeliveryTime,
  deliveryOption,
  minimumDeliveryTime,
  t = (k) => k
) => {
  if (!storeDeliveryTime || storeDeliveryTime.length === 0) return "";
  try {
    const timeUnit = parseUnitFromText(storeDeliveryTime) || "min";
    const timeList = storeDeliveryTime
      .match(/\d+(?:\.\d+)?/g)
      ?.map((v) => Number(v)) || [0, 0];
    let minTime = convertTimeToMinutes(timeList[0] || 0, timeUnit);
    let maxTime = convertTimeToMinutes(
      timeList.length > 1 ? timeList[1] : timeList[0] || 0,
      timeUnit
    );
    const saverMinTime = minimumDeliveryTime || 0;
    if (minTime > saverMinTime) minTime = saverMinTime;
    if (maxTime < saverMinTime) maxTime = saverMinTime;

    if (deliveryOption?.delivery_type === "standard") {
      return formatDeliveryTime(minTime, maxTime, t);
    }
    if (deliveryOption?.delivery_type === "express") {
      const reduceTime = convertTimeToMinutes(
        deliveryOption?.reduce_delivery_time?.value ?? 0,
        deliveryOption?.reduce_delivery_time?.unit ?? timeUnit
      );
      return formatDeliveryTime(
        minTime,
        Math.max(minTime, maxTime - reduceTime),
        t
      );
    }
    if (deliveryOption?.delivery_type === "slightly_delay") {
      const addTime = convertTimeToMinutes(
        deliveryOption?.add_delivery_time?.value ?? 0,
        deliveryOption?.add_delivery_time?.unit ?? timeUnit
      );
      return formatDeliveryTime(minTime, maxTime + addTime, t);
    }
    return "";
  } catch {
    return "";
  }
};

// ── Component ────────────────────────────────────────────────────────────────
const DeliverySpeedOptions = ({
  storeData,
  zoneData,
  orderType,
  deliveryFee,
  couponDiscount,
  selectedDeliveryOption,
  setSelectedDeliveryOption,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedDeliverySpeed, setSelectedDeliverySpeed] = useState(null);

  const chargeInfo = useMemo(() => getInfoFromZoneData(zoneData), [zoneData]);

  // Source of truth: zone_data[].modules[] matched by current module type+id.
  // Flags + options live at module root; per-zone charge/time live in `pivot`.
  const additionalDeliveryOptionStatus = Boolean(
    chargeInfo?.additional_delivery_option_status
  );
  const deliveryOptionsRaw = Array.isArray(chargeInfo?.delivery_options)
    ? chargeInfo.delivery_options
    : [];
  const minimumDeliveryTime =
    Number(chargeInfo?.pivot?.minimum_delivery_time) || 0;
  const minimumDeliveryCharge =
    Number(chargeInfo?.pivot?.minimum_delivery_charge) || 0;

  const deliveryTypeLabels = {
    standard: t("Standard Delivery"),
    express: t("Express Delivery"),
    slightly_delay: t("Slightly Delay Delivery"),
  };

  const storeDeliveryTime = storeData?.delivery_time?.toString?.() || "";
  console.log({ storeDeliveryTime });

  const deliverySpeedOptions = useMemo(() => {
    return deliveryOptionsRaw.map((option) => {
      const extraCharge = Number(option?.extra_charge) || 0;
      const reduceCharge = Number(option?.reduce_charge) || 0;
      const surcharge =
        extraCharge > 0 ? extraCharge : reduceCharge > 0 ? -reduceCharge : 0;
      return {
        id: option?.id,
        title:
          deliveryTypeLabels[option?.delivery_type] || option?.delivery_type,
        deliveryType: option?.delivery_type,
        time: finalizeDeliveryTime(
          storeDeliveryTime,
          option,
          minimumDeliveryTime,
          t
        ),
        surcharge,
        strike: reduceCharge > 0,
      };
    });
  }, [deliveryOptionsRaw, storeDeliveryTime, minimumDeliveryTime, t]);

  const canShowDeliverySpeedOptions =
    Number(deliveryFee) > minimumDeliveryCharge;

  const handleSelect = (option) => {
    setSelectedDeliverySpeed(option?.id);
    setSelectedDeliveryOption?.((prev) => {
      const next = {
        id: option?.id,
        deliveryType: option?.deliveryType,
        surcharge: option?.surcharge,
      };
      if (
        prev?.id === next.id &&
        prev?.deliveryType === next.deliveryType &&
        prev?.surcharge === next.surcharge
      ) {
        return prev;
      }
      return next;
    });
  };

  // Auto-select default option when conditions are met; clear when they're not.
  useEffect(() => {
    if (
      orderType !== "delivery" ||
      deliverySpeedOptions.length === 0 ||
      !canShowDeliverySpeedOptions
    ) {
      setSelectedDeliverySpeed(null);
      setSelectedDeliveryOption?.(null);
      return;
    }
    const selected =
      deliverySpeedOptions.find((o) => o.id === selectedDeliverySpeed) ||
      deliverySpeedOptions[0];
    if (selected?.id !== selectedDeliverySpeed) {
      setSelectedDeliverySpeed(selected?.id);
    }
    setSelectedDeliveryOption?.((prev) => {
      const next = {
        id: selected?.id,
        deliveryType: selected?.deliveryType,
        surcharge: selected?.surcharge,
      };
      if (
        prev?.id === next.id &&
        prev?.deliveryType === next.deliveryType &&
        prev?.surcharge === next.surcharge
      ) {
        return prev;
      }
      return next;
    });
  }, [
    deliverySpeedOptions,
    orderType,
    selectedDeliverySpeed,
    canShowDeliverySpeedOptions,
    setSelectedDeliveryOption,
  ]);

  const getSurchargeLabel = (surcharge) => {
    const s = Number(surcharge) || 0;
    if (s === 0) return "";
    const sign = s > 0 ? "+ " : "- ";
    return `${sign}${getAmountWithSign(Math.abs(s))}`;
  };

  // Gate: enabled at zone level, on delivery order type, with a usable fee,
  // and at least one option returned.
  if (
    !(
      orderType === "delivery" &&
      additionalDeliveryOptionStatus &&
      canShowDeliverySpeedOptions &&
      deliverySpeedOptions.length > 0
    )
  ) {
    return null;
  }

  const isFreeDeliveryCoupon = couponDiscount?.coupon_type === "free_delivery";

  return (
    <Box
      sx={{
        width: "100%",
        mt: 1,
        backgroundColor: theme.palette.background.paper,
        borderRadius: { xs: "10px", md: "14px" },
        boxShadow: `0 1px 4px ${alpha("#000", 0.06)}`,
        px: { xs: 2, md: 3 },
        py: { xs: 1.5, md: 2 },
        ...(isFreeDeliveryCoupon && {
          opacity: 0.45,
          pointerEvents: "none",
          userSelect: "none",
        }),
      }}
    >
      <Stack
        direction="column"
        alignItems="stretch"
        justifyContent="space-between"
        gap={{ xs: 1.5, md: 2 }}
        width="100%"
      >
        <Stack spacing={0.25}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: "14px", md: "16px" },
              color: theme.palette.text.primary,
            }}
          >
            {t("Instant Delivery")}
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "11px", md: "12px" },
              color: theme.palette.text.secondary,
            }}
          >
            {t(
              "You can have it delivered now or pick a time for scheduled delivery!"
            )}
          </Typography>
        </Stack>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems="stretch"
          gap={{ xs: 1, md: 1.5 }}
          sx={{ flex: 1, width: "100%", overflow: "hidden" }}
        >
          {deliverySpeedOptions.map((option) => {
            const isSelected = selectedDeliverySpeed === option.id;
            const surchargeLabel = getSurchargeLabel(option.surcharge);
            return (
              <Box
                key={option.id}
                role="button"
                onClick={() => handleSelect(option)}
                sx={{
                  flex: 1,
                  minWidth: 0,
                  width: { xs: "100%", sm: "auto" },
                  cursor: "pointer",
                  border: `1px solid ${
                    isSelected
                      ? theme.palette.primary.main
                      : theme.palette.divider
                  }`,
                  borderRadius: "10px",
                  px: { xs: 1.25, md: 1.5 },
                  py: { xs: 1, md: 1.25 },
                  backgroundColor: theme.palette.background.paper,
                  transition: "border-color 0.15s ease",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  gap={1}
                  sx={{ height: "100%" }}
                >
                  <Stack spacing={0.25} minWidth={0} flex={1}>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: { xs: "13px", md: "14px" },
                        color: theme.palette.text.primary,
                        wordBreak: "break-word",
                      }}
                    >
                      {option.title}
                    </Typography>
                    {option.time && (
                      <Typography
                        sx={{
                          fontSize: { xs: "11px", md: "12px" },
                          color: theme.palette.text.secondary,
                        }}
                      >
                        {option.time}
                      </Typography>
                    )}
                  </Stack>
                  <Stack
                    direction="row"
                    alignItems="center"
                    gap={0.5}
                    flexShrink={0}
                  >
                    {surchargeLabel && (
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: { xs: "12px", md: "13px" },
                          color: theme.palette.text.primary,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {surchargeLabel}
                      </Typography>
                    )}
                    <Radio
                      checked={isSelected}
                      value={option.id}
                      onChange={() => handleSelect(option)}
                      size={isSmall ? "small" : "medium"}
                      sx={{
                        padding: 0,
                        color: theme.palette.divider,
                        "&.Mui-checked": {
                          color: theme.palette.primary.main,
                        },
                      }}
                    />
                  </Stack>
                </Stack>
              </Box>
            );
          })}
        </Stack>
      </Stack>
    </Box>
  );
};

export default DeliverySpeedOptions;
