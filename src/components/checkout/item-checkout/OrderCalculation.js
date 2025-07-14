import InfoIcon from "@mui/icons-material/Info";
import {
  Checkbox,
  FormControlLabel,
  Grid,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Box, alpha } from "@mui/system";
import {
  getAmountWithSign,
  getReferDiscount,
} from "helper-functions/CardHelpers";
import { getToken } from "helper-functions/getToken";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { setTotalAmount } from "redux/slices/cart";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import {
  bad_weather_fees,
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

const OrderCalculation = (props) => {
  const {
    cartList,
    storeData,
    couponDiscount,
    distanceData,
    configData,
    orderType,
    deliveryTip,
    origin,
    destination,
    zoneData,
    setDeliveryFee,
    extraCharge,
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
    isLoading,
    taxAmount
  } = props;

  const token = getToken();
  const { t } = useTranslation();
  const [freeDelivery, setFreeDelivery] = useState("false");
  const { profileInfo } = useSelector((state) => state.profileInfo);
  const tempExtraCharge = extraCharge ?? 0;
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
      tempExtraCharge
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
      referDiscount,
      taxAmount?.tax_amount
    );
    setPayableAmount(totalAmount);
    dispatch(setTotalAmount(totalAmount));
    return totalAmount;
  };
  let diffDiscount={
    value:0
  }
  const discountedPrice = getProductDiscount(cartList, storeData,diffDiscount);
  const totalAmountAfterPartial = handleOrderAmount() - walletBalance;
  const finalTotalAmount = profileInfo?.is_valid_for_discount
    ? handleOrderAmount() - referDiscount
    : handleOrderAmount();

  const text1 = t("After completing the order, you will receive a");
  const text2 = t(
    "cashback. The minimum purchase required to avail this offer is"
  );
  const text3 = t("However, the maximum cashback amount is");
  const extraText = t("This charge includes extra vehicle charge");
  const badText = t("and bad weather charge");
  const deliveryToolTipsText = `${extraText} ${getAmountWithSign(
    tempExtraCharge
  )}${
    bad_weather_fees !== 0
      ? ` ${badText} ${getAmountWithSign(bad_weather_fees)}`
      : ""
  }`;
  return (
    <>
      <CalculationGrid container item xs={12} spacing={1} mt="1rem">
        {storeData?.extra_packaging_status ? (
          <>
            <Grid item xs={8}>
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
            <Grid item xs={4} align="right" alignSelf="center">
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
        {
          taxAmount?.tax_included!==null && taxAmount?.tax_included === 0 ? (
            <>
              <Grid item md={8} xs={8}>
                {t("VAT/TAX")}
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
            <Grid item xs={8} sx={{ textTransform: "capitalize" }}>
              {t(configData?.additional_charge_name)}
            </Grid>
            <Grid item xs={4} align="right">
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
            <Grid item xs={8} sx={{ textTransform: "capitalize" }}>
              {t("Extra Packaging")}
            </Grid>
            <Grid item xs={4} align="right">
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
        {
          <>
            {isLoading ? (
              <CustomStackFullWidth
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ paddingInlineStart: "5px" }}
              >
                <Skeleton variant="text" width="50px" />
                <Skeleton variant="text" width="50px" />
              </CustomStackFullWidth>
            ) : (
              <>
                {orderType === "delivery" || orderType === "schedule_order" ? (
                  <>
                    <Grid item xs={8} sx={{ textTransform: "capitalize" }}>
                      <Typography component="span" align="center">
                        {t("Delivery fee")}
                        {Number.parseInt(storeData?.self_delivery_system) !==
                          1 && (
                          <Typography component="span">
                            <Tooltip
                              title={deliveryToolTipsText}
                              placement="top"
                              arrow={true}
                            >
                              <InfoIcon sx={{ fontSize: "11px" }} />
                            </Tooltip>
                          </Typography>
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={4} align="right">
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
              </>
            )}
          </>
        }

        <CustomDivider border="1px" />
        <TotalGrid container md={12} xs={12} mt="1rem">
          {isLoading ? (
            <CustomStackFullWidth
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ paddingInlineStart: "5px" }}
            >
              <Skeleton variant="text" width="50px" />
              <Skeleton variant="text" width="50px" />
            </CustomStackFullWidth>
          ) : (
            <>
              <Grid
                item
                md={8}
                xs={8}
                sx={{
                  textTransform: "capitalize",
                  fontWeight: "700",
                  color: (theme) => theme.palette.primary.main,
                  paddingInlineStart: "7px",
                }}
              >
                <Typography
                  component="span"
                sx={{ textTransform: "capitalize",
                  fontWeight: "700",}}
                >
                {t("Total")}
                <Typography sx={{marginInlineStart:"5px"}} component="span" fontSize="12px" fontWeight="400" color={theme.palette.primary.main}>
                  {taxAmount?.tax_included === 1 && taxAmount?.tax_included!==null && ("(Vat/Tax incl.)")}
                </Typography>
                </Typography>
              </Grid>
              <Grid item md={4} xs={4} align="right">
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="flex-end"
                  spacing={0.5}
                >
                  <Typography color={theme.palette.primary.main} align="right">
                    {" "}
                    {storeData &&
                      cartList &&
                      getAmountWithSign(finalTotalAmount)}
                  </Typography>
                </Stack>
              </Grid>
            </>
          )}
        </TotalGrid>
        {diffDiscount?.value>0  ?<Typography
          sx={{
            fontSize: "14px",
            fontWeight: "400",
            width: "100%",
            color: (theme) => theme.palette.neutral[1000],
            padding: "5px 0px",
            backgroundColor: "#FFF6CA",
          }}
          align="center"
        >
          {t(`You got ${getAmountWithSign(diffDiscount?.value)} additional discount`)}
        </Typography> : null}
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
