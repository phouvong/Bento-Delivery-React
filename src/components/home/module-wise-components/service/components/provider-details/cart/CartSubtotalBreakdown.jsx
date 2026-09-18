import React from "react";
import { Collapse, Stack, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

import { getAmountWithSign } from "helper-functions/CardHelpers";

const CartSubtotalBreakdown = ({
  collapsed,
  subtotal,
  originalSubtotal,
  showOriginalSubtotal,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Collapse in={!collapsed} timeout={250} unmountOnExit>
      <Stack
        spacing={0.75}
        sx={{
          pb: 1,
          mb: 0.5,
          borderBottom: `1px dashed ${theme.palette.divider}`,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography sx={{ fontSize: "13px", color: theme.palette.text.secondary }}>
            {t("Items Total")}
          </Typography>
          <Typography
            sx={{
              fontSize: "13px",
              fontWeight: 600,
              color: theme.palette.text.primary,
            }}
          >
            {getAmountWithSign(originalSubtotal || subtotal)}
          </Typography>
        </Stack>
        {showOriginalSubtotal && (
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography sx={{ fontSize: "13px", color: theme.palette.text.secondary }}>
              {t("Item Discount")}
            </Typography>
            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: 600,
                color: theme.palette.success.main,
              }}
            >
              -{getAmountWithSign(Number(originalSubtotal) - Number(subtotal))}
            </Typography>
          </Stack>
        )}
      </Stack>
    </Collapse>
  );
};

export default CartSubtotalBreakdown;
