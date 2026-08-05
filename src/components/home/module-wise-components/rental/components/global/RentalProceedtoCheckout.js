import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { t } from "i18next";
import React from "react";
import { getAmountWithSign, formatNumber } from "helper-functions/CardHelpers";
import { LoadingButton } from "@mui/lab";
import {
  calculateTotalDiscount,
  getTotalAmount,
} from "components/home/module-wise-components/rental/components/rental-checkout/checkoutHeplerFunction";

const RentalProceedtoCheckout = ({
  onClick,
  backgroundColor,
  color,
  hover,
  border,
  shadow,
  textKey = "cart",
  text = "Proceed to Checkout",
  sx,
  rentalUserData,
  isLoading,
  totalAmount,
  discountDifference,
  isShowDiscount,
  children,
}) => {
  const getText = {
    cart: (
      <Typography
        sx={{
          fontSize: "16px",
          fontWeight: "400",
          display: "flex",
          justifyContent: "start",
          gap: "5px",
          color: (theme) => theme.palette.neutral[1000],
        }}
      >
        {t("Estimated")}{" "}
        {rentalUserData?.user_data?.rental_type === "hourly" ? (
          <>
            <b>{formatNumber(rentalUserData?.user_data?.estimated_hours)}</b> Hrs
          </>
        ) : rentalUserData?.user_data?.rental_type === "day_wise" ? (
          <>
            <b>{formatNumber(rentalUserData?.user_data?.estimated_hours / 24)}</b> Days
          </>
        ) : (
          <>
            <b>{formatNumber(rentalUserData?.user_data?.distance)}</b> Km
          </>
        )}
      </Typography>
    ),
    "trip-status": (
      <Typography
        sx={{
          fontSize: "16px",
          fontWeight: "700",
          display: "flex",
          justifyContent: "start",
          gap: "5px",
        }}
      >
        {/*{t("Estimated")}*/}
        {/*<Typography*/}
        {/*  component={"span"}*/}
        {/*  sx={{*/}
        {/*    fontSize: "14px",*/}
        {/*    fontWeight: "500",*/}
        {/*    color: (theme) => theme.palette.neutral[400],*/}
        {/*  }}*/}
        {/*>*/}
        {/*  (inc. VAT/TAX)*/}
        {/*</Typography>*/}
      </Typography>
    ),
  };

  return (
    <Box sx={sx}>
      {children}
      {discountDifference && isShowDiscount ? (
        <Typography
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
          {t(
            `You got ${getAmountWithSign(
              discountDifference
            )} additional discount`
          )}
        </Typography>
      ) : null}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {getText[textKey]}
        <Typography sx={{ fontSize: "22px", fontWeight: "700" }}>
          {getAmountWithSign(totalAmount)}
        </Typography>
      </Box>

      <LoadingButton
        onClick={onClick}
        sx={{
          width: "100%",
          mt: "10px",
          background: backgroundColor,
          color: color,
          border: border,
          "&:hover": hover,
        }}
        variant="contained"
        loading={isLoading ? isLoading : false}
      >
        {t(text)}
      </LoadingButton>
    </Box>
  );
};

export default RentalProceedtoCheckout;
