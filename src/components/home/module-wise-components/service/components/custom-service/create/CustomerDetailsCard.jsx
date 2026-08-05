import { useCallback, useEffect, useReducer, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { setOpenAddressModal } from "redux/slices/addAddress";
import { getToken } from "helper-functions/getToken";
import AddNewAddress from "components/address/add-new-address";
import { initialState, reducer } from "components/address/states";
import CheckoutAddressPickerModal from "components/checkout/delivery-address/CheckoutAddressPickerModal";
import useGetAddressList from "api-manage/hooks/react-query/address/useGetAddressList";

/**
 * @param {object|null}  initialAddress  - pre-populated address for edit mode
 * @param {(addr: object|null) => void}  onAddressChange  - called whenever address changes
 */
export default function CustomerDetailsCard({ initialAddress = null, onAddressChange }) {
  const theme = useTheme();
  const { t } = useTranslation();
  const reduxDispatch = useDispatch();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [address, setAddress] = useState(initialAddress);
  const [editAddress, setEditAddress] = useState(null);
  const [addressFormMode, setAddressFormMode] = useState("location");
  const [openAddressPicker, setOpenAddressPicker] = useState(false);
  const [addressListData, setAddressListData] = useState(null);

  const { profileInfo } = useSelector((state) => state.profileInfo);
  const { guestUserInfo } = useSelector((state) => state.guestUserInfo);
  const { openAddressModal } = useSelector((state) => state.addressModel);
  const token = getToken();

  const handleAddressListSuccess = (data) => setAddressListData(data);
  const { refetch: refetchAddressList, isRefetching } = useGetAddressList(handleAddressListSuccess);

  useEffect(() => {
    refetchAddressList();
  }, []);

  const allAddress = addressListData
    ? [address, ...(addressListData.addresses ?? [])].filter(Boolean)
    : address
    ? [address]
    : [];

  // Notify parent whenever address changes
  const updateAddress = useCallback(
    (newAddr) => {
      setAddress(newAddr);
      onAddressChange?.(newAddr);
    },
    [onAddressChange]
  );

  useEffect(() => {
    if (initialAddress) {
      updateAddress(initialAddress);
      return;
    }
    if (typeof window === "undefined") return;
    const currentLatLng = JSON.parse(localStorage.getItem("currentLatLng") || "null");
    const location = localStorage.getItem("location");
    if (currentLatLng) {
      updateAddress({
        lat: currentLatLng.lat,
        lng: currentLatLng.lng,
        address: location,
        address_type: "Selected Address",
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLatLng = (values) => {
    updateAddress({ ...values, lat: values.latitude, lng: values.longitude });
  };

  const handleAddContactInfo = () => {
    setEditAddress(null);
    setAddressFormMode("contact");
    reduxDispatch(setOpenAddressModal(true));
  };

  const handleEditContactInfo = () => {
    setEditAddress(address);
    setAddressFormMode("contact");
    reduxDispatch(setOpenAddressModal(true));
  };

  const addressTitle =
    address?.address_type && address?.address_type !== "Selected Address"
      ? t(address.address_type)
      : t("Current Location");

  const profileFullName = [profileInfo?.f_name, profileInfo?.l_name]
    .filter(Boolean)
    .join(" ")
    .trim();
  const contactName =
    address?.contact_person_name ||
    (token
      ? profileFullName || profileInfo?.name
      : guestUserInfo?.contact_person_name);
  const contactPhone =
    address?.contact_person_number ||
    (token ? profileInfo?.phone : guestUserInfo?.contact_person_number);
  const hasContactInfo = Boolean(contactName && contactPhone);

  const pillSx = {
    flex: 1,
    minWidth: 0,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: "10px",
    px: { xs: 1, md: 1.25 },
    py: { xs: 0.75, md: 1 },
    display: "flex",
    alignItems: "center",
    gap: 1,
    backgroundColor: theme.palette.background.paper,
  };

  const iconCircleSx = {
    width: 28,
    height: 28,
    borderRadius: "50%",
    backgroundColor: alpha(
      theme.palette.neutral?.[400] || theme.palette.text.secondary,
      0.15
    ),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  };

  const editBtnSx = {
    p: 0.5,
    color: theme.palette.primary.main,
    flexShrink: 0,
  };

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: theme.palette.background.paper,
        borderRadius: { xs: "10px", md: "14px" },
        boxShadow: `0 1px 4px ${alpha(theme.palette.text.primary, 0.06)}`,
        px: { xs: 2, md: 3 },
        py: { xs: 1.5, md: 2 },
        mb: 2,
      }}
    >
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: { xs: "16px", md: "18px" },
          color: theme.palette.text.primary,
          mb: { xs: 1, md: 1.25 },
        }}
      >
        {t("Customer Details")}
      </Typography>

      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems="stretch"
        gap={{ xs: 1, md: 1.5 }}
      >
        {/* Address pill — pencil opens CheckoutAddressPickerModal */}
        <Box sx={pillSx}>
          <Box sx={iconCircleSx}>
            <LocationOnOutlinedIcon
              sx={{ fontSize: 16, color: theme.palette.text.secondary }}
            />
          </Box>
          <Stack spacing={0.25} flex={1} minWidth={0}>
            <Typography
              sx={{
                fontSize: { xs: "12px", md: "13px" },
                fontWeight: 600,
                color: theme.palette.text.primary,
                textTransform: "capitalize",
                lineHeight: 1.2,
              }}
            >
              {addressTitle}
            </Typography>
            {address?.address && (
              <Typography
                sx={{
                  fontSize: { xs: "10px", md: "11px" },
                  color: theme.palette.text.secondary,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  lineHeight: 1.3,
                }}
              >
                {address.address}
              </Typography>
            )}
          </Stack>
          <IconButton
            onClick={() => setOpenAddressPicker(true)}
            size="small"
            sx={editBtnSx}
          >
            <i
              className="fi fi-rs-pencil"
              style={{ fontSize: 14, display: "flex", lineHeight: 1 }}
            />
          </IconButton>
        </Box>

        {/* Contact info pill or add button */}
        {hasContactInfo ? (
          <Box sx={pillSx}>
            <Box sx={iconCircleSx}>
              <PersonOutlineOutlinedIcon
                sx={{ fontSize: 16, color: theme.palette.text.secondary }}
              />
            </Box>
            <Stack spacing={0.25} flex={1} minWidth={0}>
              <Typography
                sx={{
                  fontSize: { xs: "12px", md: "13px" },
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  lineHeight: 1.2,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {contactName}
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "10px", md: "11px" },
                  color: theme.palette.text.secondary,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {contactPhone}
              </Typography>
            </Stack>
            <IconButton onClick={handleEditContactInfo} size="small" sx={editBtnSx}>
              <i
                className="fi fi-rs-pencil"
                style={{ fontSize: 14, display: "flex", lineHeight: 1 }}
              />
            </IconButton>
          </Box>
        ) : (
          <Button
            onClick={handleAddContactInfo}
            disableElevation
            sx={{
              flex: 1,
              py: { xs: 1, md: 1.25 },
              px: 2,
              borderRadius: "10px",
              backgroundColor: alpha(
                theme.palette.neutral?.[400] || theme.palette.text.secondary,
                0.12
              ),
              color: theme.palette.text.primary,
              fontWeight: 600,
              fontSize: { xs: "13px", md: "14px" },
              textTransform: "none",
              gap: 0.75,
              "&:hover": {
                backgroundColor: alpha(
                  theme.palette.neutral?.[400] || theme.palette.text.secondary,
                  0.18
                ),
              },
            }}
          >
            <AddCircleOutlineIcon
              sx={{ fontSize: 18, color: theme.palette.text.primary }}
            />
            {t("Add Contact Info")}
          </Button>
        )}
      </Stack>

      {/* Address picker modal — saved addresses + current location + pick from map */}
      {openAddressPicker && (
        <CheckoutAddressPickerModal
          open={openAddressPicker}
          onClose={() => setOpenAddressPicker(false)}
          data={addressListData}
          allAddress={allAddress}
          address={address}
          handleLatLng={handleLatLng}
          t={t}
          isLoading={isRefetching}
          token={token}
          onAddNewAddress={() => {
            setOpenAddressPicker(false);
            // AddNewAddress reads editAddress?.latitude / editAddress?.longitude.
            // Our address object uses lat/lng, so normalize before passing.
            setEditAddress(
              address
                ? {
                    ...address,
                    latitude: address.latitude ?? address.lat,
                    longitude: address.longitude ?? address.lng,
                  }
                : null
            );
            setAddressFormMode("full");
            reduxDispatch(setOpenAddressModal(true));
          }}
        />
      )}

      {/* Add/edit address form — opened from picker or contact info edit */}
      {openAddressModal && (
        <AddNewAddress
          t={t}
          openAddressModal={openAddressModal}
          editAddress={editAddress}
          setEditAddress={setEditAddress}
          setAddress={updateAddress}
          handleLatLng={handleLatLng}
          mode={addressFormMode}
          address={address}
          refetch={refetchAddressList}
        />
      )}
    </Box>
  );
}
