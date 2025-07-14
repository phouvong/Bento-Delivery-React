import React, { useState } from "react";
import { alpha, Typography, useTheme } from "@mui/material";
import { t } from "i18next";
import { Stack } from "@mui/system";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import StoreRegPaymentCard from "components/store-resgistration/StoreRegPaymentCard";
import { useSelector } from "react-redux";
import { ResetButton } from "components/profile/basic-information/BasicInformationForm";
import { SaveButton } from "components/profile/basic-information/Profile.style";

const PaymentSelect = ({ submitBusiness, resData, isLoading }) => {
  const [selectType, setSelectType] = useState("pay_now");
  const [selectedMethod, setSelectedMethod] = useState(null);
  const { configData } = useSelector((state) => state.configData);
  const { allData, activeStep } = useSelector((state) => state.storeRegData);
  const theme = useTheme();

  const submitPayment = () => {
    submitBusiness({
      business_plan: resData?.type ?? allData?.values?.business_plan,
      store_id: resData?.store_id ?? allData?.values?.store_id,
      package_id: resData?.package_id ?? allData?.values?.package_id,
      payment: selectedMethod ?? selectType,
      payment_gateway: selectedMethod ?? selectType,
      callback:
        selectType === "free_trial"
          ? null
          : `${window.location.origin}/store-registration`,
      payment_platform: "web",
      type: "new_join",
    });
  };
  return (
    <CustomStackFullWidth
      sx={{
        border: `1px solid ${alpha(theme.palette.neutral[400], 0.4)}`,
        marginTop: "2rem",
        borderRadius: "8px",
        padding: { xs: "1rem", md: "30px" },
      }}
    >
      <Stack
        sx={{
          // backgroundColor: (theme) => alpha(theme.palette.neutral[400], 0.1),
          padding: ".6rem",
          borderRadius: "8px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography fontSize="18px" fontWeight="500" textAlign="center">
          {t("Choose Your Payment Option")}
        </Typography>
      </Stack>
      <CustomStackFullWidth
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        mt="1rem"
      >
        <Stack
          width="100%"
          padding="20px"
          sx={{
            cursor: "pointer",
            borderRadius: "10px",
            border: "1px solid",
            backgroundColor:
              selectType === "pay_now"
                ? (theme) => alpha(theme.palette.primary.main, 0.1)
                : theme.palette.neutral[100],
            borderColor:
              selectType === "pay_now"
                ? (theme) => theme.palette.primary.main
                : (theme) => alpha(theme.palette.neutral[400], 0.4),
          }}
          spacing={1}
          onClick={() => setSelectType("pay_now")}
        >
          <Stack direction="row" justifyContent="space-between">
            <Typography
              fontSize="16px"
              fontWeight="700"
              color={
                selectType === "pay_now"
                  ? theme.palette.primary.main
                  : "inherit"
              }
            >
              {t("Pay Now")}
            </Typography>
            {selectType === "pay_now" && (
              <CheckCircleIcon
                sx={{
                  fontSize: "24px",
                  color: (theme) => theme.palette.primary.main,
                }}
              />
            )}
          </Stack>
          <Typography fontSize="13px" color={theme.palette.neutral[400]}>
            {t("Manage your payment manually")}
          </Typography>
        </Stack>
        <Stack
          width="100%"
          padding="20px"
          sx={{
            cursor: "pointer",
            borderRadius: "10px",
            border: "1px solid",
            backgroundColor:
              selectType === "free_trial"
                ? (theme) => alpha(theme.palette.primary.main, 0.1)
                : theme.palette.neutral[100],
            borderColor:
              selectType === "free_trial"
                ? (theme) => theme.palette.primary.main
                : (theme) => alpha(theme.palette.neutral[400], 0.4),
          }}
          spacing={1}
          onClick={() => {
            setSelectType("free_trial");
            setSelectedMethod(null);
          }}
        >
          <Stack direction="row" justifyContent="space-between">
            <Typography
              fontSize="16px"
              fontWeight="700"
              color={
                selectType === "free_trial"
                  ? theme.palette.primary.main
                  : "inherit"
              }
            >
              {t(`${configData?.subscription_free_trial_days} Days free trial`)}
            </Typography>
            {selectType === "free_trial" && (
              <CheckCircleIcon
                sx={{
                  fontSize: "24px",
                  color: (theme) => theme.palette.primary.main,
                }}
              />
            )}
          </Stack>
          <Typography fontSize="13px" color={theme.palette.neutral[400]}>
            {t(
              `Enjoy ${configData?.subscription_free_trial_days} Days free trial and pay your subscription fee within these trial period.`
            )}
          </Typography>
        </Stack>
      </CustomStackFullWidth>
      {selectType === "pay_now" && (
        <>
          <Typography
            component="span"
            mt="30px"
            mb="1rem"
            fontSize="16px"
            fontWeight="700"
          >
            {t("Pay Via Online")}
            <Typography component="span" ml="5px">
              {t("(Faster & secure way to pay bill)")}
            </Typography>
          </Typography>
          <Stack direction="row" gap="1rem" flexWrap="wrap">
            {configData?.active_payment_method_list?.map((method) => (
              <StoreRegPaymentCard
                setSelectedMethod={setSelectedMethod}
                selectedMethod={selectedMethod}
                key={method}
                method={method}
              />
            ))}
          </Stack>
        </>
      )}

      <CustomStackFullWidth
        justifyContent="flex-end"
        direction="row"
        spacing={2}
        mt="2rem"
      >
        <SaveButton
          onClick={submitPayment}
          // Fixing the syntax for applying marginTop on xs breakpoint
          variant="contained"
          loading={isLoading}
          disabled={!selectedMethod && selectType === "pay_now"}
        >
          {t("Confirm")}
        </SaveButton>
      </CustomStackFullWidth>
    </CustomStackFullWidth>
  );
};

export default PaymentSelect;
