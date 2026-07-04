import React, { useEffect, useMemo } from "react";
import { CalculationGrid, TotalGrid } from "../checkout/CheckOut.style";
import { Grid, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import CustomDivider from "../CustomDivider";
import { t } from "i18next";
import {
  getDeliveryFeeByBadWeather,
  getInfoFromZoneData,
  handleDistance,
} from "utils/CustomFunctions";
import {
  getAmountWithSign,
  getReferDiscount,
} from "helper-functions/CardHelpers";
import { useDispatch, useSelector } from "react-redux";
import useGetVehicleCharge from "../../api-manage/hooks/react-query/order-place/useGetVehicleCharge";
import { useGetSurgePrice } from "api-manage/hooks/react-query/order-place/useGetSurgePrice";
import { getGuestId, getToken } from "helper-functions/getToken";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import InfoIcon from "@mui/icons-material/Info";
import useGetProActiveOffer from "api-manage/hooks/react-query/pro-plans/useGetProActiveOffer";

const PrescriptionOrderCalculation = ({
  storeData,
  configData,
  distanceData,
  orderType,
  zoneData,
  origin,
  destination,
  totalOrderAmount,
  deliveryTip,
  taxAmount,
  setPayableAmount,
  selectedDeliveryOption,
  setDeliveryFee,
}) => {
  const deliveryOptionSurcharge =
    orderType === "delivery"
      ? Number(selectedDeliveryOption?.surcharge) || 0
      : 0;
  const { data: surgePrice, mutate: surgeMutate } = useGetSurgePrice();
  const theme = useTheme();
  const tempDistance = handleDistance(distanceData?.data, origin, destination);

  const { data: extraCharge, refetch: extraChargeRefetch } =
    useGetVehicleCharge({ tempDistance });
  useEffect(() => {
    extraChargeRefetch();
  }, [distanceData]);
  useEffect(() => {
    if (storeData) {
      const temData = {
        zone_id: storeData?.zone_id,
        module_id: storeData?.module_id,
        date_time: new Date().toISOString(),
        guest_id: getGuestId(),
      };
      surgeMutate(temData, {
        onError: onErrorResponse,
      });
    }
  }, [storeData]);
  const getPrescriptionDeliveryFees = (
    storeData,
    configData,
    distance,
    orderType,
    zoneData,
    origin,
    destination
  ) => {
    let convertedDistance = handleDistance(
      distanceData?.data,
      origin,
      destination
    );
    console.log({ convertedDistance, storeData });

    const isAdminFreeDeliveryEnabled =
      configData?.admin_free_delivery?.status === true;
    const freeDeliveryType = configData?.admin_free_delivery?.type;
    const freeDeliveryThreshold =
      configData?.admin_free_delivery?.free_delivery_over;
    const isFreeDeliveryByAmount =
      freeDeliveryType === "free_delivery_by_order_amount" &&
      freeDeliveryThreshold > 0 &&
      totalOrderAmount >= freeDeliveryThreshold;

    const isFreeDeliveryToAllStores =
      freeDeliveryType === "free_delivery_to_all_store";
    const globalFreeDeliveryThreshold = configData?.free_delivery_over;
    let deliveryFee = convertedDistance * configData?.per_km_shipping_charge;
    if (Number.parseInt(storeData?.self_delivery_system) === 1) {
      if (storeData?.free_delivery || isFreeDeliveryToAllStores) {
        return 0;
      } else {
        deliveryFee =
          convertedDistance * storeData?.per_km_shipping_charge || 0;
        if (
          deliveryFee > storeData?.minimum_shipping_charge &&
          deliveryFee < storeData?.maximum_shipping_charge
        ) {
          return deliveryFee;
        } else {
          if (deliveryFee < storeData?.minimum_shipping_charge) {
            return storeData?.minimum_shipping_charge;
          } else if (
            storeData?.maximum_shipping_charge !== null &&
            deliveryFee > storeData?.maximum_shipping_charge
          ) {
            return storeData?.maximum_shipping_charge;
          }
        }
      }
    } else {
      if (zoneData?.data?.zone_data?.length > 0) {
        const chargeInfo = getInfoFromZoneData(zoneData?.data);
        console.log({ chargeInfo, zoneData });

        const perKmCharge = chargeInfo?.pivot?.per_km_shipping_charge || 0;
        const minCharge = chargeInfo?.pivot?.minimum_shipping_charge;
        const maxCharge = chargeInfo?.pivot?.maximum_shipping_charge;

        const qualifiesForFreeDelivery =
          (globalFreeDeliveryThreshold &&
            globalFreeDeliveryThreshold > 0 &&
            totalOrderAmount > globalFreeDeliveryThreshold) ||
          orderType === "take_away" ||
          isFreeDeliveryToAllStores;

        if (qualifiesForFreeDelivery) {
          return 0;
        }

        if (perKmCharge) {
          let deliveryFee = convertedDistance * perKmCharge;

          if (minCharge !== null && deliveryFee < minCharge) {
            return getDeliveryFeeByBadWeather(
              minCharge + extraCharge,
              surgePrice
            );
          }

          if (maxCharge !== null && deliveryFee > maxCharge) {
            return getDeliveryFeeByBadWeather(
              maxCharge + extraCharge,
              surgePrice
            );
          }

          return getDeliveryFeeByBadWeather(
            deliveryFee + extraCharge,
            surgePrice
          );
        }
      }
    }
  };
  const computedDeliveryFee = useMemo(
    () =>
      getPrescriptionDeliveryFees(
        storeData,
        configData,
        distanceData?.data,
        orderType,
        zoneData,
        origin,
        destination
      ) ?? 0,
    [
      storeData,
      configData,
      distanceData,
      orderType,
      zoneData,
      origin,
      destination,
      extraCharge,
      surgePrice,
      totalOrderAmount,
    ]
  );

  // ── Pro member: delivery_fee benefit ───────────────────────────────────
  const proFeatureEnabled = configData?.pro_member_status === 1;
  const hasToken = !!getToken();
  const { data: activeOfferRaw } = useGetProActiveOffer({
    enabled: proFeatureEnabled && hasToken,
  });
  const activeOffer = activeOfferRaw?.data ?? activeOfferRaw ?? null;
  const isProActive = activeOffer?.status === true;
  const proBenefit = activeOffer?.benefit ?? null;
  const proMinOrderAmount = Number(proBenefit?.min_order_amount) || 0;
  const proMinSatisfied =
    proBenefit?.min_order_status !== 1 ||
    Number(computedDeliveryFee || 0) >= proMinOrderAmount;
  const proDeliveryBenefitActive =
    isProActive &&
    proBenefit?.type === "delivery_fee" &&
    proMinSatisfied &&
    Number(computedDeliveryFee || 0) > 0;
  const proDeliveryOfferType = proBenefit?.offer_type;
  const proDeliveryDiscountPct =
    Number(proBenefit?.charge_discount_percentage) || 0;
  const proDeliveryDiscount = (() => {
    if (!proDeliveryBenefitActive) return 0;
    const fee = Number(computedDeliveryFee) || 0;
    if (
      proDeliveryOfferType === "free" ||
      proDeliveryOfferType === "full_free"
    ) {
      return fee;
    }
    if (proDeliveryOfferType === "partial_free" && proDeliveryDiscountPct > 0) {
      return (fee * proDeliveryDiscountPct) / 100;
    }
    return 0;
  })();
  const effectiveDeliveryFee = Math.max(
    0,
    Number(computedDeliveryFee || 0) - proDeliveryDiscount
  );

  useEffect(() => {
    setDeliveryFee?.(effectiveDeliveryFee);
  }, [effectiveDeliveryFee, setDeliveryFee]);

  const handleTotalAmount = () => {
    const totalAmount =
      effectiveDeliveryFee +
      Number(deliveryTip) +
      configData?.additional_charge +
      deliveryOptionSurcharge;
    setPayableAmount(totalAmount);
    localStorage.setItem("totalAmount", totalAmount);
    return totalAmount;
  };
  const extraText = t("This charge includes extra vehicle charge");
  const proTooltipText =
    proDeliveryBenefitActive && proDeliveryDiscount > 0
      ? ` ${t("Pro discount applied")}: -${getAmountWithSign(
          proDeliveryDiscount
        )}`
      : "";
  const deliveryToolTipsText = `${
    extraCharge > 0 ? `${extraText} ${getAmountWithSign(extraCharge)}` : ""
  }${
    surgePrice?.price > 0 && surgePrice?.customer_note_status !== 0
      ? ` ${surgePrice?.customer_note} ${
          surgePrice?.type === "amount"
            ? getAmountWithSign(surgePrice?.price)
            : `${surgePrice?.price}%`
        }`
      : ""
  }${proTooltipText}`.trim();
  return (
    <CalculationGrid container item md={12} xs={12} spacing={1}>
      <Grid item md={8} xs={8}>
        {t("Deliveryman tips")}
      </Grid>
      <Grid item md={4} xs={4} align="right">
        {getAmountWithSign(deliveryTip)}
      </Grid>
      {configData?.additional_charge_status === 1 ? (
        <>
          <Grid item md={8} xs={8}>
            {t(configData?.additional_charge_name)}
          </Grid>
          <Grid item md={4} xs={4} align="right">
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
              spacing={0.5}
            >
              <Typography>{"(+)"}</Typography>
              <Typography>
                {getAmountWithSign(configData?.additional_charge)}
              </Typography>
            </Stack>
          </Grid>
        </>
      ) : null}
      {taxAmount?.tax_included !== null && taxAmount?.tax_included === 0 ? (
        <>
          <Grid item md={8} xs={8}>
            {t("TAX")}
          </Grid>
          <Grid item md={4} xs={4} align="right">
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
              spacing={0.5}
            >
              <Typography>
                {taxAmount?.tax_included === 0 && <>{"(+)"}</>}
                {getAmountWithSign(taxAmount?.tax_amount)}
              </Typography>
            </Stack>
          </Grid>
        </>
      ) : null}
      <Grid item md={8} xs={8}>
        {t("Delivery fee")}
        {extraCharge > 0 ||
        surgePrice?.price > 0 ||
        (proDeliveryBenefitActive && proDeliveryDiscount > 0) ? (
          <Tooltip title={deliveryToolTipsText} placement="top" arrow={true}>
            <InfoIcon sx={{ fontSize: "11px" }} />
          </Tooltip>
        ) : null}
      </Grid>
      <Grid item md={4} xs={4} align="right">
        {storeData &&
          (proDeliveryBenefitActive &&
          proDeliveryDiscount > 0 &&
          Number(computedDeliveryFee) > 0 ? (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
              spacing={0.5}
            >
              <Typography sx={{ textDecoration: "line-through", opacity: 0.6 }}>
                {getAmountWithSign(computedDeliveryFee)}
              </Typography>
              <Typography color="primary" fontWeight={600}>
                {effectiveDeliveryFee === 0
                  ? t("Free")
                  : getAmountWithSign(effectiveDeliveryFee)}
              </Typography>
            </Stack>
          ) : computedDeliveryFee === 0 ? (
            t("Free")
          ) : (
            getAmountWithSign(computedDeliveryFee)
          ))}
      </Grid>

      {selectedDeliveryOption &&
        selectedDeliveryOption.deliveryType !== "standard" &&
        orderType === "delivery" &&
        deliveryOptionSurcharge !== 0 && (
          <>
            <Grid item md={8} xs={8} sx={{ textTransform: "capitalize" }}>
              {selectedDeliveryOption.deliveryType === "express"
                ? t("Express Delivery")
                : t("Slightly Delay Delivery")}
            </Grid>
            <Grid item md={4} xs={4} align="right">
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
                spacing={0.5}
              >
                <Typography>
                  {deliveryOptionSurcharge > 0 ? "(+)" : "(-)"}
                </Typography>
                <Typography>
                  {getAmountWithSign(Math.abs(deliveryOptionSurcharge))}
                </Typography>
              </Stack>
            </Grid>
          </>
        )}

      <CustomDivider />
      <TotalGrid container md={12} xs={12} mt="1rem">
        <Grid item md={8} xs={8} pl=".5rem">
          <Typography
            component="span"
            fontWeight="bold"
            color={theme.palette.primary.main}
          >
            {t("Total")}{" "}
            <Typography
              component="span"
              fontWeight="400"
              fontSize="14px"
              xs={{ marginInlineStart: "5px" }}
            >
              {taxAmount?.tax_included === 1 &&
                taxAmount?.tax_included !== null &&
                "(Vat/Tax incl.)"}
            </Typography>
          </Typography>
        </Grid>
        <Grid item md={4} xs={4} align="right">
          <Typography color={theme.palette.primary.main}>
            {storeData && getAmountWithSign(handleTotalAmount())}
          </Typography>
        </Grid>
      </TotalGrid>
    </CalculationGrid>
  );
};

export default PrescriptionOrderCalculation;
