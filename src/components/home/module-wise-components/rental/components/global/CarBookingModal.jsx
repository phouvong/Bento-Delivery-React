import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Grid,
  useTheme,
  Box,
  alpha,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import useGetAutocompletePlace from "api-manage/hooks/react-query/google-api/usePlaceAutoComplete";
import useGetPlaceDetails from "api-manage/hooks/react-query/google-api/useGetPlaceDetails";
import useGetGeoCode from "api-manage/hooks/react-query/google-api/useGetGeoCode";
import RoomIcon from "@mui/icons-material/Room";
import NearMeOutlinedIcon from "@mui/icons-material/NearMeOutlined";
import {
  CustomStackFullWidth,
  CustomTextField,
} from "styled-components/CustomStyles.style";
import RentalSearchLocation from "components/home/module-wise-components/rental/components/global/search/RentalSearchLocation";
import RentalMap from "components/home/module-wise-components/rental/components/global/RentalMap";
import CustomModal from "components/custom-component/CustomModal";
import DateTimePicker from "components/home/module-wise-components/rental/components/global/DateTimePicker";
import { PrimaryButton } from "components/Map/map.style";
import { t } from "i18next";
import TripTypeSelector from "components/home/module-wise-components/rental/components/global/TripTypeSelector";
import useConfirmBooking from "components/home/module-wise-components/rental/rental-api-manage/hooks/react-query/confirm-booking/useConfirmBooking";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { toast } from "react-hot-toast";
import { setCartList } from "redux/slices/cart";
import useGetDistance from "api-manage/hooks/react-query/google-api/useGetDistance";
import usePostLocationUpdate from "components/home/module-wise-components/rental/rental-api-manage/hooks/react-query/confirm-booking/usePostLocationUpdate";
import CloseIcon from "@mui/icons-material/Close";
import { bookingConfirm, formattedDate } from "components/home/module-wise-components/rental/components/global/search/searchHepler";
import dayjs from "dayjs";
import LoadingButton from "@mui/lab/LoadingButton";
import useGetZoneList from "api-manage/hooks/react-query/zone-list/zone-list";
import { getGuestId, getToken } from "helper-functions/getToken";
import { useGeolocated } from "react-geolocated";
import ProviderCheck from "components/home/module-wise-components/rental/components/global/ProviderCheck";
import { isCurrentTime } from "../rental-checkout/checkoutHeplerFunction";
import useGetZoneId from "api-manage/hooks/react-query/google-api/useGetZone";
import useDeleteAllCarts from "../../../../../../api-manage/hooks/react-query/useDeleteAllCarts";
import { useRouter } from "next/router";
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 280,
    },
  },
};

export const calculateDestination = (pickup) => {
  const metersToDegreesLat = 100 / 111111; // Convert 100 meters to latitude degrees
  const metersToDegreesLng =
    100 / (111111 * Math.cos((parseFloat(pickup.lat) * Math.PI) / 180)); // Adjust for longitude at the given latitude

  return {
    lat: parseFloat(pickup.lat) + metersToDegreesLat, // Move 100m north
    lng: parseFloat(pickup.lng) + metersToDegreesLng, // Move 100m east
  };
};

export function isPointInPolygon(point, polygon) {
  const { lat, lng } = point;
  const coordinates = polygon.coordinates[0]; // Outer ring of the polygon
  let intersects = 0;

  for (let i = 0; i < coordinates.length - 1; i++) {
    const x1 = coordinates[i][1];
    const y1 = coordinates[i][0];
    const x2 = coordinates[i + 1][1];
    const y2 = coordinates[i + 1][0];

    // Check if the ray intersects with the edge
    if (
      lng > Math.min(y1, y2) &&
      lng <= Math.max(y1, y2) &&
      lat <= Math.max(x1, x2) &&
      y1 !== y2
    ) {
      const xinters = ((lng - y1) * (x2 - x1)) / (y2 - y1) + x1;
      if (x1 === x2 || lat <= xinters) {
        intersects++;
      }
    }
  }


  return intersects % 2 !== 0;
}

const CarBookingModal = (props) => {
  const {open,
    handleClose,
    id,
    update,
    fromCard,
    setOpenTripChange,
    setIds,
    setUpdateCartObject,
    selectedPricing,
    handleProviderCheck,
    setCartItemData,
    isDifferentProvider,
    isHourly,
    isDistence,
    card,
    setIsSameOpen,
    isDayWise
  }=props
  const mode = "DRIVE";
  const theme = useTheme();
  const router = useRouter();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const { cartList } = useSelector((state) => state.cart);
  const { configData } = useSelector((state) => state.configData);
  const [locations, setLocations] = useState({
    pickup: {
      lat: configData && JSON.parse(configData?.default_location?.lat),
      lng:configData && JSON.parse(configData?.default_location?.lng),
    },
    // destination: calculateDestination(configData?.default_location),
    destination: null,
  });

  const [dateValue, setDateValue] = useState(dayjs);
  const [durationValue, setDurationValue] = useState();
  const [searchKey1, setSearchKey1] = useState(""); // For Pickup
  const [predictions1, setPredictions1] = useState([]);
  const [placeId1, setPlaceId1] = useState("");
  const [searchKey2, setSearchKey2] = useState(""); // For Destination
  const [predictions2, setPredictions2] = useState([]);
  const [placeId2, setPlaceId2] = useState("");
  const [tripType, setTripType] = useState(isDistence?"distance_wise":"hourly");
  const [isFocused, setIsFocused] = useState(false);
  const [focusedField, setFocusedField] = useState("pickup");
  // API Hooks
  const { data: places1 } = useGetAutocompletePlace(searchKey1, !!searchKey1);
  const { data: places2 } = useGetAutocompletePlace(searchKey2, !!searchKey2);
  const { data: placeDetails1 } = useGetPlaceDetails(placeId1, !!placeId1);
  const { data: placeDetails2 } = useGetPlaceDetails(placeId2, !!placeId2);
  const { data: geoCodeData, isFetching: isFetchingGeoCode } = useGetGeoCode(
    locations[focusedField]
  );
  const {
    data: zoneData,
    error: errorLocation,
    isLoading: zoneLoading,
  } = useGetZoneId(locations?.pickup, true);

  const {mutate} = useDeleteAllCarts();
  const { mutate: confirmMutate, isLoading } = useConfirmBooking();
  const { mutate: userDataUpdateMutate, isLoading: userDataIsLoading } =
    usePostLocationUpdate();
  const { data, refetch } = useGetDistance(
    locations?.pickup,
    locations?.destination,
    mode
  );
  const {
    data: zoneList,
    isLoading: zoneListLoading,
    refetch: zoneListRefetch,
  } = useGetZoneList();

  const { coords } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
    isGeolocationEnabled: true,
  });

  let currentLocation = undefined;
  if (typeof window !== "undefined") {
    currentLocation = JSON.parse(localStorage.getItem("currentLatLng"));
  }
  useEffect(() => {
    if (currentLocation) {
      setLocations((prv) => ({
        ...prv,
        pickup: {
          lat: JSON.parse(currentLocation?.lat),
          lng: JSON.parse(currentLocation?.lng),
        },
      }));
    }
  }, []);

  useEffect(() => {
    zoneListRefetch();
  }, []);

  const result = zoneList?.some((zone) =>
    isPointInPolygon(locations?.pickup, zone.coordinates)
  );
  useEffect(() => {
    if (result === false && zoneList) {
      toast.error("Pickup location is not in the service area");
    }
  }, [result, locations?.pickup]);


  useEffect(() => {
    refetch();
  }, [locations?.pickup, locations?.destination]);
  const isProductExist = () => cartList?.carts?.find(
    (item) => item.vehicle?.id === id
  );


  useEffect(() => {
    if (selectedPricing) {
      setTripType(selectedPricing);
    }
    if ((update && cartList?.carts?.length>0) || fromCard ) {
      setSearchKey1(cartList?.user_data?.pickup_location?.location_name);
      setSearchKey2(cartList?.user_data?.destination_location?.location_name);
      setLocations({
        pickup: {
          lat: JSON.parse(cartList?.user_data?.pickup_location?.lat),
          lng: JSON.parse(cartList?.user_data?.pickup_location?.lng),
        },
        destination: {
          lat: JSON.parse(cartList?.user_data?.destination_location?.lat),
          lng: JSON.parse(cartList?.user_data?.destination_location?.lng),
        },
      });
      setDateValue(isCurrentTime(cartList)?cartList?.user_data?.pickup_time:new Date());
      const rentalType = cartList?.user_data?.rental_type;

      setTripType(update?rentalType:rentalType?((rentalType==="distance_wise" && isDistence)?"distance_wise":((rentalType==="hourly" && isHourly)?"hourly":(isDistence
        ? "distance_wise"
        : "hourly")) ):isDistence
        ? "distance_wise"
        : "hourly")
      setDurationValue(rentalType==="day_wise" ? cartList?.user_data?.estimated_hours/24: cartList?.user_data?.estimated_hours||1);
    }
  }, [update, cartList?.user_data, selectedPricing]);

  const bookingDetails = {
    id,
    locations,
    searchKey1,
    searchKey2,
    tripType,
    durationValue,
    dateValue,
    data,
  };



  const confirmBooking = () => {
    if (!locations?.destination) {
      toast.error("Please select destination location");
      return;
    }
    if(cartList?.carts?.length>0){
      if (isDifferentProvider) {
        setCartItemData?.(bookingDetails);
        handleProviderCheck?.(true);
        handleClose();
      } else {
        if(tripType===cartList?.user_data?.rental_type ){
          bookingConfirm({
            id,
            locations,
            searchKey1,
            searchKey2,
            tripType,
            durationValue,
            dateValue,
            data,
            confirmMutate,
            dispatch,
            setCartList,
            toast,
            handleClose,
            onErrorResponse,
          });
        }else{
          setUpdateCartObject?.({...bookingDetails,userId: cartList?.user_data?.id,id:id})
          setIsSameOpen?.(true)
          //handleClose?.()
        }
      }
    } else{
      if (isDifferentProvider) {
        setCartItemData?.(bookingDetails);
        handleProviderCheck?.(true);
        handleClose();
      } else {
        bookingConfirm({
          id,
          locations,
          searchKey1,
          searchKey2,
          tripType,
          durationValue,
          dateValue,
          data,
          confirmMutate,
          dispatch,
          setCartList,
          toast,
          handleClose,
          onErrorResponse,
        });
      }
    }

  };


  const updateUserData = () => {
    const pickupZoneIds = cartList?.carts[0]?.provider?.pickup_zone_id;
    const targetZoneIds = Array.isArray(zoneData?.zone_id) ? zoneData?.zone_id : JSON.parse(zoneData?.zone_id);
    const inZone = targetZoneIds.some(id => pickupZoneIds?.includes(id.toString()));
    if(inZone){
      const updateObject = {
        userId: cartList?.user_data?.id,
        pickup_location: { ...locations?.pickup, location_name: searchKey1 },
        destination_location: {
          ...locations?.destination,
          location_name: searchKey2,
        },
        rental_type: tripType,
        estimated_hours:  tripType==="day_wise"?durationValue*24:durationValue,
        pickup_time: formattedDate(dateValue),
        destination_time: Math.floor(
          data?.duration?.replace('s', '')  / (60 * 60)
        ),
        distance: Number(data?.distanceMeters)/ 1000,
        guest_id: getToken() ? null : getGuestId(),
      };
      userDataUpdateMutate(updateObject, {
        onSuccess: (res) => {
          dispatch(setCartList(res));
          toast.success("Update successfully!");
          handleClose();
        },
        onError: (error) => {
          if (error.response.data?.length > 0) {
            setIds?.(error.response.data);
            setUpdateCartObject?.(updateObject);
            setOpenTripChange?.(true);
            handleClose();
          } else {
            onErrorResponse(error);
          }
        },
      });
    }else{
      //toast.error(t("Your cart has been cleared as the selected zone does not support the previous pickup point."));
      mutate(null, {
        onSuccess: (res) => {
          toast.error(t("Your cart has been cleared as the selected zone does not support the previous pickup point."));
          dispatch(setCartList(res));
          handleClose()
          //router.push("/home");
          //handleClose()
        },
        onError: (error) => {
          toast.error(error.response.data.message);
        }
      })
    }

  };


  // Update geoCodeResults for the current field
  useEffect(() => {
    if (geoCodeData) {
      if (focusedField === "pickup") {
        setSearchKey1(geoCodeData.results[0]?.formatted_address);
      } else {
        setSearchKey2(geoCodeData.results[0]?.formatted_address);
      }
    }
  }, [geoCodeData]);

  // Update predictions when autocomplete data changes
  useEffect(() => {
    if (places1) {
      const tempData = places1?.suggestions?.map((item) => ({
        place_id: item?.placePrediction?.placeId,
        description: `${item?.placePrediction?.structuredFormat?.mainText?.text}, ${item?.placePrediction?.structuredFormat?.secondaryText?.text}`,
      }));
      setPredictions1(tempData);
    }
    if (places2) {
      const tempData = places2?.suggestions?.map((item) => ({
        place_id: item?.placePrediction?.placeId,
        description: `${item?.placePrediction?.structuredFormat?.mainText?.text}, ${item?.placePrediction?.structuredFormat?.secondaryText?.text}`,
      }));
      setPredictions2(tempData);
    }
  }, [places1, places2]);

  // Update locations when place details change
  useEffect(() => {
    if (placeDetails1?.location) {
      setLocations((prev) => ({
        ...prev,
        pickup: {
          lat: placeDetails1?.location?.latitude,
          lng: placeDetails1?.location?.longitude,
        },
      }));
    }
    if (placeDetails2?.location) {
      setLocations((prev) => ({
        ...prev,
        destination: {
          lat: placeDetails2?.location?.latitude,
          lng: placeDetails2?.location?.longitude,
        },
      }));
    }
  }, [placeDetails1, placeDetails2]);

  const handleSearchChange1 = (event) => setSearchKey1(event.target.value);
  const handleSearchChange2 = (event) => setSearchKey2(event.target.value);

  const handleMarkerDragEnd = (type, newLocation) => {
    if (type === "pickup") {
      setLocations((prev) => ({
        ...prev,
        pickup: newLocation,
      }));
    } else {
      setLocations((prev) => ({
        ...prev,
        destination: newLocation,
      }));
    }
  };

  const handleLocationChange = (field, value) => {
    if (value) {
      if (field === "pickup") {
        setPlaceId1(value.place_id);
      } else if (field === "destination") {
        setPlaceId2(value.place_id);
      }
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    setFocusedField("destination");
  };
  const pickLocationFormAddress = (value) => {
    setLocations((prev) => ({
      ...prev,
      destination: {
        lat: JSON.parse(value.latitude),
        lng: JSON.parse(value.longitude),
      },
    }));
    setSearchKey2(value?.address);
  };

  const handleDateChange = (newValue) => {
    setDateValue(newValue?.$d);
  };



  return (
    <>
      <CustomModal openModal={open} setModalOpen={handleClose}>
        <IconButton
          onClick={() => handleClose()}
          sx={{ position: "absolute", top: 0, right: 0 }}
        >
          <CloseIcon sx={{ fontSize: "16px" }} />
        </IconButton>
        <Box
          sx={{
            padding: "1.5rem",
            backgroundColor: theme.palette.neutral[100],
            borderRadius: "10px",
            width: { xs: "350px", sm: "650px", md: "1000px" },
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Grid container spacing={2} sx={{ flexGrow: 1 }}>
            <Grid item xs={12} sm={12} md={4}>
              <CustomStackFullWidth spacing={3} sx={{ flexGrow: 1 }}>
                {/* Pickup Location Field */}
                <RentalSearchLocation
                  predictions={predictions1}
                  handleChange={(event, value) =>
                    handleLocationChange("pickup", value)
                  }
                  HandleChangeForSearch={handleSearchChange1}
                  label={t("Pickup Location")}
                  onFocus={() => setFocusedField("pickup")}
                  value={{ description: searchKey1 }}
                  focusedField={focusedField}
                  endIcon={
                    <RoomIcon
                      sx={{
                        color: (theme) =>
                          alpha(theme.palette.neutral[400], 0.5),
                      }}
                    />
                  }
                  isFocused={isFocused}
                />

                {/* Destination Field */}
                <RentalSearchLocation
                  getCurrentLocation={(value) =>
                    setLocations?.((prev) => ({
                      ...prev,
                      destination: {
                        lat: value.latitude,
                        lng: value.longitude,
                      },
                    }))
                  }
                  result={result}
                  predictions={predictions2}
                  handleChange={(event, value) =>
                    handleLocationChange("destination", value)
                  }
                  pickLocationFormAddress={pickLocationFormAddress}
                  HandleChangeForSearch={handleSearchChange2}
                  label={t("Destination")}
                  onFocus={handleFocus}
                  disabled={!locations.pickup}
                  value={{ description: searchKey2 }}
                  isFocused={isFocused}
                  focusedField={focusedField}
                  endIcon={
                    <NearMeOutlinedIcon
                      sx={{
                        color: (theme) =>
                          alpha(theme.palette.neutral[400], 0.5),
                      }}
                    />
                  }
                />

                <DateTimePicker
                  height="45px"
                  handleDateChange={handleDateChange}
                  value={dayjs(dateValue)}
                />
                <TripTypeSelector
                  setDurationValue={setDurationValue}
                  durationValue={durationValue}
                  value={tripType}
                  setValue={(value) => {
                    setTripType(value);
                    setDurationValue(1);
                  }}
                  isHourly={isHourly}
                  isDistence={isDistence}
                  card={card}
                  update={update}
                  isDayWise={isDayWise}
                />
                {tripType !== 'distance_wise' && (
                  <CustomTextField
                    value={durationValue}
                    sx={{ marginTop: "10px" }}
                    label={tripType === 'day_wise' ? t("Trip Duration (day)") : t("Trip Duration (hrs)")}
                    type="number"
                    onChange={(event) => {
                      let value = event.target.value;

                      // Ensure only valid numeric input
                      if (value === "" || /^(\d+(\.\d{0,1})?)$/.test(value)) {
                        setDurationValue(value);
                      }
                    }}
                    inputProps={{
                      min: 0.5,
                      step: 0.5,
                    }}
                    InputLabelProps={{
                      shrink: true, // ✅ Force label to float when value is present
                    }}
                  />
                )}


              </CustomStackFullWidth>

              <CustomStackFullWidth
                sx={{
                  marginTop: (tripType === "hourly" || tripType==='day_wise') ? "26px" : "88px",
                  display: { xs: "none", sm: "none", md: "block" },
                }}
              >
                {update ? (
                  <LoadingButton
                    sx={{ width: "100%" }}
                    variant="contained"
                    onClick={updateUserData}
                    loading={userDataIsLoading}
                  >
                    {t("Update")}
                  </LoadingButton>
                ) : (
                  <LoadingButton
                    sx={{ width: "100%" }}
                    variant="contained"
                    onClick={confirmBooking}
                    loading={isLoading}
                  >
                    {t("Confirm Rent")}
                  </LoadingButton>
                )}
              </CustomStackFullWidth>
            </Grid>
            {/* Right section for the map */}
            <Grid item xs={12} sm={12} md={8}>
              <RentalMap
                location={locations[focusedField]}
                height={
                  isSmall ? "250px" : (tripType === "hourly" || tripType==='day_wise') ? "400px" : "380px"
                }
                onMarkerDragEnd={handleMarkerDragEnd}
                locations={locations}
                focusedField={focusedField}
                setFocusedField={setFocusedField}
                result={result}
                zoneList={zoneList}

              />
              <CustomStackFullWidth
                sx={{
                  display: { xs: "block", sm: "block", md: "none" },
                  marginTop: "10px",
                }}
              >
                {update ? (
                  <PrimaryButton
                    onClick={updateUserData}
                    loading={userDataIsLoading}
                  >
                    {t("Update")}
                  </PrimaryButton>
                ) : (
                  <PrimaryButton onClick={confirmBooking} loading={isLoading}>
                    {t("Confirm Rent")}
                  </PrimaryButton>
                )}
              </CustomStackFullWidth>
            </Grid>
          </Grid>
        </Box>
      </CustomModal>

    </>
  );
};

export default CarBookingModal;
