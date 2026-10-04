import React, { useEffect, useState } from "react";
import CustomModal from "../../modal";
import { IconButton, Paper, Stack, Typography, useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { CustomStackFullWidth } from "../../../styled-components/CustomStyles.style";
import MapComponent from "./MapComponent";
import { Box } from "@mui/system";
import CustomImageContainer from "components/CustomImageContainer";
import DirectionsIcon from "@mui/icons-material/Directions";
import { RoundedIconButton } from "components/product-details/product-details-section/ProductsThumbnailsSettings";
import { useGeolocated } from "react-geolocated";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";

const LocationViewOnMap = (props) => {
  const {
    open,
    handleClose,
    latitude,
    longitude,
    address,
    storeDetails,
    isFooter,
  } = props;

  const theme = useTheme();
  const [userLocation, setUserLocation] = useState({});
  const [userAddress, setUserAddress] = useState("");
  const [rerenderMap, setRerenderMap] = useState(false);
  const { coords } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
    isGeolocationEnabled: true,
  });
  const openMapHandler = (open) => {};
  const openGoogleMaps = () => {
    if (
      (storeDetails?.latitude && storeDetails?.longitude && currentLatLng?.lat,
      currentLatLng?.lng)
    ) {
      const origin = `${storeDetails.latitude},${storeDetails.longitude}`;
      const destination = `${userLocation?.lat},${userLocation?.lng}`;
      const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
      window.open(url, "_blank");
    }
  };
  let currentLatLng = undefined;
  let storedAddress = "";
  if (typeof window !== "undefined") {
    currentLatLng = JSON.parse(window.localStorage.getItem("currentLatLng"));
    storedAddress = window.localStorage.getItem("location") || "";
  }
  useEffect(() => {
    setUserLocation(currentLatLng);
    setUserAddress(storedAddress);
  }, []);

  const handleCurrentLocation = () => {
    if (coords) {
      setUserLocation({ lat: coords?.latitude, lng: coords?.longitude });
    }
    setRerenderMap((prvMap) => !prvMap);
  };

  return (
    <CustomModal openModal={open} handleClose={handleClose}>
      <Paper
        sx={{
          position: "relative",
          width: { xs: "100%", sm: "450px", md: "550px" },
          p: "15px",
        }}
      >
        <IconButton
          onClick={() => handleClose()}
          sx={{
            position: "absolute",
            top: 5,
            right: 5,
            backgroundColor: theme.palette.whiteContainer.main,
            zIndex: 100,
            padding: "5px",
            borderRadius: "50%",
          }}
        >
          <CloseIcon sx={{ fontSize: "16px" }} />
        </IconButton>
        <CustomStackFullWidth spacing={1}>
          {storeDetails?.address && (
            <Typography
              sx={{
                fontSize: { xs: "12px", md: "13px" },
                fontWeight: 500,
                color: theme.palette.text.secondary,
                px: "4px",
                pt: "2px",
                pb: "4px",
                wordBreak: "break-word",
                lineHeight: 1.4,
              }}
            >
              {storeDetails?.address}
            </Typography>
          )}
          <Stack position="relative">
            <MapComponent
              latitude={latitude}
              longitude={longitude}
              deliveryManLat={userLocation?.lat}
              deliveryManLng={userLocation?.lng}
              isFooter={isFooter}
              resAddress={storeDetails?.address}
              userAddress={userAddress}
            />
            {/*<RoundedIconButton*/}
            {/*  sx={{*/}
            {/*    padding: "10px",*/}
            {/*    position: "absolute",*/}

            {/*    right: "10px",*/}
            {/*    bottom: "20px",*/}
            {/*  }}*/}
            {/*  onClick={handleCurrentLocation}*/}
            {/*>*/}
            {/*  <GpsFixedIcon color="primary" />*/}
            {/*</RoundedIconButton>*/}
          </Stack>
        </CustomStackFullWidth>
      </Paper>
    </CustomModal>
  );
};

LocationViewOnMap.propTypes = {};

export default LocationViewOnMap;
