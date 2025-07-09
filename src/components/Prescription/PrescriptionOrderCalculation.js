import React, { useEffect } from "react";
import { CalculationGrid, TotalGrid } from "../checkout/CheckOut.style";
import { Grid, Stack, Typography, useTheme } from "@mui/material";
import CustomDivider from "../CustomDivider";
import { t } from "i18next";
import { getInfoFromZoneData, handleDistance } from "utils/CustomFunctions";
import {
  getAmountWithSign,
  getReferDiscount,
} from "helper-functions/CardHelpers";
import { useDispatch, useSelector } from "react-redux";
import useGetVehicleCharge from "../../api-manage/hooks/react-query/order-place/useGetVehicleCharge";

const PrescriptionOrderCalculation = ({
  storeData,
  configData,
  distanceData,
  orderType,
  zoneData,
  origin,
  destination,
  totalOrderAmount,
  deliveryTip,taxAmount
,setPayableAmount
}) => {
  const theme = useTheme();
  const tempDistance = handleDistance(distanceData?.data, origin, destination);

  const { data: extraCharge, refetch: extraChargeRefetch } =
    useGetVehicleCharge({ tempDistance });
  useEffect(() => {
    extraChargeRefetch();
  }, [distanceData]);
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
    const isAdminFreeDeliveryEnabled = configData?.admin_free_delivery?.status === true;
    const freeDeliveryType = configData?.admin_free_delivery?.type;
    const freeDeliveryThreshold = configData?.admin_free_delivery?.free_delivery_over;
    const isFreeDeliveryByAmount =
      freeDeliveryType === "free_delivery_by_order_amount" &&
      freeDeliveryThreshold > 0 &&
      totalOrderAmount >= freeDeliveryThreshold;

    const isFreeDeliveryToAllStores = freeDeliveryType === "free_delivery_to_all_store";
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
        const chargeInfo = getInfoFromZoneData(zoneData);
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
            return minCharge + extraCharge;
          }
      
          if (maxCharge !== null && deliveryFee > maxCharge) {
            return maxCharge + extraCharge;
          }
      
          return deliveryFee + extraCharge;
        }
      }
      
    }
  };
  const handleTotalAmount = () => {
    const tempDeliveryFee = getPrescriptionDeliveryFees(
      storeData,
      configData,
      distanceData?.data,
      orderType,
      zoneData,
      origin,
      destination
    );
    const totalAmount =
      (tempDeliveryFee ? tempDeliveryFee : 0) +
      Number(deliveryTip) +
      configData?.additional_charge;
    setPayableAmount(totalAmount)
    localStorage.setItem("totalAmount", totalAmount);
    return totalAmount;
  };
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
      {
        taxAmount?.tax_included!==null && taxAmount?.tax_included === 0 ? (
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
        ) : null
      }
      <Grid item md={8} xs={8}>
        {t("Delivery fee")}
      </Grid>
      <Grid item md={4} xs={4} align="right">
      {storeData &&
  (() => {
    const fee =
      getPrescriptionDeliveryFees(
        storeData,
        configData,
        distanceData?.data,
        orderType,
        zoneData,
        origin,
        destination
      ) ?? 0;

    return fee === 0 ? "Free" : getAmountWithSign(fee);
  })()
}
      </Grid>

      <CustomDivider />
      <TotalGrid container md={12} xs={12} mt="1rem">
        <Grid item md={8} xs={8} pl=".5rem">
          <Typography component="span" fontWeight="bold" color={theme.palette.primary.main}>
            {t("Total")}
            {" "} <Typography component="span" fontWeight="400" fontSize="14px" xs={{marginInlineStart:"5px"}}>{taxAmount?.tax_included === 1 && taxAmount?.tax_included!==null && ("(Vat/Tax incl.)")}</Typography>

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
