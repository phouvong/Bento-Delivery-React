import React from "react";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import CustomMessageReasonBox from "components/my-orders/order-details/other-order/CustomMessageReasonBox";
import { Typography, useTheme } from "@mui/material";
import { t } from "i18next";

const CustomMessagesBox = ({ selected, handleClick, automateMessageData }) => {
  const theme = useTheme();
  const handleStopPropagation = (event) => {
    event.stopPropagation(); // This will prevent the Tooltip from closing
    event.preventDefault();
  };

  return (
    <CustomStackFullWidth
      onClick={(event) => handleStopPropagation(event)}
      sx={{ padding: "36px" }}
      spacing={1}
    >
      <Typography
        fontSize="16px"
        fontWeight="500"
        color={theme.palette.neutral[1000]}
        textAlign="center"
      >
        {t("Choose the Reason for Support")}
      </Typography>
      <CustomMessageReasonBox
        automateMessageData={automateMessageData}
        selected={selected}
        handleClick={handleClick}
      />
    </CustomStackFullWidth>
  );
};

export default CustomMessagesBox;
