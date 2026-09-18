import { IconButton, Stack, Typography } from "@mui/material";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import { alpha, Box } from "@mui/system";
import React from "react";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";

const CardDetailsSingleCard = ({
  children,
  icon,
  isShowEdit = true,
  onClickEdit,
  sx,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: "10px",
        alignItems: "center",
        p: "15px",
        ...sx,
      }}
    >
      <Box
        sx={{
          background: (theme) => alpha(theme.palette.neutral[200], 0.6),
          width: "32px",
          height: "32px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "5px",
        }}
      >
        {icon}
      </Box>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default CardDetailsSingleCard;
