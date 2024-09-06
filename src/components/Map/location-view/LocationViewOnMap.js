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
  if (typeof window !== "undefined") {
    currentLatLng = JSON.parse(window.localStorage.getItem("currentLatLng"));
  }
  useEffect(() => {
    setUserLocation(currentLatLng);
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
          width: { xs: "300px", sm: "450px", md: "550px" },
          // height:{md:"500px"},
          // p: { xs: "10px", sm: "15px", md: "20px" },
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
        <CustomStackFullWidth>
          {!isFooter && (
            <Stack mb="10px">
              <CustomImageContainer
                src={storeDetails?.cover_photo_full_url}
                objectfit="cover"
                height="200px"
              />
              <Stack mt="10px" direction="row" justifyContent="space-between">
                <Stack>
                  <Typography fontSize="18px" fontWeight={500}>
                    {storeDetails?.name}
                  </Typography>
                  <Typography fontSize="14px" fontWeight={500}>
                    {address}
                  </Typography>
                </Stack>
                <RoundedIconButton onClick={openGoogleMaps}>
                  <DirectionsIcon color="primary" />
                </RoundedIconButton>
              </Stack>
            </Stack>
          )}

          <Stack position="relative">
            <MapComponent
              latitude={latitude}
              longitude={longitude}
              deliveryManLat={userLocation?.lat}
              deliveryManLng={userLocation?.lng}
              isFooter={isFooter}
            />
            <RoundedIconButton
              sx={{
                padding: "10px",
                position: "absolute",

                right: "10px",
                bottom: "20px",
              }}
              onClick={handleCurrentLocation}
            >
              <GpsFixedIcon color="primary" />
            </RoundedIconButton>
          </Stack>
        </CustomStackFullWidth>
      </Paper>
    </CustomModal>
  );
};

LocationViewOnMap.propTypes = {};

export default LocationViewOnMap;
