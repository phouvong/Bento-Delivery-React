import React from "react";
import { CustomStackFullWidth } from "../../../styled-components/CustomStyles.style";
import { alpha, Button, Typography } from "@mui/material";
import PartialSvg from "../assets/PartialSvg";
import { Stack } from "@mui/system";
import { t } from "i18next";
import { useTheme } from "@emotion/react";
import { getAmountWithSign } from "../../../helper-functions/CardHelpers";
import { PaymentCard } from "components/checkout/item-checkout/OtherModulePayment";

const PartialPayment = ({
  handlePartialPayment,
  usePartialPayment,
  walletBalance,
  paymentMethod,
  removePartialPayment,
  switchToWallet,
  remainingBalance,
  payableAmount,
  margin,
  failed,
}) => {
  const theme = useTheme();
  const isSelected = usePartialPayment || switchToWallet || paymentMethod === "wallet";

  return (
    <PaymentCard selected={isSelected ? 1 : 0}>
      <CustomStackFullWidth direction="row" spacing={1}>
        <PartialSvg />
        <Stack>
          <Typography fontSize="10px" color={theme.palette.neutral[500]}>
            {paymentMethod === "wallet" && switchToWallet
              ? t("Remaining Balance")
              : t("Wallet Balance")}
          </Typography>
          <Typography fontSize="20px" fontWeight="700" color={theme.palette.primary.main}>
            {paymentMethod === "wallet" && switchToWallet
              ? getAmountWithSign(remainingBalance)
              : getAmountWithSign(walletBalance)}
          </Typography>
        </Stack>
      </CustomStackFullWidth>

      {failed && paymentMethod === "wallet" ? (
        <Button variant="outlined" onClick={handlePartialPayment}>
          {t("Applied")}
        </Button>
      ) : !usePartialPayment && !switchToWallet ? (
        <Button variant="outlined" onClick={handlePartialPayment}>
          {t("Apply")}
        </Button>
      ) : (
        <Button variant="outlined" onClick={removePartialPayment} sx={{ color: theme.palette.error.main }}>
          {t("Remove")}
        </Button>
      )}
    </PaymentCard>
  );
};

export default PartialPayment;
