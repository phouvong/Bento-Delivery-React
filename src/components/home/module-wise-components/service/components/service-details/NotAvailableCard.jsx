import React from "react";
import { Typography, Box, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";

const NotAvailableCard = () => {
  const { t } = useTranslation();
  return (
    <Box textAlign="center">
      <Stack spacing={1} alignItems="flex-start">
        <Typography
          color={(theme) => theme.palette.primary.main}
          variant="h5"
        >
          {t("Store is closed.")}
        </Typography>
      </Stack>
    </Box>
  );
};
export default NotAvailableCard;
