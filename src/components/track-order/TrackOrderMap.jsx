import React from "react";
import { Stack } from "@mui/system";
import MapComponent from "components/Map/location-view/MapComponent";
import { IconButton } from "@mui/material";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";

const TrackOrderMap = ({
  trackOrderData,
  userLocation,
  getCurrentLocation,
}) => {
  return (
    <Stack
      paddingInline={{ xs: "0px", md: "25px" }}
      position="relative"
      width="100%"
    >
      <MapComponent
        latitude={userLocation.lat}
        longitude={userLocation?.lng}
        deliveryManLat={
          trackOrderData?.order_status === "picked_up"
            ? trackOrderData?.delivery_man?.latitude
            : trackOrderData?.store?.latitude
        }
        deliveryManLng={
          trackOrderData?.order_status === "picked_up"
            ? trackOrderData?.delivery_man?.longitude
            : trackOrderData?.store?.longitude
        }
        isStore={trackOrderData?.order_status === "picked_up" ? false : true}
      />
      <IconButton
        onClick={getCurrentLocation}
        sx={{
          position: "absolute",
          bottom: "3%",
          right: "3%",
          borderRadius: "50%",
          color: (theme) => theme.palette.primary.main,
          backgroundColor: "background.paper",
        }}
      >
        <GpsFixedIcon sx={{ fontSize: { xs: "18px", md: "24px" } }} />
      </IconButton>
    </Stack>
  );
};

export default TrackOrderMap;
