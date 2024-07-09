import {
  Checkbox,
  FormControlLabel,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { alpha, Box } from "@mui/system";
import {
  getAmountWithSign,
  getReferDiscount,
} from "helper-functions/CardHelpers";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { setTotalAmount } from "redux/slices/cart";
import {
  getCalculatedTotal,
  getCouponDiscount,
  getDeliveryFees,
  getProductDiscount,
  getSubTotalPrice,
  getTaxableTotalPrice,
  handlePurchasedAmount,
} from "utils/CustomFunctions";
import CustomDivider from "../../CustomDivider";
import { CalculationGrid, TotalGrid } from "../CheckOut.style";
import { getToken } from "helper-functions/getToken";

const OrderCalculation = (props) => {
  const {
    cartList,
    storeData,
    couponDiscount,
    taxAmount,
    distanceData,
    total_order_amount,
    configData,
    orderType,
    couponInfo,
    deliveryTip,
    origin,
    destination,
    zoneData,
    setDeliveryFee,
    extraCharge,
    extraChargeLoading,
    usePartialPayment,
    walletBalance,
    setPayableAmount,
    additionalCharge,
    payableAmount,
    cashbackAmount,
    handleExtraPackaging,
    isPackaging,
    packagingCharge,
    customerData,
    initVauleEx,
  } = props;

  const token = getToken();
  const { t } = useTranslation();
  const [freeDelivery, setFreeDelivery] = useState("false");
  const { profileInfo } = useSelector((state) => state.profileInfo);
  const theme = useTheme();
  let couponType = "coupon";
  const handleDeliveryFee = () => {
    let price = getDeliveryFees(
      storeData,
      configData,
      cartList,
      distanceData?.data,
      couponDiscount,
      couponType,
      orderType,
      zoneData,
      origin,
      destination,
      extraCharge
    );
    setDeliveryFee(orderType === "delivery" ? 0 : price);
    if (price === 0) {
      return <Typography>{t("Free")}</Typography>;
    } else {
      return (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          spacing={0.5}
          width="100%"
        >
          <Typography>{"(+)"}</Typography>
          <Typography>{storeData && getAmountWithSign(price)}</Typography>
        </Stack>
      );
    }
  };
  const handleCouponDiscount = () => {
    let couponDiscountValue = getCouponDiscount(
      couponDiscount,
      storeData,
      cartList
    );

    if (couponDiscount && couponDiscount.coupon_type === "free_delivery") {
      setFreeDelivery("true");
      return 0;
    } else {
      return getAmountWithSign(couponDiscountValue);
    }
  };

  const totalAmountForRefer = couponDiscount
    ? handlePurchasedAmount(cartList) -
      getProductDiscount(cartList, storeData) -
      getCouponDiscount(couponDiscount, storeData, cartList)
    : handlePurchasedAmount(cartList) - getProductDiscount(cartList, storeData);
  const dispatch = useDispatch();
  const referDiscount = getReferDiscount(
    totalAmountForRefer,
    customerData?.data?.discount_amount,
    customerData?.data?.discount_amount_type
  );
  const handleOrderAmount = () => {
    let totalAmount = getCalculatedTotal(
      cartList,
      couponDiscount,
      storeData,
      configData,
      distanceData,
      couponType,
      orderType,
      freeDelivery,
      Number(deliveryTip),
      zoneData,
      origin,
      destination,
      extraCharge,
      additionalCharge,
      packagingCharge,
      referDiscount
    );
    setPayableAmount(totalAmount);
    dispatch(setTotalAmount(totalAmount));
    return totalAmount;
  };
  const discountedPrice = getProductDiscount(cartList, storeData);
  const totalAmountAfterPartial = handleOrderAmount() - walletBalance;
  // const getReferDiscount = (refDiscount, refPercentage) => {
  //   if (refPercentage === "percentage") {
  //     return (
  //       (refDiscount / 100) *
  //       (handleOrderAmount() - additionalCharge - Number(deliveryTip))
  //     );
  //   } else {
  //     return refDiscount;
  //   }
  // };
  // const totalAmountForRefer =
  //   handleOrderAmount() - additionalCharge - Number(deliveryTip);
  const finalTotalAmount = profileInfo?.is_valid_for_discount
    ? handleOrderAmount() - referDiscount
    : handleOrderAmount();

  const text1 = t("After completing the order, you will receive a");
  const text2 = t(
    "cashback. The minimum purchase required to avail this offer is"
  );
  const text3 = t("However, the maximum cashback amount is");
  return (
    <>
      <CalculationGrid container item md={12} xs={12} spacing={1} mt="1rem">
        {storeData?.extra_packaging_status ? (
          <>
            <Grid item md={8} xs={12}>
              <FormControlLabel
                onChange={(e) => handleExtraPackaging(e)}
                control={<Checkbox />}
                label={
                  <Typography
                    fontWeight="400"
                    fontSize="13px"
                    color={theme.palette.primary.main}
                  >
                    {t("Extra Packaging")}
                  </Typography>
                }
              />
            </Grid>
            <Grid item md={4} xs={4} align="right" alignSelf="center">
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
                spacing={0.5}
              >
                <Typography>{getAmountWithSign(initVauleEx)}</Typography>
              </Stack>
            </Grid>
          </>
        ) : null}

        <Grid item md={8} xs={8}>
          {cartList.length > 1 ? t("Items Price") : t("Item Price")}
        </Grid>
        <Grid item md={4} xs={4} align="right">
          <Typography textTransform="capitalize" align="right">
            {getAmountWithSign(getSubTotalPrice(cartList))}
          </Typography>
        </Grid>
        <Grid item md={8} xs={8}>
          {t("Discount")}
        </Grid>
        <Grid item md={4} xs={4} align="right">
          <Stack
            width="100%"
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            spacing={0.5}
          >
            <Typography>{"(-)"}</Typography>
            <Typography>
              {storeData ? getAmountWithSign(discountedPrice) : null}
            </Typography>
          </Stack>
        </Grid>
        {couponDiscount ? (
          <>
            <Grid item md={8} xs={8}>
              {t("Coupon Discount")}
            </Grid>
            <Grid item md={4} xs={4} align="right">
              {couponDiscount.coupon_type === "free_delivery" ? (
                <Typography textTransform="capitalize">
                  {t("Free Delivery")}
                </Typography>
              ) : (
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="flex-end"
                  spacing={0.5}
                >
                  <Typography>{"(-)"}</Typography>
                  <Typography>
                    {storeData && cartList && handleCouponDiscount()}
                  </Typography>
                </Stack>
              )}
            </Grid>
          </>
        ) : null}
        {customerData?.data?.is_valid_for_discount ? (
          <>
            <Grid item md={8} xs={8}>
              {t("Referral Discount")}
            </Grid>
            <Grid item md={4} xs={4} align="right">
              <Stack
                width="100%"
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
                spacing={0.5}
              >
                <Typography>{"(-)"}</Typography>
                <Typography>{getAmountWithSign(referDiscount)}</Typography>
              </Stack>
            </Grid>
          </>
        ) : null}
        {storeData ? (
          storeData?.tax ? (
            <>
              <Grid item md={8} xs={8}>
                {t("TAX")} ({storeData?.tax}%{" "}
                {configData?.tax_included === 1 && t("Included")})
              </Grid>
              <Grid item md={4} xs={4} align="right">
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="flex-end"
                  spacing={0.5}
                >
                  {configData?.tax_included === 0 && (
                    <Typography>{"(+)"}</Typography>
                  )}
                  <Typography>
                    {storeData &&
                      getAmountWithSign(
                        getTaxableTotalPrice(
                          cartList,
                          couponDiscount,
                          storeData,
                          referDiscount
                        )
                      )}
                  </Typography>
                </Stack>
              </Grid>
            </>
          ) : null
        ) : null}
        {orderType === "delivery" || orderType === "schedule_order" ? (
          Number.parseInt(configData?.dm_tips_status) === 1 ? (
            <>
              <Grid item md={8} xs={8} sx={{ textTransform: "capitalize" }}>
                {t("Deliveryman tips")}
              </Grid>
              <Grid item md={4} xs={4} align="right">
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="flex-end"
                  spacing={0.5}
                >
                  <Typography>{"(+)"}</Typography>
                  <Typography>{getAmountWithSign(deliveryTip)}</Typography>
                </Stack>
              </Grid>
            </>
          ) : null
        ) : null}

        {configData?.additional_charge_status === 1 ? (
          <>
            <Grid item md={8} xs={8} sx={{ textTransform: "capitalize" }}>
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
        {isPackaging ? (
          <>
            <Grid item md={8} xs={8} sx={{ textTransform: "capitalize" }}>
              {t("Extra Packaging")}
            </Grid>
            <Grid item md={4} xs={4} align="right">
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
                spacing={0.5}
              >
                <Typography>{"(+)"}</Typography>
                <Typography>{getAmountWithSign(packagingCharge)}</Typography>
              </Stack>
            </Grid>
          </>
        ) : null}
        {orderType === "delivery" || orderType === "schedule_order" ? (
          <>
            <Grid item md={8} xs={8} sx={{ textTransform: "capitalize" }}>
              {t("Delivery fee")}
            </Grid>
            <Grid item md={4} xs={4} align="right">
              {couponDiscount ? (
                couponDiscount?.coupon_type === "free_delivery" ? (
                  <Typography>{t("Free")}</Typography>
                ) : (
                  storeData && handleDeliveryFee()
                )
              ) : (
                storeData && handleDeliveryFee()
              )}
            </Grid>
          </>
        ) : null}
        <CustomDivider border="1px" />
        <TotalGrid container md={12} xs={12} mt="1rem">
          <Grid item md={8} xs={8} pl=".5rem">
            <Typography fontWeight="bold" color={theme.palette.primary.main}>
              {t("Total")}
            </Typography>
          </Grid>
          <Grid item md={4} xs={4} align="right">
            <Typography color={theme.palette.primary.main} align="right">
              {storeData && cartList && getAmountWithSign(finalTotalAmount)}
            </Typography>
          </Grid>
        </TotalGrid>
        {usePartialPayment && payableAmount > walletBalance ? (
          <>
            <Grid item md={8} xs={8} sx={{ textTransform: "capitalize" }}>
              {t("Paid by wallet")}
            </Grid>
            <Grid item md={4} xs={4} align="right">
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
                spacing={0.5}
              >
                <Typography>{"(-)"}</Typography>
                <Typography>{getAmountWithSign(walletBalance)}</Typography>
              </Stack>
            </Grid>
          </>
        ) : null}
        {usePartialPayment && payableAmount > walletBalance ? (
          <>
            <Grid item md={8} xs={8}>
              {t("Due Payment")}
            </Grid>
            <Grid item md={4} xs={4} align="right">
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
                spacing={0.5}
              >
                <Typography>
                  {getAmountWithSign(totalAmountAfterPartial)}
                </Typography>
              </Stack>
            </Grid>
          </>
        ) : null}
        {token && cashbackAmount?.cashback_amount > 0 && (
          <Grid item xs={12}>
            <Box
              borderRadius={"5px"}
              borderLeft={`2px solid ${theme.palette.primary.main}`}
              padding={"0.3rem"}
              paddingLeft={"0.7rem"}
              backgroundColor={alpha(theme.palette.primary.main, 0.051)}
              fontSize={{ xs: "0.7rem" }}
            >
              {cashbackAmount?.cashback_amount > 0
                ? `${text1} ${
                    cashbackAmount?.cashback_type === "percentage"
                      ? cashbackAmount?.cashback_amount + "%"
                      : getAmountWithSign(cashbackAmount?.cashback_amount)
                  } ${text2} ${getAmountWithSign(
                    cashbackAmount?.min_purchase
                  )}. ${
                    cashbackAmount?.cashback_type === "percentage"
                      ? text3 +
                        " " +
                        getAmountWithSign(cashbackAmount?.max_discount) +
                        "."
                      : ""
                  }
`
                : ""}
            </Box>
          </Grid>
        )}
      </CalculationGrid>
    </>
  );
};

OrderCalculation.propTypes = {};

export default OrderCalculation;
