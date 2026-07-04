import React from "react";
import PropTypes from "prop-types";
import { alpha, Stack, Typography, useTheme } from "@mui/material";
import { CustomStackFullWidth } from "../../../styled-components/CustomStyles.style";
import { t } from "i18next";
import {
  getAmountWithSign,
  getDiscountedAmount,
} from "../../../helper-functions/CardHelpers";
import { Box } from "@mui/system";

const QuantityButton = ({ onClick, disabled, icon, ariaLabel, theme }) => (
  <Box
    role="button"
    aria-label={ariaLabel}
    aria-disabled={disabled}
    onClick={disabled ? undefined : onClick}
    sx={{
      width: 36,
      height: 36,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "8px",
      cursor: disabled ? "not-allowed" : "pointer",
      color: disabled
        ? alpha(theme.palette.text.secondary, 0.4)
        : theme.palette.neutral?.[1050] ?? theme.palette.text.primary,
      transition: "color 0.15s ease",
      flexShrink: 0,
      "&:hover": disabled
        ? undefined
        : { backgroundColor: theme.palette.action.hover },
    }}
  >
    <i
      className={icon}
      style={{ fontSize: "16px", display: "flex", lineHeight: 1 }}
    />
  </Box>
);

const IncrementDecrementManager = (props) => {
  const { decrementQuantity, incrementQuantity, modalData, productUpdate } =
    props;
  const theme = useTheme();

  const totalAmount = modalData
    ? getAmountWithSign(
        getDiscountedAmount(
          modalData?.totalPrice,
          modalData?.discount,
          modalData?.discount_type,
          modalData?.store_discount,
          modalData?.quantity
        )
      )
    : "";

  return (
    <CustomStackFullWidth>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          px: { xs: 1.5, md: 1.5 },
          py: { xs: 1, md: 1.25 },
          
          borderRadius: "10px",
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="baseline">
          <Typography
            sx={{
              fontSize: { xs: "13px", md: "14px" },
              fontWeight: 500,
              color: theme.palette.text.secondary,
            }}
          >
            {t("Total")}
          </Typography>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: "16px", md: "18px" },
              color: theme.palette.text.primary,
            }}
          >
            {totalAmount}
          </Typography>
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          gap="4px"
          sx={{
            p: "4px",
            backgroundColor: theme.palette.background.secondary,
            borderRadius: "8px",
            flexShrink: 0,
          }}
        >
          <QuantityButton
            onClick={decrementQuantity}
            disabled={modalData?.totalPrice === 0 || modalData?.quantity <= 1}
            icon="fi fi-rr-minus-small"
            ariaLabel="decrease quantity"
            theme={theme}
          />
          <Box
            sx={{
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: theme.palette.background.paper,
              borderRadius: "6px",
              flexShrink: 0,
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "18px",
                letterSpacing: "-0.54px",
                lineHeight: 1.1,
                fontVariantNumeric: "tabular-nums",
                color: "neutral.1050",
                userSelect: "none",
              }}
            >
              {modalData?.quantity}
            </Typography>
          </Box>
          <QuantityButton
            onClick={incrementQuantity}
            icon="fi fi-rr-plus-small"
            ariaLabel="increase quantity"
            theme={theme}
          />
        </Stack>
      </Stack>
    </CustomStackFullWidth>
  );
};

IncrementDecrementManager.propTypes = {};

export default IncrementDecrementManager;
