import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  LoadScript,
  Polyline,
  DirectionsRenderer,
  OverlayView,
  MarkerF,
} from "@react-google-maps/api";
import { alpha, CircularProgress, IconButton, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useTheme } from "@emotion/react";
import CustomImageContainer from "../../CustomImageContainer";
import ddd from "../assets/meeting-point.svg";
import DeliveryManMapMarker from "../../parcel/DeliveryManMapMarker";
import StoreIcon from "@mui/icons-material/Store";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const containerStyle = {
  width: "100%",
  height: "348px",
  borderRadius: "10px",
  boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.10) inset",
  border: "1px solid #EAEEF2",
};
const initialState = {
  isMounted: false,
  map: null,
};
const reducer = (state, action) => {
  switch (action.type) {
    case "setIsMounted":
      return {
        ...state,
        isMounted: action.payload,
      };
    case "setMap":
      return {
        ...state,
        map: action.payload,
      };
    default:
      return state;
  }
};
const ACTION = {
  setIsMounted: "setIsMounted",
  setMap: "setMap",
};
const MapComponent = (props) => {
  const {
    latitude,
    longitude,
    isSmall,
    deliveryManLat,
    deliveryManLng,
    isStore,
    isFooter,
    defaultControl,
    store,
    deliveryMan,
    receiver,
    resAddress,
    userAddress,
  } = props;
  const theme = useTheme();
  const lineColor = theme.palette.primary.main;
  const [state, dispatch] = useReducer(reducer, initialState);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [zoom, setZoom] = useState(5);
  const [showStartInfo, setShowStartInfo] = useState(false);
  const [showDeliveryInfo, setShowDeliveryInfo] = useState(false);

  const parsedLat = parseFloat(latitude);
  const parsedLng = parseFloat(longitude);
  const parsedDmLat = parseFloat(deliveryManLat);
  const parsedDmLng = parseFloat(deliveryManLng);
  const hasCenter = Number.isFinite(parsedLat) && Number.isFinite(parsedLng);
  const hasDeliveryMan =
    Number.isFinite(parsedDmLat) && Number.isFinite(parsedDmLng);
  const center = hasCenter ? { lat: parsedLat, lng: parsedLng } : null;
  const center1 = hasDeliveryMan
    ? { lat: parsedDmLat, lng: parsedDmLng }
    : null;
  const mapCenter = center || center1 || { lat: 0, lng: 0 };
  const startLocationName =
    receiver?.contact_person_name ||
    receiver?.contact_person ||
    "Delivery Location";
  const deliveryPersonName =
    `${deliveryMan?.f_name || ""} ${deliveryMan?.l_name || ""}`.trim() ||
    "Delivery Man";
  const deliveryLocationName = deliveryMan
    ? deliveryPersonName
    : isStore
    ? store?.name || "Store Location"
    : receiver?.contact_person_name ||
      receiver?.contact_person ||
      "Store Location";

  const options = useMemo(
    () => ({
      disableDefaultUI: true,
      zoomControl: false,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
      disable: false,
    }),
    []
  );
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY,
  });

  const onLoad = useCallback(function callback(map) {
    dispatch({ type: ACTION.setMap, payload: map });
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    dispatch({ type: ACTION.setMap, payload: null });
  }, []);
  useEffect(() => {
    if (state.map) {
      dispatch({ type: ACTION.setIsMounted, payload: true });
    }
  }, [state.map]);

  const tryDirections = async () => {
    if (
      !window.google ||
      !window.google.maps ||
      !window.google.maps.DirectionsService
    ) {
      console.warn("Google Maps DirectionsService not loaded yet");
      return;
    }
    const modes = [
      google?.maps?.TravelMode?.DRIVING,
      google?.maps?.TravelMode?.WALKING,
      google?.maps?.TravelMode?.BICYCLING,
    ];

    const directionsService = new google.maps.DirectionsService();
    for (const mode of modes) {
      try {
        const result = await directionsService.route({
          origin: center,
          destination: center1,
          travelMode: mode,
        });
        setDirectionsResponse(result);
        return; // success
      } catch (err) {
        console.warn(`Route failed with mode ${mode}:`, err);
      }
    }

    setDirectionsResponse(null); // or trigger Polyline fallback
  };
  useEffect(() => {
    if (hasCenter && hasDeliveryMan) {
      tryDirections();
    }
  }, [deliveryManLat, deliveryManLng, latitude, longitude]);

  const handleZoomIn = () => {
    const current = state.map?.getZoom?.() ?? zoom;
    const next = Math.min(current + 1, 21);
    state.map?.setZoom?.(next);
    setZoom(next);
  };

  const handleZoomOut = () => {
    const current = state.map?.getZoom?.() ?? zoom;
    const next = Math.max(current - 1, 1);
    state.map?.setZoom?.(next);
    setZoom(next);
  };

  return isLoaded ? (
    <Stack>
      <Stack
        position="absolute"
        zIndex={1}
        left="3%"
        bottom={"6%"}
        direction="column"
        spacing={1}
      >
        <IconButton
          sx={{
            background: (theme) => theme.palette.neutral[100],
            "&:hover": {
              background: (theme) => alpha(theme.palette.neutral[100], 0.8),
            },
          }}
          padding={{ xs: "3px", sm: "5px" }}
          onClick={handleZoomIn}
          disabled={zoom > 21}
        >
          <AddIcon color="primary" />
        </IconButton>
        <IconButton
          sx={{
            background: (theme) => theme.palette.neutral[100],
            "&:hover": {
              background: (theme) => alpha(theme.palette.neutral[100], 0.8),
            },
          }}
          padding={{ xs: "3px", sm: "5px" }}
          onClick={handleZoomOut}
          disabled={zoom < 1}
        >
          <RemoveIcon color="primary" />
        </IconButton>
      </Stack>
      <GoogleMap
        mapContainerStyle={containerStyle}
        defaultCenter={mapCenter}
        defaultZoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={options}
      >
        {directionsResponse ? (
          <>
            <DirectionsRenderer
              options={{
                suppressMarkers: true,
                polylineOptions: {
                  strokeColor: lineColor, // Customize the route path color
                  strokeWeight: isFooter ? 0 : 4, // Customize the route path
                  // thickness
                },
              }}
              directions={directionsResponse}
            />
            <MarkerF
              position={{
                lat: directionsResponse.routes[0].legs[0].start_location.lat(),
                lng: directionsResponse.routes[0].legs[0].start_location.lng(),
              }}
              icon={{
                url: "/meeting-point.svg",
                scaledSize: new window.google.maps.Size(30, 30),
              }}
              onMouseOver={() => setShowStartInfo(true)}
              onMouseOut={() => setShowStartInfo(false)}
            >
              {showStartInfo && (
                <OverlayView
                  position={{
                    lat: directionsResponse.routes[0].legs[0].start_location.lat(),
                    lng: directionsResponse.routes[0].legs[0].start_location.lng(),
                  }}
                  mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                >
                  <div
                    style={{
                      borderRadius: "4px",
                      minWidth: "150px",
                      maxWidth: "240px",
                      textAlign: "center",
                      background: "#fff",
                      padding: "4px 8px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    }}
                  >
                    <Typography
                      fontWeight={500}
                      fontSize="12px"
                      color={theme.palette.neutral[1000]}
                      mb={0.5}
                    >
                      {startLocationName}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "10px",
                        fontWeight: 500,
                        wordBreak: "break-word",
                        whiteSpace: "normal",
                      }}
                    >
                      {userAddress || `lat: ${latitude} - lng: ${longitude}`}
                    </Typography>
                  </div>
                </OverlayView>
              )}
            </MarkerF>
            {isFooter ? null : (
              <MarkerF
                position={{
                  lat: directionsResponse.routes[0].legs[0].end_location.lat(),
                  lng: directionsResponse.routes[0].legs[0].end_location.lng(),
                }}
                icon={{
                  url: "/delivery_man_marker.png",
                  scaledSize: new google.maps.Size(30, 40),
                }}
                onMouseOver={() => setShowDeliveryInfo(true)}
                onMouseOut={() => setShowDeliveryInfo(false)}
              >
                {showDeliveryInfo && (
                  <OverlayView
                    position={{
                      lat: directionsResponse.routes[0].legs[0].end_location.lat(),
                      lng: directionsResponse.routes[0].legs[0].end_location.lng(),
                    }}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                  >
                    <div
                      style={{
                        borderRadius: "4px",
                        minWidth: "150px",
                        maxWidth: "240px",
                        textAlign: "center",
                        background: "#fff",
                        padding: "4px 8px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      }}
                    >
                      <Typography
                        fontWeight={500}
                        fontSize="12px"
                        color={theme.palette.neutral[1000]}
                        mb={0.5}
                      >
                        {deliveryLocationName}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "10px",
                          fontWeight: 500,
                          wordBreak: "break-word",
                          whiteSpace: "normal",
                        }}
                      >
                        {resAddress ||
                          `lat: ${deliveryManLat} - lng: ${deliveryManLng}`}
                      </Typography>
                    </div>
                  </OverlayView>
                )}
              </MarkerF>
            )}
          </>
        ) : (
          <Stack>
            {hasCenter && (
              <MarkerF
                position={center}
                icon={{
                  url: "/meeting-point.svg",
                  scaledSize: new window.google.maps.Size(30, 30),
                }}
                onMouseOver={() => setShowStartInfo(true)}
                onMouseOut={() => setShowStartInfo(false)}
              >
                {showStartInfo && (
                  <OverlayView
                    position={center}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                  >
                    <div
                      style={{
                        borderRadius: "4px",
                        minWidth: "150px",
                        maxWidth: "240px",
                        textAlign: "center",
                        background: "#fff",
                        padding: "4px 8px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      }}
                    >
                      <Typography
                        fontWeight={500}
                        fontSize="12px"
                        color={theme.palette.neutral[1000]}
                        mb={0.5}
                      >
                        {startLocationName}
                      </Typography>

                      <Typography
                        sx={{
                          background: "#fff",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                          fontSize: "10px",
                          width: "100%",
                          fontWeight: 500,
                          wordBreak: "break-word",
                          whiteSpace: "normal",
                        }}
                      >
                        {resAddress || `lat: ${latitude} - lng: ${longitude}`}
                      </Typography>
                    </div>
                  </OverlayView>
                )}
              </MarkerF>
            )}
            {hasDeliveryMan && (
              <MarkerF
                position={center1}
                icon={{
                  url: "/delivery_man_marker.png",
                  scaledSize: new google.maps.Size(30, 40),
                }}
                onMouseOver={() => setShowDeliveryInfo(true)}
                onMouseOut={() => setShowDeliveryInfo(false)}
              >
                {showDeliveryInfo && (
                  <OverlayView
                    position={{
                      lat: parseFloat(deliveryManLat),
                      lng: parseFloat(deliveryManLng),
                    }}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                  >
                    <div
                      style={{
                        borderRadius: "4px",
                        minWidth: "150px",
                        maxWidth: "240px",
                        textAlign: "center",
                        background: "#fff",
                        padding: "4px 8px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      }}
                    >
                      <Typography
                        fontWeight={500}
                        fontSize="12px"
                        color={theme.palette.neutral[1000]}
                        mb={0.5}
                      >
                        {deliveryLocationName}
                      </Typography>
                      <Typography
                        sx={{
                          background: "#fff",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                          fontSize: "10px",
                          width: "100%",
                          fontWeight: 500,
                          wordBreak: "break-word",
                          whiteSpace: "normal",
                        }}
                      >
                        {userAddress ||
                          `lat: ${deliveryManLat} - lng: ${deliveryManLng}`}
                      </Typography>
                    </div>
                  </OverlayView>
                )}
              </MarkerF>
            )}
          </Stack>
        )}
      </GoogleMap>
    </Stack>
  ) : (
    <></>
  );
};

MapComponent.propTypes = {};

export default MapComponent;
