import React from 'react';
import {IconButton, Typography} from "@mui/material";
import {Clear} from "@mui/icons-material";
import {Stack} from "@mui/system";
import Box from "@mui/material/Box";
import {t} from "i18next";

const ReviewModal = () => {
  return (
    <Box
      sx={{
        width: "462px",
        maxWidth: "100%",
        p: 3,
        position: "relative",
        mx: "auto",
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
        boxShadow: theme.shadows[3],
      }}
    >
      {/* Close Icon */}
      <IconButton
        onClick={handleClose}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          color: theme.palette.text.primary,
        }}
      >
        <Clear sx={{ height: "16px" }} />
      </IconButton>

      <Stack mt={3}>
        <Stack alignItems="center" textAlign="center">
          <Typography variant="h6" mb={1}>
            {t("How was your Trip")}?
          </Typography>
          <Typography variant="body2">
            {t("Give us your valuable review")}
          </Typography>
        </Stack>
      </Stack>
    </Box>


  );
};

export default ReviewModal;