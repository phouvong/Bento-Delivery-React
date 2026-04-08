import React, { useState } from "react";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import CustomImageContainer from "./CustomImageContainer";
import locationImage from "../../public/static/fi_854878.svg";
import { Button, Typography, useTheme } from "@mui/material";
import { t } from "i18next";
import { useGeolocated } from "react-geolocated";
import dynamic from "next/dynamic";
const MapModal = dynamic(() => import("./Map/MapModal"));
const GetLocationAlert = ({ setOpenAlert }) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const { coords } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
    isGeolocationEnabled: true,
  });
  const handleOpen = (e) => {
    e.stopPropagation();
    setOpen(true);
    //setOpenAlert(false);
  };
  console.log({coords});
  
  return (
    <CustomStackFullWidth
      p="1rem"
      justifyContent="center"
      alignItems="center"
      spacing={2}
      sx={{maxWidth:"437px"}}
    >
      <CustomImageContainer
        src={locationImage.src}
        width="70px"
        height="70px"
      />
      <Typography variant="h5" color={theme.palette.neutral[1000]}>
        {t("Insert delivery location")}
      </Typography>
      <Typography
        variant="subtitle2"
        color={theme.palette.neutral[400]}
        textAlign="center"
      >
        {t(
          "Please add your  delivery location so we can check whether the store delivers to your area.  "
        )}
      </Typography>
      <Button variant="contained" onClick={(e) => handleOpen(e)}>
        {t("Pick from Map")}
      </Button>

      {open && (
        <MapModal
          open={open}
          handleClose={() => setOpen(false)}
          coords={coords}
          disableAutoFocus
          fromStore
          //selectedLocation={coords}
        />
      )}
    </CustomStackFullWidth>
  );
};

export default GetLocationAlert;
