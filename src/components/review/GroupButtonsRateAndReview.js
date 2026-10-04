import React from "react";
import { Box, Tab, Tabs } from "@mui/material";
import { useTranslation } from "react-i18next";

const GroupButtonsRateAndReview = ({ setType, type, moduleType }) => {
  const { t } = useTranslation();

  const handleChange = (event, newValue) => {
    setType(newValue);
  };

  return (
    <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
      <Tabs
        value={type}
        onChange={handleChange}
        centered
        indicatorColor="primary"
        textColor="primary"
      >
        {moduleType !== "parcel" && (
          <Tab label={t("Items")} value="items" />
        )}
        <Tab label={t("Delivery man")} value="delivery_man" />
      </Tabs>
    </Box>
  );
};

GroupButtonsRateAndReview.propTypes = {};

export default GroupButtonsRateAndReview;
