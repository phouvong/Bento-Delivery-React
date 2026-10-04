import React from "react";
import { Box, Stack, Typography, alpha, useTheme } from "@mui/material";
import IncDecAddOn from "./IncDecAddOn";

const AddOnsManager = (props) => {
  const { t, modalData, changeAddOns, selectedAddons } = props;
  const theme = useTheme();
  const addOns = modalData?.[0]?.add_ons ?? [];
  if (addOns.length === 0) return null;
  return (
    <Box
      sx={{
        borderRadius: "12px",
        border: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
        backgroundColor: theme.palette.background.paper,
        overflow: "hidden",
      }}
    >
      <Stack
        spacing={0.25}
        sx={{
          px: { xs: 1.5, md: 2 },
          py: { xs: 1.25, md: 1.5 },
          borderBottom: `1px solid ${alpha(theme.palette.text.primary, 0.06)}`,
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "14px", md: "15px" },
            fontWeight: 700,
            color: theme.palette.text.primary,
          }}
        >
          {t("Add Ons")}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: "11px", md: "12px" },
            color: theme.palette.text.secondary,
          }}
        >
          {t("Optional extras you can add to your order")}
        </Typography>
      </Stack>
      <Stack>
        {addOns.map((item) => (
          <IncDecAddOn
            key={item?.id}
            changeAddOns={changeAddOns}
            add_on={item}
            selectedAddons={selectedAddons}
          />
        ))}
      </Stack>
    </Box>
  );
};

AddOnsManager.propTypes = {};

export default AddOnsManager;
