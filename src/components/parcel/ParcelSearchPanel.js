import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import NearMeOutlinedIcon from "@mui/icons-material/NearMeOutlined";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { t } from "i18next";
import { toast } from "react-hot-toast";
import RentalSearchLocation from "components/home/module-wise-components/rental/components/global/search/RentalSearchLocation";
import useGetAutocompletePlace from "api-manage/hooks/react-query/google-api/usePlaceAutoComplete";
import useGetPlaceDetails from "api-manage/hooks/react-query/google-api/useGetPlaceDetails";
import MapModal from "components/Map/MapModal";

const ParcelSearchPanel = () => {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { configData } = useSelector((state) => state.configData);

  const [locations, setLocations] = useState({
    ...configData?.default_location,
  });
  const [searchKey, setSearchKey] = useState("");
  const [placeId, setPlaceId] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [openMap, setOpenMap] = useState(false);

  const { data: places } = useGetAutocompletePlace(searchKey, !!searchKey);
  const { data: placeDetails } = useGetPlaceDetails(placeId, !!placeId);

  useEffect(() => {
    if (places) {
      const tempData = places?.suggestions?.map((item) => ({
        place_id: item?.placePrediction?.placeId,
        description: `${item?.placePrediction?.structuredFormat?.mainText?.text}, ${item?.placePrediction?.structuredFormat?.secondaryText?.text}`,
      }));
      setPredictions(tempData);
    }
  }, [places]);

  useEffect(() => {
    if (placeDetails?.location) {
      const next = {
        location_name: placeDetails?.formattedAddress,
        lat: placeDetails?.location?.latitude,
        lng: placeDetails?.location?.longitude,
      };
      setLocations(next);
      setSearchKey(placeDetails?.formattedAddress);
    }
  }, [placeDetails]);

  const handleLocationChange = (_event, value) => {
    if (value) {
      setPlaceId(value.place_id);
    }
  };

  const handleSearchChange = (event) => setSearchKey(event.target.value);
  const handleFocus = () => setIsFocused(true);

  const pickLocationFormAddress = (value) => {
    setSearchKey(value?.address);
    setLocations({
      lat: value?.latitude,
      lng: value?.longitude,
      location_name: value?.address,
    });
  };

  // Callback fired by MapModal once the user confirms a pin location.
  const handleLocation = (location, locationName) => {
    setLocations({
      lat: location?.lat,
      lng: location?.lng,
      location_name: locationName,
    });
    setSearchKey(locationName || "");
  };

  const handleSearchClick = () => {
    if (!searchKey || !locations?.lat || !locations?.lng) {
      toast.error(t("Please select a delivery destination!"));
      return;
    }
    router.push(
      {
        pathname: "/parcel-delivery-info",
        query: {
          lat: locations.lat,
          lng: locations.lng,
          location: locations.location_name,
        },
      },
      undefined,
      { shallow: true }
    );
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      gap={{ xs: 1, sm: 1.5 }}
      sx={{
        width: "100%",
        "& .MuiAutocomplete-root": {
          width: "100%",
          flex: 1,
        },
        "& .MuiOutlinedInput-root": {
          height: "48px !important",
          minHeight: "48px",
          maxHeight: "48px",
          boxSizing: "border-box",
          borderRadius: "9999px !important",
          backgroundColor: theme.palette.background.secondary,
          fontSize: "16px",
          fontFamily: "'DM Sans', sans-serif",
          color: theme.palette.text.primary,
          lineHeight: 1.3,
          paddingLeft: "18px !important",
          paddingRight: "18px !important",
          paddingTop: "0 !important",
          paddingBottom: "0 !important",
          gap: "8px",
          "& fieldset": {
            border: "none",
            top: 0,
          },
          "&:hover fieldset": { border: "none" },
          "&.Mui-focused fieldset": { border: "none" },
          "& fieldset>legend": { display: "none" },
        },
        "& .MuiOutlinedInput-input": {
          padding: "0 !important",
          height: "48px",
          boxSizing: "border-box",
          fontSize: "16px",
          color: theme.palette.text.primary,
          lineHeight: "48px",
        },
        "& .MuiInputLabel-root": { display: "none" },
        "& .MuiInputAdornment-root": {
          margin: 0,
          height: "auto",
          maxHeight: "none",
        },
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0, width: "100%" }}>
        <RentalSearchLocation
          fromHome
          getCurrentLocation={pickLocationFormAddress}
          pickLocationFormAddress={pickLocationFormAddress}
          predictions={predictions}
          handleChange={handleLocationChange}
          HandleChangeForSearch={handleSearchChange}
          label={t("Where to deliver?")}
          height="48px"
          onFocus={handleFocus}
          value={{ description: searchKey }}
          width="100%"
          isFocused={isFocused}
          focusedField="destination"
          setOpenMap={setOpenMap}
          startIcon={
            <NearMeOutlinedIcon
              sx={{
                color: theme.palette.text.primary,
                fontSize: "18px",
              }}
            />
          }
        />
      </Box>

      {isMobile ? (
        <IconButton
          onClick={handleSearchClick}
          sx={{
            width: "40px",
            height: "40px",
            flexShrink: 0,
            borderRadius: "9999px",
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            "&:hover": { backgroundColor: theme.palette.primary.dark },
          }}
        >
          <i
            className="fi fi-rr-search"
            style={{
              fontSize: "16px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: 1,
            }}
          />
        </IconButton>
      ) : (
        <Button
          variant="contained"
          onClick={handleSearchClick}
          sx={{
            borderRadius: "9999px",
            height: "48px",
            px: "28px",
            fontWeight: 700,
            fontSize: "16px",
            letterSpacing: "-0.48px",
            textTransform: "capitalize",
            whiteSpace: "nowrap",
            flexShrink: 0,
            boxShadow: "none",
            "&:hover": { boxShadow: "none" },
          }}
        >
          {t("Search Deliveryman")}
        </Button>
      )}

      {openMap && (
        <MapModal
          open={openMap}
          handleClose={() => setOpenMap(false)}
          handleLocation={handleLocation}
          toparcel="1"
          fromReceiver="1"
        />
      )}
    </Stack>
  );
};

export default ParcelSearchPanel;
