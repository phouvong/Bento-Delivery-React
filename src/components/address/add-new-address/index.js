import React, { useEffect, useReducer, useState } from "react";
import { Box, Stack } from "@mui/system";
import AddIcon from "@mui/icons-material/Add";
import {
  Button,
  Divider,
  IconButton,
  Paper,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CustomModal from "../../modal";
import CloseIcon from "@mui/icons-material/Close";
import {
  AddressTypeStack,
  CustomIconButton,
  CustomStackFullWidth,
} from "../../../styled-components/CustomStyles.style";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

import { ACTIONS, initialState, reducer } from "../states";
import { useGeolocated } from "react-geolocated";
import useGetAutocompletePlace from "../../../api-manage/hooks/react-query/google-api/usePlaceAutoComplete";
import useGetGeoCode from "../../../api-manage/hooks/react-query/google-api/useGetGeoCode";
import useGetZoneId from "../../../api-manage/hooks/react-query/google-api/useGetZone";
import useGetPlaceDetails from "../../../api-manage/hooks/react-query/google-api/useGetPlaceDetails";
import GoogleMapComponent from "../../Map/GoogleMapComponent";
import AddressForm from "./AddressForm";
import CustomImageContainer from "../../CustomImageContainer";
import home from "../../checkout/assets/image 1256.png";
import office from "../assets/office.png";
import plusIcon from "../assets/plus.png";
import { useDispatch, useSelector } from "react-redux";
import { setOpenAddressModal } from "redux/slices/addAddress";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";

const AddNewAddress = (props) => {
  const {
    configData,
    refetch,
    t,
    openAddressModal,
    editAddress,
    setEditAddress,
    setAddress,
    handleLatLng,
    mode,
    address,
  } = props;
  const contactInfoOnly = mode === "contact";
  const checkoutLocationOnly = mode === "location";
  console.log({ mode });

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const [state, dispatch] = useReducer(reducer, initialState);
  const { profileInfo } = useSelector((state) => state.profileInfo);
  const { guestUserInfo } = useSelector((state) => state.guestUserInfo);
  const [editAddressLocation, setEditAddressLocation] = useState({
    lat: editAddress?.latitude,
    lng: editAddress?.longitude,
  });
  const token = localStorage.getItem("token");
  const reduxDispatch = useDispatch();
  const [addressType, setAddressType] = useState(
    guestUserInfo ? guestUserInfo?.address_type : ""
  );
  const personName = `${profileInfo?.f_name} ${profileInfo?.l_name}`;

  //useEffect calls for getting data
  //****getting current location/***/
  const { coords, isGeolocationAvailable, isGeolocationEnabled, getPosition } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      userDecisionTimeout: 5000,
      isGeolocationEnabled: true,
    });

  useEffect(() => {
    setEditAddressLocation(state?.location);
  }, [state?.location]);

  useEffect(() => {
    dispatch({
      type: ACTIONS.setLocation,
      payload: configData?.default_location,
    });
  }, []);

  const { data: places, isLoading } = useGetAutocompletePlace(
    state.searchKey,
    state.enabled
  );
  useEffect(() => {
    if (places) {
      const tempData = places?.data?.suggestions?.map((item) => ({
        place_id: item?.placePrediction?.placeId,
        description: `${item?.placePrediction?.structuredFormat?.mainText?.text}, ${item?.placePrediction?.structuredFormat?.secondaryText?.text}`,
      }));
      dispatch({ type: ACTIONS.setPredictions, payload: tempData });
    }
  }, [places]);
  const { data: geoCodeResults, isFetching: isFetchingGeoCode } = useGetGeoCode(
    state.location,
    state.geoLocationEnable
  );
  useEffect(() => {
    if (geoCodeResults?.results) {
      dispatch({
        type: ACTIONS.setCurrentLocation,
        payload: geoCodeResults?.results[0]?.formatted_address,
      });
    }
  }, [geoCodeResults, state.location]);
  const { data: zoneData } = useGetZoneId(state.location, state.zoneIdEnabled);
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (zoneData) {
        //localStorage.setItem("zoneid", zoneData?.zone_id);
      }
    }
  }, [zoneData]);
  // //********************Pick Location */
  const { isLoading: isLoading2, data: placeDetails } = useGetPlaceDetails(
    state.placeId,
    state.placeDetailsEnabled
  );
  //
  useEffect(() => {
    if (placeDetails) {
      const locObj = {
        lat: placeDetails?.data?.location?.latitude,
        lng: placeDetails?.data?.location?.longitude,
      };
      dispatch({
        type: ACTIONS.setLocation,
        payload: locObj,
      });
    }
  }, [placeDetails]);

  // const orangeColor = theme.palette.primary.main;

  useEffect(() => {
    if (state.placeDescription) {
      dispatch({
        type: ACTIONS.setCurrentLocation,
        payload: state.placeDescription,
      });
    }
  }, [state.placeDescription]);

  const handleClick = (name) => {
    setAddressType(name);
    if (editAddress) {
      setEditAddress({ ...editAddress, address_type: name });
    }
  };
  const closePopover = () => {
    reduxDispatch(setOpenAddressModal(false));
  };

  const [zoomToLocationToken, setZoomToLocationToken] = useState(0);
  const getCurrentLocation = () => {
    const locObj = { lat: coords?.latitude, lng: coords?.longitude };
    dispatch({
      type: ACTIONS.setLocation,
      payload: locObj,
    });
    setZoomToLocationToken((prev) => prev + 1);
  };

  return (
    <Box>
      {openAddressModal && (
        <CustomModal
          openModal={openAddressModal}
          handleClose={() => reduxDispatch(setOpenAddressModal(false))}
        >
          <Paper
            elevation={0}
            sx={{
              position: "relative",
              width: { xs: "100%", sm: "450px", md: "550px", lg: "730px" },
              maxHeight: { xs: "100vh", md: "90vh" },
              overflowY: "auto",
              backgroundColor: theme.palette.background.paper,
              borderRadius: { xs: "16px 16px 0 0", md: "16px" },
              p: 0,
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{
                px: { xs: 2, md: 3 },
                py: { xs: 1.5, md: 2 },
                borderBottom: `1px solid ${theme.palette.divider}`,
                position: "sticky",
                top: 0,
                backgroundColor: theme.palette.background.paper,
                zIndex: 2,
              }}
            >
              <Stack spacing={0.25} minWidth={0}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "15px", md: "17px" },
                    color: theme.palette.text.primary,
                  }}
                >
                  {contactInfoOnly
                    ? editAddress
                      ? t("Edit Contact Info")
                      : t("Add Contact Info")
                    : editAddress
                    ? t("Edit Address")
                    : t("Add New Address")}
                </Typography>
                {!contactInfoOnly && (
                  <Typography
                    sx={{
                      fontSize: { xs: "11px", md: "12px" },
                      color: theme.palette.text.secondary,
                    }}
                  >
                    {t("Pick your location on the map below")}
                  </Typography>
                )}
              </Stack>
              <IconButton
                onClick={() => reduxDispatch(setOpenAddressModal(false))}
                size="small"
                sx={{
                  flexShrink: 0,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: "8px",
                  color: theme.palette.text.secondary,
                  backgroundColor: alpha(
                    theme.palette.neutral?.[400] ||
                      theme.palette.text.secondary,
                    0.06
                  ),
                  "&:hover": {
                    backgroundColor: alpha(
                      theme.palette.neutral?.[400] ||
                        theme.palette.text.secondary,
                      0.14
                    ),
                  },
                }}
              >
                <CloseIcon sx={{ fontSize: "16px" }} />
              </IconButton>
            </Stack>

            <Box
              sx={{
                px: { xs: 2, md: 3 },
                py: { xs: 2, md: 2.5 },
              }}
            >
              {!contactInfoOnly && (
                <>
                  <Stack spacing={0.75} mb={1.5}>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: { xs: "13px", md: "14px" },
                        color: theme.palette.text.primary,
                      }}
                    >
                      {t("Your Location")}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        px: 1.5,
                        py: 1.25,
                        borderRadius: "10px",
                        border: `1px solid ${theme.palette.divider}`,
                        backgroundColor: alpha(
                          theme.palette.neutral?.[200] ||
                            theme.palette.background.default,
                          0.6
                        ),
                        minHeight: "44px",
                      }}
                    >
                      <GpsFixedIcon
                        sx={{
                          fontSize: "16px",
                          color: theme.palette.primary.main,
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: { xs: "12px", md: "13px" },
                          color:
                            state.currentLocation || editAddress?.address
                              ? theme.palette.text.primary
                              : theme.palette.text.disabled,
                          lineHeight: 1.4,
                          wordBreak: "break-word",
                        }}
                      >
                        {state.currentLocation ||
                          editAddress?.address ||
                          t("Move the pin to select your location")}
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack
                    position="relative"
                    sx={{
                      borderRadius: "12px",
                      overflow: "hidden",
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <GoogleMapComponent
                      height="236px"
                      key={state.rerenderMap}
                      setLocation={(values) => {
                        dispatch({
                          type: ACTIONS.setLocation,
                          payload: values,
                        });
                      }}
                      location={
                        editAddress
                          ? editAddressLocation
                          : state.location
                          ? state.location
                          : {
                              lat: configData?.default_location?.lat,
                              lng: configData?.default_location?.lng,
                            }
                      }
                      setPlaceDetailsEnabled={(value) =>
                        dispatch({
                          type: ACTIONS.setPlaceDetailsEnabled,
                          payload: value,
                        })
                      }
                      placeDetailsEnabled={state.placeDetailsEnabled}
                      locationEnabled={state.locationEnabled}
                      zoomToLocationToken={zoomToLocationToken}
                    />
                    <IconButton
                      onClick={getCurrentLocation}
                      sx={{
                        position: "absolute",
                        bottom: 12,
                        right: 12,
                        width: { xs: 36, md: 40 },
                        height: { xs: 36, md: 40 },
                        borderRadius: "50%",
                        color: theme.palette.primary.main,
                        backgroundColor: theme.palette.background.paper,
                        boxShadow: `0 2px 8px ${alpha("#000", 0.12)}`,
                        "&:hover": {
                          backgroundColor: theme.palette.background.paper,
                          boxShadow: `0 3px 10px ${alpha("#000", 0.16)}`,
                        },
                      }}
                    >
                      <GpsFixedIcon
                        sx={{ fontSize: { xs: "18px", md: "22px" } }}
                      />
                    </IconButton>
                  </Stack>

                  <Stack spacing={1} mt={{ xs: 2, md: 2.5 }}>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: { xs: "13px", md: "14px" },
                        color: theme.palette.text.primary,
                      }}
                    >
                      {t("Label As")}
                    </Typography>
                    <Stack direction="row" spacing={1.5}>
                      <AddressTypeStack
                        value="home"
                        addressType={
                          guestUserInfo
                            ? addressType
                            : editAddress?.address_type
                            ? editAddress?.address_type
                            : addressType
                        }
                        onClick={() => handleClick("home")}
                      >
                        <CustomImageContainer
                          src={home.src}
                          width="24px"
                          height="24px"
                        />
                      </AddressTypeStack>
                      <AddressTypeStack
                        value="office"
                        addressType={
                          editAddress?.address_type
                            ? editAddress?.address_type
                            : addressType
                        }
                        onClick={() => handleClick("office")}
                      >
                        <CustomImageContainer
                          src={office.src}
                          width="24px"
                          height="24px"
                        />
                      </AddressTypeStack>
                      <AddressTypeStack
                        value="other"
                        addressType={
                          editAddress?.address_type
                            ? editAddress?.address_type
                            : addressType
                        }
                        onClick={() => handleClick("other")}
                      >
                        <CustomImageContainer
                          src={plusIcon.src}
                          width="24px"
                          height="24px"
                        />
                      </AddressTypeStack>
                    </Stack>
                  </Stack>
                </>
              )}

              <Box mt={{ xs: 2, md: 2.5 }}>
                <AddressForm
                  atModal="true"
                  setAddressType={setAddressType}
                  addressType={
                    editAddress?.address_type
                      ? editAddress?.address_type
                      : addressType
                  }
                  configData={configData}
                  deliveryAddress={
                    geoCodeResults?.results[0]?.formatted_address
                  }
                  personName={editAddress?.contact_person_name || personName}
                  phone={
                    editAddress?.contact_person_number || profileInfo?.phone
                  }
                  email={profileInfo?.email}
                  lat={
                    editAddress?.latitude ??
                    editAddress?.lat ??
                    state.location?.lat
                  }
                  lng={
                    editAddress?.longitude ??
                    editAddress?.lng ??
                    state.location?.lng
                  }
                  popoverClose={closePopover}
                  refetch={refetch}
                  isRefetcing={isFetchingGeoCode}
                  editAddress={editAddress}
                  setAddress={setAddress}
                  handleLatLng={handleLatLng}
                  checkoutLocationOnly={checkoutLocationOnly}
                  contactInfoOnly={contactInfoOnly}
                  address={address}
                />
              </Box>
            </Box>
          </Paper>
        </CustomModal>
      )}
    </Box>
  );
};

AddNewAddress.propTypes = {};

export default AddNewAddress;
