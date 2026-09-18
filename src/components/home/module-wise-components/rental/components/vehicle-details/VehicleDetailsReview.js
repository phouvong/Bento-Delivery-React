import RentalCardWrapper from "../global/RentalCardWrapper";

import { t } from "i18next";

import TabsTypeOne from "components/custom-tabs/TabsTypeOne";
import { useSelector } from "react-redux";
import { setCurrentTab } from "redux/slices/utils";
import { useState } from "react";
import DetailsAndReviews from "components/product-details/details-and-reviews/DetailsAndReviews";
import { Box } from "@mui/material";
const VehicleDetailsReview = ({ vehicleDetails }) => {
  return (
    <Box sx={{ mt: "40px" }}>
      <DetailsAndReviews
        // configData={configData}
        description={vehicleDetails?.description}
        reviews={vehicleDetails?.reviews}
        productId={vehicleDetails?.id}
        showBackground={false}
        tabsData={["Vehicle Details", "Reviews"]}
        // storename={productDetailsData?.store_details?.name}
      />
    </Box>
  );
};

export default VehicleDetailsReview;
