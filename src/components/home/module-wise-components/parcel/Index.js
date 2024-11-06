import { Grid } from "@mui/material";
import React, { useEffect } from "react";
import ParcelOnTime from "../../../parcel/ParcelOnTime";
import ParcelFeatures from "../../../parcel/ParcelFeatures";
import ParcelVideo from "../../../parcel/ParcelVideo";
import CustomContainer from "../../../container";
import ParcelCategory from "../../../parcel/parcel-category/ParcelCategory";
import { useDispatch, useSelector } from "react-redux";
import OrderDetailsModal from "../../../order-details-modal/OrderDetailsModal";
import { getToken } from "helper-functions/getToken";
import { setParcelData } from "redux/slices/parcelDeliveryInfo";

const Parcel = ({ configData }) => {
  const { orderDetailsModalOpen } = useSelector((state) => state.utilsData);
  const token = getToken();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setParcelData(null));
  }, []);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <CustomContainer>
          <ParcelCategory />
        </CustomContainer>
        <ParcelOnTime />
        <CustomContainer>
          <ParcelFeatures />
          <ParcelVideo />
        </CustomContainer>
      </Grid>
      {orderDetailsModalOpen && !token && (
        <OrderDetailsModal orderDetailsModalOpen={orderDetailsModalOpen} />
      )}
    </Grid>
  );
};

export default Parcel;
