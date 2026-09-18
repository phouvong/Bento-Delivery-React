import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Box from "@mui/material/Box";
import { alpha, IconButton, Stack, Typography, useTheme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  GoogleMap,
  MarkerF,
  DirectionsRenderer,
  useJsApiLoader,
  Polygon,
  InfoWindow,
} from "@react-google-maps/api";
import { darkStyles, grayMapStyle, styles } from "components/home/module-wise-components/rental/components/global/mapColor";
import { t } from "i18next";
const RentalMap = ({
                     location,
                     height,
                     onMarkerDragEnd,
                     locations,
                     setFocusedField,
                     result,
                     zoneList,
                     focusedField,
                   }) => {
  const theme = useTheme();
  const [mapInstance, setMapInstance] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [mapCenter, setMapCenter] = useState({
    lat: parseFloat(location?.lat) || 0,
    lng: parseFloat(location?.lng) || 0,
  });
  const [polygonInstance, setPolygonInstance] = useState(null);
  const prevCenterRef = useRef(mapCenter);
  const zoomRef = useRef(18);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY,
  });
  const containerStyle = {
    width: "100%",
    height: height || "400px",
  };
  useEffect(() => {
    if (location?.lat && location?.lng) {
      const newLocation = {
        lat: parseFloat(location.lat),
        lng: parseFloat(location.lng),
      };
      setMapCenter(newLocation);
      prevCenterRef.current = newLocation;
    }
  }, [location]);
  useEffect(() => {
    if (isLoaded && locations?.pickup && locations?.destination) {
      const directionsService = new window.google.maps.DirectionsService();
      const request = {
        origin: locations.pickup,
        destination: locations.destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      };
      directionsService.route(request, (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirectionsResponse(result);
        } else {
          console.error("Error fetching directions:", status);
        }
      });
    }
  }, [isLoaded, locations?.pickup, locations?.destination]);
  const onMapLoad = useCallback((map) => {
    setMapInstance(map);
  }, []);
  const options = useMemo(
    () => ({
      zoomControl: false,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
      styles:theme.palette.mode === "dark" ? darkStyles : grayMapStyle,
      disableDefaultUI: false,
    }),
    []
  );
  const handleZoomIn = () => {
    if (mapInstance) {
      const currentZoom = mapInstance.getZoom();
      mapInstance.setZoom(currentZoom + 1);
      zoomRef.current = currentZoom + 1;
    }
  };
  const handleZoomOut = () => {
    if (mapInstance) {
      const currentZoom = mapInstance.getZoom();
      mapInstance.setZoom(currentZoom - 1);
      zoomRef.current = currentZoom - 1;
    }
  };
  const handleMarkerDragEnd = (type, latLng) => {
    setFocusedField?.(type);
    setMapCenter({
      lat: latLng.lat(),
      lng: latLng.lng(),
    });
    if (onMarkerDragEnd) {
      onMarkerDragEnd(type, { lat: latLng.lat(), lng: latLng.lng() });
    }
  };
  const handleMarkerDragStart = (image) => {
    const markerElement = document.querySelector(`img[src="${image}"]`)?.parentElement;
    if (markerElement) {
      markerElement.classList.add("scaleAnimation");
      markerElement.classList.add("transition");
    }
  };
  const handleMarkerDragEndWithAnimation = (type, latLng, image) => {
    handleMarkerDragEnd(type, latLng);
    const markerElement = document.querySelector(`img[src="${image}"]`)?.parentElement;
    if (markerElement) {
      markerElement.classList.remove("scaleAnimation");
    }
  };
  const convertGeoJSONToCoordinates = (geoJSONCoordinates) => {
    return geoJSONCoordinates.map(([lng, lat]) => ({ lat, lng }));
  };
  useEffect(() => {
    if (polygonInstance?.length > 0) {
      polygonInstance?.forEach((polygon) => polygon.setMap(null));
    }
    if (zoneList?.length > 0 && mapInstance && result === false) {
      const newPolygons = zoneList.map((zone) => {
        const formattedCoordinates = convertGeoJSONToCoordinates(
          zone?.coordinates?.coordinates[0] || []
        );
        const polygon = new window.google.maps.Polygon({
          paths: formattedCoordinates,
          fillColor: "blue",
          fillOpacity: 0.3,
          strokeColor: theme.palette.error.main,
          strokeOpacity: 0.8,
          strokeWeight: 2,
          map: mapInstance,
        });
        return polygon;
      });
      setPolygonInstance(newPolygons);
    }
  }, [zoneList, result]);
  useEffect(() => {
    if (mapInstance) {
      const newZoom = result === false ? 7 : 18;
      if (zoomRef.current !== newZoom) {
        mapInstance.setZoom(newZoom);
        zoomRef.current = newZoom;
      }
    }
  }, [result, mapInstance, locations?.pickup]);
  return isLoaded ? (
    <Box
      sx={{
        boxShadow: "inset 0px 4px 4px rgba(0, 0, 0, 0.1)",
        borderRadius: "10px",
        p: "4px",
        position: "relative",
      }}
    >
      <Stack
        position="absolute"
        zIndex={1}
        left={10}
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
        >
          <RemoveIcon color="primary" />
        </IconButton>
      </Stack>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={zoomRef.current}
        options={options}
        onLoad={onMapLoad}
        key={directionsResponse}
      >
        {locations.pickup &&  (
          <>
            <MarkerF
              position={{
                lat: parseFloat(locations.pickup.lat),
                lng: parseFloat(locations.pickup.lng),
              }}
              icon={{
                url:theme.palette.mode === "dark" ? "/PickupDark.png" : "/New_Pickup.png",
                scaledSize: new window.google.maps.Size(42, 66),
              }}
              draggable={true}
              onDragStart={() => handleMarkerDragStart(theme.palette.mode === "dark" ? "/PickupDark.png" : "/New_Pickup.png")}
              onDragEnd={(e) =>
                handleMarkerDragEndWithAnimation(
                  "pickup",
                  e.latLng,
                  theme.palette.mode === "dark" ? "/PickupDark.png" : "/New_Pickup.png"
                )
              }
            />
            {directionsResponse && <InfoWindow
              position={{
                lat: parseFloat(locations.pickup.lat),
                lng: parseFloat(locations.pickup.lng),
              }}
              options={{
                pixelOffset: new window.google.maps.Size(0, -66),
                closeBoxURL: "",
                enableEventPropagation: true,
              }}
            >
              <div
                style={{
                  borderRadius: "4px",
                  minWidth: "60px",
                  textAlign: "center",
                }}
              >
                <Typography
                  style={{
                    fontSize: "12px",
                    color: "#fff",
                    fontWeight: "500",
                  }}
                >
                  {t("Pick up")}
                </Typography>
              </div>
            </InfoWindow>}
          </>
        )}
        {locations.destination && (
          <>
            <MarkerF
              position={{
                lat: parseFloat(locations.destination.lat),
                lng: parseFloat(locations.destination.lng),
              }}
              icon={{
                url:theme.palette.mode === "dark" ? "/d2.png" : "/img_2.png",
                scaledSize: new window.google.maps.Size(42, 66),
              }}
              draggable={true}
              onDragEnd={(e) =>
                handleMarkerDragEndWithAnimation(
                  "destination",
                  e.latLng,
                  theme.palette.mode === "dark" ? "/d2.png" : "/img_2.png"
                )
              }
              onDragStart={() => handleMarkerDragStart(theme.palette.mode === "dark" ? "/d2.png" : "/img_2.png")}
            />
            {directionsResponse && <InfoWindow
              position={{
                lat: parseFloat(locations.destination.lat),
                lng: parseFloat(locations.destination.lng),
              }}
              options={{
                pixelOffset: new window.google.maps.Size(0, -66),
                closeBoxURL: "",
                enableEventPropagation: true,
              }}
            >
              <div
                style={{
                  borderRadius: "4px",
                  minWidth: "60px",
                  textAlign: "center",
                }}
              >
                <Typography
                  style={{
                    fontSize: "12px",
                    color: "#fff",
                    fontWeight: "500",
                  }}
                >
                  {t("Destination")}
                </Typography>
              </div>
            </InfoWindow>}
          </>
        )}
        {directionsResponse && (
          <DirectionsRenderer
            directions={directionsResponse}
            options={{
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: theme.palette.neutral[600],
                strokeOpacity: 1.0,
                strokeWeight: 3,
              },
            }}
          />
        )}
      </GoogleMap>
    </Box>
  ) : (
    <div>Loading...</div>
  );
};
export default RentalMap;









