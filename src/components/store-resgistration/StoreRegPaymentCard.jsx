import React from "react";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { Stack } from "@mui/system";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { alpha, Typography } from "@mui/material";
import CustomImageContainer from "components/CustomImageContainer";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const StoreRegPaymentCard = ({ method, selectedMethod, setSelectedMethod }) => {
  const handleSelect = () => {
    // Toggle the selection
    setSelectedMethod((prevMethod) =>
      prevMethod === method?.gateway ? null : method?.gateway
    );
  };

  return (
    <CustomStackFullWidth
      maxWidth="340px"
      width="100%"
      sx={{
        padding: "10px",
        border: "1px solid",
        borderColor: (theme) => alpha(theme.palette.neutral[400], 0.4),
        borderRadius: "8px",
        cursor: "pointer", // Change cursor to pointer to indicate clickability
      }}
      justifyContent="center"
      onClick={handleSelect}
    >
      <Stack
        direction="row"
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
      >
        <Stack direction="row" spacing={1}>
          {selectedMethod === method?.gateway ? (
            <CheckCircleIcon
              sx={{ color: (theme) => theme.palette.primary.main }}
            />
          ) : (
            <RadioButtonUncheckedIcon
              sx={{ color: (theme) => alpha(theme.palette.neutral[400], 0.4) }}
            />
          )}

          <Typography>{method?.gateway_title}</Typography>
        </Stack>
        <CustomImageContainer
          src={method?.gateway_image_full_url}
          width="31px"
          alignItems="center"
        />
      </Stack>
    </CustomStackFullWidth>
  );
};

export default StoreRegPaymentCard;
