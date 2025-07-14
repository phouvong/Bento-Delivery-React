import React, { useEffect, useState } from "react";
import CustomTextFieldWithFormik from "../form-fields/CustomTextFieldWithFormik";
import { useTranslation } from "react-i18next";
import CustomSelectWithFormik from "../custom-select/CustomSelectWithFormik";
import { Grid, Stack, useTheme } from "@mui/material";
import { useQuery } from "react-query";
import { GoogleApi } from "api-manage/hooks/react-query/googleApi";
import { CustomBoxFullWidth } from "components/chat/Chat.style";
import GoogleMapComponent from "components/Map/GoogleMapComponent";
import { useSelector } from "react-redux";
import ImageSection from "components/store-resgistration/ImageSection";
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
}) => {
  const { configData } = useSelector((state) => state.configData);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [location, setLocation] = useState(
    configData && configData?.default_location
  );
  const theme = useTheme();
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
        // dispatch(setZoneData(zoneData?.data?.zone_data));
        localStorage.setItem("zoneid", zoneData?.zone_id);
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
      toast.error("Out Of The Zone");
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
    if (polygonPaths?.length > 0) {
      restaurantAddressHandler(geoCodeResults?.results[0]?.formatted_address);
    } else {
    }

    handleLocation(location);
  }, [geoCodeResults]);

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
  return (
    <CustomStackFullWidth>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
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
            />
            <CustomStackFullWidth
              sx={{
                position: "absolute",
                bottom: "42%",
                left: "3%",
                right: "0px",
                zIndex: 999,
              }}
            >
              <ModalExtendShrink
                    isModalExpand={isModalExpand}
                    setIsModalExpand={setIsModalExpand}
                    t={t}
                  />
            </CustomStackFullWidth>
            <CustomStackFullWidth
  sx={{
    position: "absolute",
    bottom: "4%",
    left: "0", // Change from 3% to 0
    right: "0", // Already set to 0
    zIndex: 999,
    display: "flex",
    justifyContent: "center", // Add this line to center content horizontally
    // You can also add alignItems to center vertically if needed
    alignItems: "center"
  }}
>
 <Stack direction="row" spacing={2} backgroundColor={theme.palette.neutral[100]} paddingX='5px' borderRadius='3px'>
  <CustomTypography sx={{fontSize:'12px'}}>Latitude: {Number(location?.lat)?.toFixed(7)}</CustomTypography>
  <CustomTypography sx={{fontSize:'12px'}}>Longitude: {Number(location?.lng)?.toFixed(7)}</CustomTypography>
 </Stack>
</CustomStackFullWidth>
          </CustomStackFullWidth>
        </Grid>
      </Grid>
    </CustomStackFullWidth>
  );
};
export default MapForRestaurantJoin;
