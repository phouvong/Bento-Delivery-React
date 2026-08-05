import React from "react";
import RentalCarFilterSection from "../rentalfilter/RentalCarFilterSection";
import CustomContainer from "components/container";
import { Box } from "@mui/material";

const RentalFilterLayout = ({ isSticky, topContent, api_endpoint }) => {
  return (
    <Box>
      {topContent}
      <CustomContainer>
        <RentalCarFilterSection
          isSticky={isSticky}
          api_endpoint={api_endpoint}
        />
      </CustomContainer>
    </Box>
  );
};

export default RentalFilterLayout;
