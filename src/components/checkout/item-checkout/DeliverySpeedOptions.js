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

// ── Component ────────────────────────────────────────────────────────────────
const DeliverySpeedOptions = ({
  zoneData,
  deliveryOptions,
  orderType,
  deliveryFee,
  deliveryFeeBeforeProDiscount,
  minDeliveryCharge,
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
    chargeInfo?.additional_delivery_option_status,
  );
  // Straight from checkout-summary's `delivery_options` — already carries
  // `delivery_type_text` and a ready-formatted `time_range`.
  const deliveryOptionsRaw = Array.isArray(deliveryOptions)
    ? deliveryOptions
    : [];
  const minimumDeliveryCharge =
    minDeliveryCharge != null
      ? Number(minDeliveryCharge)
      : Number(chargeInfo?.pivot?.minimum_delivery_charge) || 0;

  const deliverySpeedOptions = useMemo(() => {
    return deliveryOptionsRaw.map((option) => {
      const extraCharge = Number(option?.extra_charge) || 0;
      const reduceCharge = Number(option?.reduce_charge) || 0;
      const surcharge =
        extraCharge > 0 ? extraCharge : reduceCharge > 0 ? -reduceCharge : 0;
      return {
        id: option?.id,
        key: option?.id ?? option?.delivery_type,
        title: option?.delivery_type_text || option?.delivery_type,
        deliveryType: option?.delivery_type,
        time: option?.time_range || "",
        surcharge,
        strike: reduceCharge > 0,
      };
    });
  }, [deliveryOptionsRaw]);

  const feeForGating =
    Number(deliveryFeeBeforeProDiscount) || Number(deliveryFee) || 0;
  const canShowDeliverySpeedOptions = feeForGating > minimumDeliveryCharge;

  const handleSelect = (option) => {
    setSelectedDeliverySpeed(option?.key);
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
      deliverySpeedOptions.find((o) => o.key === selectedDeliverySpeed) ||
      deliverySpeedOptions[0];
    if (selected?.key !== selectedDeliverySpeed) {
      setSelectedDeliverySpeed(selected?.key);
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
      // additionalDeliveryOptionStatus &&
      canShowDeliverySpeedOptions &&
      deliverySpeedOptions.length > 0
    )
  ) {
    return null;
  }

  // The final, post-everything delivery charge — admin free delivery, store
  // offer, Pro benefit, coupon, whatever combination applied it — doesn't
  // matter which; only whether the amount actually charged is 0. Picking a
  // paid speed option (Express) on top of a free delivery would silently
  // undo that free delivery, so the options are disabled rather than hidden.
  const isFreeDelivery = Number(deliveryFee) === 0;

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
              "You can have it delivered now or pick a time for scheduled delivery!",
            )}
          </Typography>
        </Stack>

        {isFreeDelivery && (
          <Stack
            direction="row"
            alignItems="flex-start"
            gap={0.75}
            sx={{
              backgroundColor: alpha(theme.palette.warning.main, 0.05),
              border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
              borderRadius: { xs: "8px", md: "10px" },
              px: { xs: 1.25, md: 1.5 },
              py: { xs: 0.75, md: 1 },
            }}
          >
            <i
              className="fi fi-rr-info"
              style={{
                fontSize: isSmall ? "12px" : "13px",
                lineHeight: 1,
                display: "flex",
                marginTop: "2px",
                color: theme.palette.warning.dark,
                flexShrink: 0,
              }}
            />
            <Typography
              sx={{
                fontSize: { xs: "11.5px", md: "12.5px" },
                lineHeight: 1.4,
                color: theme.palette.warning.dark,
              }}
            >
              {t(
                "Free delivery applies to this order amount, so delivery type charge options are disabled.",
              )}
            </Typography>
          </Stack>
        )}

        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems="stretch"
          gap={{ xs: 1, md: 1.5 }}
          sx={{
            flex: 1,
            width: "100%",
            overflow: "hidden",
            ...(isFreeDelivery && {
              opacity: 0.45,
              pointerEvents: "none",
              userSelect: "none",
            }),
          }}
        >
          {deliverySpeedOptions.map((option) => {
            const isSelected = selectedDeliverySpeed === option.key;
            const surchargeLabel = getSurchargeLabel(option.surcharge);
            return (
              <Box
                key={option.key}
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
                      value={option.key}
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
