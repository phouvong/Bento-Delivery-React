import React from "react";
import { Grid, IconButton, Stack, Typography, useTheme } from "@mui/material";
import CloseIcon from "components/icons/CloseIcon";
import Box from "@mui/material/Box";
import { DeliveryCaption } from "components/checkout/CheckOut.style";
import { t } from "i18next";
import CustomImageContainer from "components/CustomImageContainer";
import money from "components/checkout/assets/money.png";
import { PayButton } from "components/checkout/item-checkout/OtherModulePayment";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import PaymentMethodCard from "components/checkout/PaymentMethodCard";
import { useSelector } from "react-redux";
import { PrimaryButton } from "components/Map/map.style";
import { getToken } from "helper-functions/getToken";
import PartialPayment from "components/checkout/item-checkout/PartialPayment";
import { getAmountWithSign } from "helper-functions/CardHelpers";

const RentalPaymentMethod = ({
  handleClose,
  paymentMethod,
  setPaymentMethod,
  setSwitchToWallet,
  setUsePartialPayment,
  customerData,
  payableAmount,
  switchToWallet,
  usePartialPayment,
  handlePayment,
  isLoading,
}) => {
  const theme = useTheme();
  const { configData } = useSelector((state) => state.configData);

  const handleClick = (value) => {
    setPaymentMethod(value);
  };
  const handlePartialPayment = () => {
    if (payableAmount > customerData?.data?.wallet_balance) {
      setUsePartialPayment(true);
      setPaymentMethod("");
    } else {
      setPaymentMethod("wallet");
      setSwitchToWallet(true);
    }
  };
  const removePartialPayment = () => {
    if (payableAmount > customerData?.data?.wallet_balance) {
      setUsePartialPayment(false);
      setPaymentMethod("");
    } else {
      setPaymentMethod("");
      setSwitchToWallet(false);
    }
  };
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "562px",
        p: 3,
        position: "relative",
        mx: "auto", // Center horizontally
        backgroundColor: (theme) => theme.palette.background.paper,
        borderRadius: 2,
        boxShadow: (theme) => theme.shadows[3],
      }}
    >
      {/* Close Icon */}
      <IconButton
        onClick={handleClose}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          color: (theme) => theme.palette.text.primary,
        }}
      >
        <CloseIcon sx={{ fontSize: "16px" }} />
      </IconButton>
      <DeliveryCaption const id="demo-row-radio-buttons-group-label">
        {t("Payment Method")}
      </DeliveryCaption>

      <Stack gap={1} marginTop="1rem" width="100%">
        {configData?.customer_wallet_status === 1 &&
          configData?.partial_payment_status === 1 &&
          customerData?.data?.wallet_balance > payableAmount &&
          getToken() && (
            <Grid item md={12} xs={12}>
              <PartialPayment
                remainingBalance={
                  customerData?.data?.wallet_balance - payableAmount
                }
                handlePartialPayment={handlePartialPayment}
                usePartialPayment={usePartialPayment}
                walletBalance={customerData?.data?.wallet_balance}
                paymentMethod={paymentMethod}
                switchToWallet={switchToWallet}
                removePartialPayment={removePartialPayment}
                payableAmount={payableAmount}
                margin="10px"
              />
            </Grid>
          )}
        {usePartialPayment ? (
          <Stack
            backgroundColor={theme.palette.neutral[300]}
            padding="1rem"
            borderRadius="10px"
            marginBottom=".5rem"
          >
            <Stack justifyContent="space-between" direction="row" spacing={1}>
              <Typography fontSize="12px" fontWeight="400">
                {t("Wallet Payment")}
              </Typography>
              <Typography fontSize="12px">
                {getAmountWithSign(customerData?.data?.wallet_balance)}
              </Typography>
            </Stack>
            <Stack justifyContent="space-between" direction="row" spacing={1}>
              <Typography fontSize="12px" fontWeight="600">
                {t("Remaining Bill")}
              </Typography>
              <Typography fontSize="12px" fontWeight="600">
                {getAmountWithSign(
                  payableAmount - customerData?.data?.wallet_balance
                )}
              </Typography>
            </Stack>
          </Stack>
        ) : null}
        {usePartialPayment ? (
          <Typography
            fontSize="12px"
            fontWeight="600"
            color={theme.palette.error.main}
          >
            {t("* Please select how to pay remain billing amount.")}
          </Typography>
        ) : null}

        {configData?.cash_on_delivery && (
          <PayButton
            value="cash_payment"
            paymentMethod={paymentMethod}
            onClick={() => handleClick("cash_payment")}
          >
            <CustomImageContainer
              src={money.src}
              width="20px"
              height="20px"
              alt="cod"
            />
            <Typography fontSize="12px">{t("Cash Payment")}</Typography>
          </PayButton>
        )}
      </Stack>

      {configData?.digital_payment_info?.digital_payment && (
        <CustomStackFullWidth spacing={2.4} sx={{ marginY: "1rem" }}>
          <Typography fontSize="14px" fontWeight="500">
            {t("Payment Methods")}
            <Typography component="span" fontSize="10px" ml="5px">
              {t("(Faster & secure way to pay bill)")}
            </Typography>
          </Typography>
          <CustomStackFullWidth spacing={1}>
            <Grid container spacing={3}>
              {configData?.active_payment_method_list?.map((item, index) => {
                return (
                  <Grid item xs={6} key={index}>
                    <PaymentMethodCard
                      paymentType={item?.gateway_title}
                      image={item?.gateway_image_full_url}
                      paymentMethod={paymentMethod}
                      setPaymentMethod={setPaymentMethod}
                      type={item?.gateway}
                      digitalPaymentMethodActive={
                        configData?.digital_payment_info?.digital_payment
                      }
                      configData={configData}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </CustomStackFullWidth>
        </CustomStackFullWidth>
      )}

      <PrimaryButton loading={isLoading} onClick={handlePayment}>
        {t("Proceed")}
      </PrimaryButton>
    </Box>
  );
};

export default RentalPaymentMethod;
