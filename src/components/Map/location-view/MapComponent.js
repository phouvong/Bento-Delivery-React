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
  OverlayView, MarkerF,
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
    defaultControl
  } = props;
  const theme = useTheme();
  const lineColor = theme.palette.primary.main;
  const [state, dispatch] = useReducer(reducer, initialState);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [zoom, setZoom] = useState(10);
  const [showStartInfo, setShowStartInfo] = useState(false);
  const [showDeliveryInfo, setShowDeliveryInfo] = useState(false);

  const center = {
    lat: parseFloat(latitude),
    lng: parseFloat(longitude),
  };
  const center1 = {
    lat: parseFloat(deliveryManLat),
    lng: parseFloat(deliveryManLng),
  };

  const options = useMemo(
    () => ({
      disableDefaultUI: defaultControl,
      zoomControl: false,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
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
    if (!window.google || !window.google.maps || !window.google.maps.DirectionsService) {
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
    if (deliveryManLat) {
      tryDirections();
    }
  }, [deliveryManLat, deliveryManLng, latitude, longitude]);

  const handleZoomIn = () => {
    if (zoom <= 21) {
      setZoom((prevZoom) => Math.min(prevZoom + 1));
    }
  };

  const handleZoomOut = () => {
    if (zoom >= 1) {
      setZoom((prevZoom) => Math.max(prevZoom - 1));
    }
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
        center={center}
        onLoad={onLoad}
        zoom={zoom}
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
                url:"/meeting-point.svg",
                scaledSize: new window.google.maps.Size(30, 30),
              }}
            >
              {/*<CustomImageContainer src={ddd.src} width="40px" height="40px" />*/}
            </MarkerF>
            {isFooter ? null : (
              <MarkerF
                position={{
                  lat: directionsResponse.routes[0].legs[0].end_location.lat(),
                  lng: directionsResponse.routes[0].legs[0].end_location.lng(),
                }}
                icon={{
                  url:"/delivery_man_marker.png",
                  scaledSize: new google.maps.Size(30, 40),
                }}
              />

            )}
          </>
        ) : (
         <Stack>
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
                     textAlign: "center",
                   }}
                 >
                   <Typography
                     sx={{
                       background: "#fff",
                       padding: "4px 8px",
                       borderRadius: "4px",
                       boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                       fontSize: "10px",
                       width: "100%",
                       fontWeight: 500,
                     }}
                   >
                     {`lat: ${latitude} - lng: ${longitude}`}

                   </Typography>
                 </div>
               </OverlayView>
               )}
           </MarkerF>
           {deliveryManLat && deliveryManLng && (
             <MarkerF
               position={{
                 lat: parseFloat(deliveryManLat),
                 lng: parseFloat(deliveryManLng),
               }}
               icon={{
                 url:"/delivery_man_marker.png",
                 scaledSize: new google.maps.Size(30, 40),
               }}
               onMouseOver={() => setShowDeliveryInfo(true)}
               onMouseOut={() => setShowDeliveryInfo(false)}
             >
               {showDeliveryInfo && (
                 <OverlayView
                   position={center}
                   mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                 >
                   <div
                     style={{
                       borderRadius: "4px",
                       minWidth: "150px",
                       textAlign: "center",
                     }}
                   >
                     <Typography
                       sx={{
                         background: "#fff",
                         padding: "4px 8px",
                         borderRadius: "4px",
                         boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                         fontSize: "10px",
                         width: "100%",
                         fontWeight: 500,
                       }}
                     >
                       {`lat: ${deliveryManLat} - lng: ${deliveryManLng}`}

                     </Typography>
                   </div>
                 </OverlayView>
               )}
             </MarkerF>

           ) }


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
