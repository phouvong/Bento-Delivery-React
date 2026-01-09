import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import GoogleMapComponent from "components/Map/GoogleMapComponent";
import { useSelector } from "react-redux";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import useGetGeoCode from "api-manage/hooks/react-query/google-api/useGetGeoCode";
import useGetPlaceDetails from "api-manage/hooks/react-query/google-api/useGetPlaceDetails";
import { useGeolocated } from "react-geolocated";
import useGetAutocompletePlace from "api-manage/hooks/react-query/google-api/usePlaceAutoComplete";
import useGetZoneId from "api-manage/hooks/react-query/google-api/useGetZone";
import useGetCheckZone from "api-manage/hooks/react-query/google-api/useGetCheckZone";
import { toast } from "react-hot-toast";
import CustomMapSearch from "components/Map/CustomMapSearch";
import { CustomTypography } from "components/landing-page/hero-section/HeroSection.style";
import ModalExtendShrink from "components/Map/ModalExtendShrink";

const MapForRestaurantJoin = ({
  handleLocation,
  zoneId,
  polygonPaths,
  inZoom,
  restaurantAddressHandler,
  setInZone,
  searchHeight,
  zoneHandler,
  fromVendor,
  showZoneWarning,
  setShowZoneWarning,
  inZone
}) => {
  const theme = useTheme();
  const { configData } = useSelector((state) => state.configData);

  const [locationEnabled, setLocationEnabled] = useState(false);
  const [location, setLocation] = useState(
    configData && configData?.default_location
  );
  const [searchKey, setSearchKey] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [placeDetailsEnabled, setPlaceDetailsEnabled] = useState(true);
  const [placeDescription, setPlaceDescription] = useState(undefined);
  const [predictions, setPredictions] = useState([]);
  const [placeId, setPlaceId] = useState("");
  const [isModalExpand, setIsModalExpand] = useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    setLocation({
      lat: configData?.default_location?.lat,
      lng: configData?.default_location?.lng,
    });
  }, [configData?.default_location]);
  const { coords, isGeolocationAvailable, isGeolocationEnabled, getPosition } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      userDecisionTimeout: 5000,
      isGeolocationEnabled: true,
    });

  const { data: places, isLoading } = useGetAutocompletePlace(
    searchKey,
    enabled
  );

  useEffect(() => {
    if (places) {
      const tempData = places?.suggestions?.map((item) => ({
        place_id: item?.placePrediction?.placeId,
        description: `${item?.placePrediction?.structuredFormat?.mainText?.text}, ${item?.placePrediction?.structuredFormat?.secondaryText?.text}`,
      }));
      setPredictions(tempData);
    }
  }, [places]);
  const zoneIdEnabled = locationEnabled;
  const { data: zoneData } = useGetZoneId(location, zoneIdEnabled);
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (zoneData) {
        localStorage.setItem("zoneid", zoneData?.zone_id);
        if (zoneData?.zone_id && zoneData?.zone_data?.[0]?.id) {
          zoneHandler?.(zoneData?.zone_data?.[0]?.id);
        }
      }
    }
  }, [zoneData]);
  const { isLoading: isLoading2, data: placeDetails } = useGetPlaceDetails(
    placeId,
    placeDetailsEnabled
  );
  //

  useEffect(() => {
    if (placeDetails) {
      setLocation({
        lat: placeDetails?.location?.latitude,
        lng: placeDetails?.location?.longitude,
      });
      setLocationEnabled(true);
    }
  }, [placeDetails]);
  const successHandler = (res) => {
    setInZone(res);

    if (!res && res !== undefined) {
      setShowZoneWarning(true);
      zoneHandler?.(null);
      //restaurantAddressHandler?.(null);
    } else {
      setShowZoneWarning(false);
    }
  };
  const { data: checkedData } = useGetCheckZone(
    location,
    zoneId,
    successHandler
  );
  const { data: geoCodeResults, isFetching: isFetchingGeoCodes } =
    useGetGeoCode(location);
  useEffect(() => {
    if (showZoneWarning) {
      restaurantAddressHandler?.(null);
    } else if (polygonPaths?.length > 0) {
      restaurantAddressHandler(geoCodeResults?.results[0]?.formatted_address);
    }

    handleLocation(location);
  }, [geoCodeResults, showZoneWarning, polygonPaths]);

  const HandleChangeForSearch = (event) => {
    if (event.target.value) {
      setSearchKey(event.target.value);
      setEnabled(true);
      setPlaceDetailsEnabled(true);
    }
  };
  const handleChange = (event, value) => {
    if (value) {
      setPlaceId(value?.place_id);
    }
    setPlaceDetailsEnabled(true);
  };
  const handleCloseLocation = () => {
    setPredictions([]);
  };
  console.log({inZone,showZoneWarning});
  return (
    <CustomStackFullWidth>
      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          padding: { xs: ".75rem", sm: "1rem" },
          borderRadius: { xs: ".25rem", sm: "10px" },
        }}>
        <Stack mb={2}>
          <Typography
            variant="body1"
            fontWeight={500}
            mb={".125rem"}
          >
            {t("Set Your Business Location on Map")}
          </Typography>
          <Typography
            variant="body2"
            fontSize="0.625rem !important"
          >
            {t("Please mark the exact location of your business so customers can easily find you.")}
          </Typography>
        </Stack>
        <CustomStackFullWidth sx={{ position: "relative" }}>
          <CustomStackFullWidth
            sx={{
              right: "10px",
              position: "absolute",
              zIndex: 999,
              maxWidth: "250px",
              top: "10px",
            }}
          >
            <CustomMapSearch
              newMap
              handleCloseLocation={handleCloseLocation}
              frommap="false"
              setSearchKey={setSearchKey}
              setEnabled={setEnabled}
              predictions={predictions}
              setPlaceId={setPlaceId}
              setPlaceDetailsEnabled={setPlaceDetailsEnabled}
              setPlaceDescription={setPlaceDescription}
              HandleChangeForSearch={HandleChangeForSearch}
              handleChange={handleChange}
              searchHeight={searchHeight}
            />
          </CustomStackFullWidth>
          <GoogleMapComponent
            setLocation={setLocation}
            location={location}
            setPlaceDetailsEnabled={setPlaceDetailsEnabled}
            placeDetailsEnabled={placeDetailsEnabled}
            locationEnabled={locationEnabled}
            setPlaceDescription={setPlaceDescription}
            setLocationEnabled={setLocationEnabled}
            height="250px"
            polygonPaths={polygonPaths}
            inZoom={inZoom}
            isModalExpand={isModalExpand}
            setIsModalExpand={setIsModalExpand}
            fromVendor={fromVendor}

          />
          <CustomStackFullWidth
            sx={{
              position: "absolute",
              bottom: "44%",
              left: { xs: "6%", sm: "3%" },
              right: "0px",
              zIndex: 999,
              maxWidth: "35px",
            }}
          >
            <ModalExtendShrink
              isModalExpand={isModalExpand}
              setIsModalExpand={setIsModalExpand}
              t={t}
            />
          </CustomStackFullWidth>
          {showZoneWarning || !inZone ? (
            <Box
              sx={{
                position: "absolute",
                bottom: "4%",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: theme.palette.neutral[800],
                padding: "8px 12px",
                borderRadius: ".5rem",
                gap: "5px",
                width: "max-content",
                maxWidth: "95%",
              }}
            >
              <ErrorIcon sx={{ color: theme.palette.warning.main, fontSize: "20px" }} />
              <Typography
                variant="body2"
                sx={{ color: theme.palette.neutral[100], fontSize: "12px", fontWeight: 500 }}
              >
                {t("Please place the marker inside the available zones.")}
              </Typography>
            </Box>
          ) : (
            <CustomStackFullWidth
              sx={{
                position: "absolute",
                bottom: "4%",
                left: "0",
                right: "0",
                zIndex: 999,
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Stack direction="row" spacing={{ xs: 1, sm: 2 }} backgroundColor={theme.palette.neutral[100]} paddingX='5px' borderRadius='3px'>
                <CustomTypography sx={{ fontSize: { xs: '10px', sm: '12px' } }}>Latitude: {Number(location?.lat)?.toFixed(7)}</CustomTypography>
                <CustomTypography sx={{ fontSize: { xs: '10px', sm: '12px' } }}>Longitude: {Number(location?.lng)?.toFixed(7)}</CustomTypography>
              </Stack>
            </CustomStackFullWidth>
          )}
        </CustomStackFullWidth>
      </Box>
    </CustomStackFullWidth>
  );
};
export default MapForRestaurantJoin;
