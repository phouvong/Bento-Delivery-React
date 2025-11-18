import React, { useEffect, useId, useRef, useState } from "react";
import {
  alpha,
  Grid,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { CustomStackFullWidth } from "../../../styled-components/CustomStyles.style";
import {
  HeroFormInputWrapper,
  HeroFormItem,
  StyledButton,
} from "./HeroSection.style";
import { useGeolocated } from "react-geolocated";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import useGetAutocompletePlace from "../../../api-manage/hooks/react-query/google-api/usePlaceAutoComplete";
import useGetGeoCode from "../../../api-manage/hooks/react-query/google-api/useGetGeoCode";
import useGetZoneId from "../../../api-manage/hooks/react-query/google-api/useGetZone";
import useGetPlaceDetails from "../../../api-manage/hooks/react-query/google-api/useGetPlaceDetails";
import AllowLocationDialog from "../../Map/AllowLocationDialog";
import CustomMapSearch from "../../Map/CustomMapSearch";
import { ModuleSelection } from "./module-selection";
import { useDispatch } from "react-redux";
import { module_select_success } from "utils/toasterMessages";
import { setWishList } from "redux/slices/wishList";
import { useWishListGet } from "api-manage/hooks/react-query/wish-list/useWishListGet";
import { getToken } from "helper-functions/getToken";
import { Box } from "@mui/system";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MapIcon from "@mui/icons-material/Map";
import { getLanguage } from "helper-functions/getLanguage";
import SearchIcon from "@mui/icons-material/Search";
import MapMarkerIcon from "../assets/MapMarkerIcon";
import dynamic from "next/dynamic";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
const MapModal = dynamic(() => import("../../Map/MapModal"));
const HeroLocationForm = () => {
  const theme = useTheme();
  const isXSmall = useMediaQuery(theme.breakpoints.down(600));
  const { t } = useTranslation();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState(undefined);
  const [geoLocationEnable, setGeoLocationEnable] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [openLocation, setOpenLocation] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(undefined);
  const [showCurrentLocation, setShowCurrentLocation] = useState(false);
  const [zoneIdEnabled, setZoneIdEnabled] = useState(false);
  const [placeId, setPlaceId] = useState("");
  const [placeDescription, setPlaceDescription] = useState(undefined);
  const [placeDetailsEnabled, setPlaceDetailsEnabled] = useState(false);
  const [openModuleSelection, setOpenModuleSelection] = useState(false);
  const [pickLocation, setPickLocation] = useState(false);
  const [isSelectedByGps, setIsSelectedByGps] = useState(false);
  const dispatch = useDispatch();
  const divId = useId();
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => setOpen(true);

  //****getting current location/***/
  const { coords, isGeolocationAvailable, isGeolocationEnabled, getPosition } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      userDecisionTimeout: 5000,
      isGeolocationEnabled: true,
    });

  const handleCloseLocation = () => {
    setOpenLocation(false);
    setShowCurrentLocation(false);
    setGeoLocationEnable(false);
    setCurrentLocation(undefined);
    setZoneIdEnabled(false);
    setLocation(undefined);
    setIsSelectedByGps(false);
    if (typeof window !== "undefined") {
      if (zoneData) {
        localStorage.removeItem("zoneid");
      }
    }
  };
  const handleCloseLocation1 = () => {
    setPlaceId("");
    setShowCurrentLocation(false);
    setPlaceDescription(undefined);
    setZoneIdEnabled(true);
    setGeoLocationEnable(false);
    setCurrentLocation(undefined);
    setPlaceDetailsEnabled(false);
    setLocation(false);
  };
  const handleAgreeLocation = (e) => {
    e.stopPropagation();
    if (coords) {
      setLocation({ lat: coords?.latitude, lng: coords?.longitude });
      setOpenLocation(false);
      setShowCurrentLocation(true);
      setGeoLocationEnable(true);
      setZoneIdEnabled(true);
      setIsSelectedByGps(true);
    } else {
      setOpenLocation(true);
    }
  };

  const HandleChangeForSearch = (event) => {
    setSearchKey(event.target.value);
    if (event.target.value) {
      setEnabled(true);
      setGeoLocationEnable(true);
      setCurrentLocation(event.target.value);
    } else {
      setEnabled(false);
      setCurrentLocation(undefined);
    }
  };
  const handleChange = (event, value) => {
    if (value) {
      setPlaceId(value?.place_id);
      setPlaceDescription(value?.description);
      setZoneIdEnabled(false);
      setGeoLocationEnable(true);
    }
    setPlaceDetailsEnabled(true);
  };
  const { data: places, isLoading } = useGetAutocompletePlace(
    searchKey,
    enabled
  );

  useEffect(() => {
    if (places) {
      const tempData = places?.suggestions?.map((item) => ({
        place_id: item.placePrediction.placeId,
        description: `${item?.placePrediction?.structuredFormat?.mainText.text}, ${item?.placePrediction?.structuredFormat?.secondaryText?.text}`,
      }));
      setPredictions(tempData);
    }
  }, [places]);

  const {
    data: geoCodeResults,
    refetch,
    isRefetching,
    isLoading: isLoadingGeoCode,
  } = useGetGeoCode(location, geoLocationEnable);
  useEffect(() => {
    refetch();
  }, [location]);

  useEffect(() => {
    if (geoCodeResults?.results && showCurrentLocation) {
      setCurrentLocation(geoCodeResults?.results[0]?.formatted_address);
    }
  }, [geoCodeResults, location]);

  const { data: zoneData } = useGetZoneId(location, zoneIdEnabled);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (zoneData) {
        // dispatch(setZoneData(zoneData?.data?.zone_data));
        localStorage.setItem("zoneid", zoneData?.zone_id);
      }
    }
  }, [zoneData]);
  //
  // //********************Pick Location */
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
    }
  }, [placeDetails]);

  useEffect(() => {
    if (placeDescription) {
      setCurrentLocation(placeDescription);
    }
  }, [placeDescription]);

  const moduleType = getCurrentModuleType();

  const onSuccessHandler = (response) => {
    dispatch(setWishList(response));
  };
  const { refetch: wishlistRefetch } = useWishListGet(onSuccessHandler);
  const setLocationEnable = async () => {
    setGeoLocationEnable(true);
    setZoneIdEnabled(true);
    if (currentLocation && location) {
      if (getToken()) {
        if (moduleType === "rental") {
          await rentalWishlistRefetch();
        } else {
          await wishlistRefetch();
        }
      }
      localStorage.setItem("location", currentLocation);
      localStorage.setItem("currentLatLng", JSON.stringify(location));
      //handleModalClose();

      toast.success(t("New location has been set."));
      setOpenModuleSelection(true);
    } else {
      toast.error(t("Location is required."), {
        id: "id",
      });
    }
  };
  const handleCloseModuleModal = (item) => {
    if (item) {
      toast.success(t(module_select_success));
      router.push("/home", undefined, { shallow: true });
    }
    setOpenModuleSelection(false);
  };
  const excludedDivRef = useRef(null);

  useEffect(() => {
    // Handle clicks outside of excludedDivRef
    const handleClickOutside = (event) => {
      if (
        excludedDivRef.current &&
        !excludedDivRef.current.contains(event.target)
      ) {
        setPickLocation(false);
        // setClickedOutside(true);
      }
    };

    // Add event listener to document
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [excludedDivRef]);

  const handlePickLocation = (e) => {
    setPickLocation((prev) => !prev);
  };
  const lanDirection = getLanguage() ? getLanguage() : "ltr";

  return (
    <>
      <CustomStackFullWidth
        backgroundColor={theme.palette.neutral[100]}
        padding={{ xs: ".7rem", md: "1.2rem" }}
        borderRadius="10px"
      >
        <CustomStackFullWidth
          direction="row"
          alignItems="center"
          sx={{ position: "relative", zIndex: 999 }}
        >
          <Grid container >
            <Grid item xs={9} sm={9.9}>
              <HeroFormInputWrapper>
                <CustomMapSearch
                  isLoading={isLoadingGeoCode}
                  showCurrentLocation={showCurrentLocation}
                  predictions={predictions}
                  handleChange={handleChange}
                  HandleChangeForSearch={HandleChangeForSearch}
                  handleAgreeLocation={handleAgreeLocation}
                  handleCloseLocation1={handleCloseLocation1}
                  currentLocation={currentLocation}
                  placeId={placeId}
                  handleCloseLocation={handleCloseLocation}
                  frommap="false"
                  fromparcel="false"
                  isLanding={true}
                  isRefetching={isRefetching}
                  handleOpen={handleOpen}
                />
                <HeroFormItem ref={excludedDivRef}>
                  <Box
                    sx={{
                      backgroundColor: (theme) => theme.palette.neutral[300],
                      // width: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                      display: "flex",
                      padding: {
                        xs: "8px",
                        sm: lanDirection === "rtl" ? "0rem" : "8px",
                      },
                      position: "relative",
                      top: {
                        xs: "6px",
                        md: lanDirection === "rtl" ? "9px" : "2px"
                      },
                      cursor: "pointer",
                      boxShadow:
                        pickLocation && "0px 4px 4px 0px rgba(0, 0, 0, 0.10)",
                      borderRadius: {
                        xs: pickLocation ? "5px 5px 0 0" : "0px",
                        sm: "0px",
                      },
                    }}
                  >
                    <CustomStackFullWidth
                      alignItems="center"
                      justifyContent="space-between"
                      direction="row"
                      gap="10px"
                      sx={{

                        color: !pickLocation && "primary.main",
                        "&:hover": {
                          color: "primary.main",
                        },
                      }}
                    >
                      {!isSelectedByGps && (

                        <GpsFixedIcon
                          id="gps-locate-icon"
                          onClick={handleAgreeLocation}
                          sx={{
                            fontSize: { xs: "20px", sm: "24px" },
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        />

                      )}

                    </CustomStackFullWidth>
                  </Box>

                </HeroFormItem>
              </HeroFormInputWrapper>
            </Grid>
            <Grid item xs={3} sm={2.1}>
              <StyledButton
                id="hero-explore-button"
                sx={{
                  height: "100%",
                  width: "100%",
                  borderRadius: "0px 8px 8px 0px",
                  // cursor: (!location?.lat || isLoadingGeoCode) ? "not-allowed" : "pointer"
                  "&:disabled": {
                    cursor: "not-allowed",
                    pointerEvents: "all !important",
                  },
                }}
                onClick={() => setLocationEnable()}
                radiuschange={isXSmall ? "false" : "true"}
                disabled={!location?.lat || isLoadingGeoCode}
              >
                {t("Discover")}
              </StyledButton>
            </Grid>
          </Grid>
        </CustomStackFullWidth>
        {open && (
          <MapModal
            open={open}
            handleClose={handleClose}
            coords={coords}
            selectedLocation={location}
            disableAutoFocus
            userLocation={location}
          />
        )}
        {openLocation && (
          <AllowLocationDialog
            handleCloseLocation={handleCloseLocation}
            openLocation={openLocation}
            isGeolocationEnabled={isGeolocationEnabled}
          />
        )}
      </CustomStackFullWidth>
      {zoneData && openModuleSelection && (
        <ModuleSelection
          location={currentLocation}
          closeModal={handleCloseModuleModal}
          setOpenModuleSelection={setOpenModuleSelection}
          disableAutoFocus
        />
      )}
    </>
  );
};
export default HeroLocationForm;
