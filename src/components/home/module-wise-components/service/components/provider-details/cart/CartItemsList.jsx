import React from "react";
import { Stack, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

import CartItemRow from "./CartItemRow";

const CartItemsList = ({ moduleCartList, rowSpacingTop = 0 }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Stack
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <Typography
        sx={{
          fontSize: "13px",
          fontWeight: 700,
          color: theme.palette.text.primary,
          pt: 1.5,
          px: 1.5,
          pb: 0.5,
        }}
      >
        {t("Items")}
      </Typography>
      <Stack>
        {moduleCartList.map((item) => (
          <CartItemRow
            key={item?.cartItemId || item?.id}
            cartItem={item}
            spacingTop={rowSpacingTop}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export default CartItemsList;
