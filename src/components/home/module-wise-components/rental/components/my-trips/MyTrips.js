import React from "react";
import {
  CustomPaperBigCard,
  CustomStackFullWidth,
} from "../../../../../../styled-components/CustomStyles.style";
import { useTranslation } from "react-i18next";
import { Typography } from "@mui/material";

const MyTrips = () => {
  const { t } = useTranslation();
  return (
    <CustomStackFullWidth spacing={3}>
      <CustomPaperBigCard>
        <Typography align="center" fontSize="16px">
          {t("No trips found")}
        </Typography>
      </CustomPaperBigCard>
    </CustomStackFullWidth>
  );
};

export default MyTrips;
