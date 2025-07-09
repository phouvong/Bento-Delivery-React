import React from "react";
import { CustomStackFullWidth } from "../../../styled-components/CustomStyles.style";
import partialImage from "../assets/partail.png";
import { alpha, Button, Typography } from "@mui/material";
import PartialSvg from "../assets/PartialSvg";
import { Stack } from "@mui/system";
import { t } from "i18next";
import { useTheme } from "@emotion/react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { getAmountWithSign } from "../../../helper-functions/CardHelpers";
import {PayButton} from "components/checkout/item-checkout/OtherModulePayment";

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
}) => {
  const theme = useTheme();
  return (
    <PayButton>
      <CustomStackFullWidth direction="row" spacing={1}>
        <PartialSvg />

        <Stack>
          <Typography fontSize="10px" color={theme.palette.neutral[500]}>
            {   paymentMethod === 'wallet' && switchToWallet ? t('Remaining Balance') : t('Wallet Balance')}
          </Typography>
          <Typography
            fontSize="20px"
            fontWeight="700"
            color={theme.palette.primary.main}
          >
            {paymentMethod === 'wallet' && switchToWallet ? getAmountWithSign(
              remainingBalance,

            ) : getAmountWithSign(
              walletBalance

            )}

          </Typography>

        </Stack>
      </CustomStackFullWidth>
      {!usePartialPayment && !switchToWallet ? (
        <Button variant="outlined" onClick={handlePartialPayment}>
          {t("Apply")}
        </Button>
      ) : (
        <Button
          variant="outlined"
          onClick={removePartialPayment}
          sx={{ color: theme.palette.error.main }}
        >
          {t("Remove")}
        </Button>
      )}

</PayButton>
  );
};

export default PartialPayment;
