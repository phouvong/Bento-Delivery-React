import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import { useGeolocated } from "react-geolocated";
import dynamic from "next/dynamic";
import { CustomButtonPrimary } from "styled-components/CustomButtons.style";
import AddressSelectionList from "./AddressSelectionList";
import useGetGeoCode from "api-manage/hooks/react-query/google-api/useGetGeoCode";

const MapModal = dynamic(() => import("components/Map/MapModal"));

/**
 * Checkout-specific address picker modal.
 * Mirrors the navbar location-popover UI (saved addresses + current location +
 * pick from map) but updates the checkout delivery address in-page without
 * reloading.
 */
const CheckoutAddressPickerModal = ({
  open,
  onClose,
  data,
  allAddress,
  address,
  handleLatLng,
  t,
  isLoading,
  onAddNewAddress,
  token,
}) => {
  const theme = useTheme();
  const [openMapModal, setOpenMapModal] = useState(false);

  // ── Geolocation ─────────────────────────────────────────────────────────
  const [geoLocation, setGeoLocation] = useState(null);
  const [geoEnabled, setGeoEnabled] = useState(false);

  const { coords } = useGeolocated({
    positionOptions: { enableHighAccuracy: false },
    userDecisionTimeout: 5000,
    isGeolocationEnabled: true,
  });

  const { data: geoCodeResults } = useGetGeoCode(geoLocation, geoEnabled);

  // When reverse-geocode returns, propagate to checkout and close.
  useEffect(() => {
    if (!geoCodeResults?.results || !geoLocation) return;
    const formattedAddress = geoCodeResults.results[0]?.formatted_address;
    handleLatLng({
      latitude: geoLocation.lat,
      longitude: geoLocation.lng,
      address: formattedAddress || "Current Location",
      address_type: "Current Location",
    });
    setGeoEnabled(false);
    setGeoLocation(null);
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geoCodeResults]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleUseCurrentLocation = () => {
    if (!coords) return;
    const loc = { lat: coords.latitude, lng: coords.longitude };
    setGeoLocation(loc);
    setGeoEnabled(true);
  };

  const handleSelectSavedAddress = (item) => {
    handleLatLng(item);
    onClose();
  };

  // Called by MapModal when user confirms a pin (toparcel="1" path).
  const handleMapLocation = (location, formattedAddress) => {
    handleLatLng({
      latitude: location.lat,
      longitude: location.lng,
      address: formattedAddress || "Selected Location",
      address_type: "Selected Address",
    });
    setOpenMapModal(false);
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "16px", p: 0 },
        }}
      >
        <DialogContent sx={{ p: "16px 16px 20px" }}>
          <Stack spacing={2}>
            {/* Header */}
            <Stack
              direction="row"
              alignItems="flex-start"
              justifyContent="space-between"
            >
              <Stack spacing={0.3}>
                <Typography fontSize="18px" fontWeight={700} color="text.primary" lineHeight={1.2}>
                  {t("Delivery Address")}
                </Typography>
                <Typography fontSize="12px" color="text.secondary" lineHeight={1.4}>
                  {t("Select a saved address or choose a new location")}
                </Typography>
              </Stack>
              <IconButton size="small" onClick={onClose} sx={{ ml: 1, mt: "-4px" }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Stack>

            {/* Saved address section */}
            {token ? (
              <>
                <AddressSelectionList
                  data={data}
                  allAddress={allAddress}
                  handleLatLng={handleSelectSavedAddress}
                  t={t}
                  address={address}
                  renderOnNavbar="true"
                  isLoading={isLoading}
                />

                {/* Add new address — part of saved addresses section */}
                {onAddNewAddress && (
                  <Button
                    fullWidth
                    onClick={onAddNewAddress}
                    startIcon={
                      <AddCircleOutlineIcon
                        sx={{ color: theme.palette.primary.main }}
                      />
                    }
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.primary.main,
                      justifyContent: "center",
                    }}
                  >
                    {t("Add New Address")}
                  </Button>
                )}
              </>
            ) : (
              /* Guest user — prompt to sign in */
              <Stack
                direction="row"
                alignItems="center"
                spacing={1.5}
                sx={{
                  px: 2,
                  py: 1.5,
                  borderRadius: "10px",
                  bgcolor: theme.palette.primary.main + "14",
                  border: `1px solid ${theme.palette.primary.main}33`,
                }}
              >
                <i
                  className="fi fi-rr-user"
                  style={{
                    fontSize: "20px",
                    display: "flex",
                    lineHeight: 1,
                    flexShrink: 0,
                    color: theme.palette.primary.main,
                  }}
                />
                <Typography fontSize="13px" color="text.secondary" lineHeight={1.4}>
                  {t("To select from saved addresses, you need to sign in.")}
                </Typography>
              </Stack>
            )}

            <Divider />

            {/* Use Current Location */}
            <Button
              fullWidth
              onClick={handleUseCurrentLocation}
              startIcon={
                <i
                  className="fi fi-rr-marker"
                  style={{ fontSize: "16px", display: "flex", lineHeight: 1, color: theme.palette.primary.main }}
                />
              }
              sx={{
                fontWeight: 600,
                color: theme.palette.primary.main,
                justifyContent: "center",
              }}
            >
              {t("Use Current Location")}
            </Button>

            {/* Pick from map */}
            <Stack width="100%" alignItems="center">
              <CustomButtonPrimary
                fullWidth
                onClick={() => setOpenMapModal(true)}
              >
                {t("Pick from map")}
              </CustomButtonPrimary>
            </Stack>

          </Stack>
        </DialogContent>
      </Dialog>

      {openMapModal && (
        <MapModal
          open={openMapModal}
          handleClose={() => setOpenMapModal(false)}
          toparcel="1"
          handleLocation={handleMapLocation}
        />
      )}
    </>
  );
};

export default CheckoutAddressPickerModal;
