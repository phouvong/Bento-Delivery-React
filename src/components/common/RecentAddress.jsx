import React, { useEffect, useState } from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography,
  useTheme,
  Box,
  alpha,
} from "@mui/material";
import { LocationOn } from "@mui/icons-material";
import HomeRepairServiceIcon from "@mui/icons-material/HomeRepairService";
import { useTranslation } from "react-i18next";
import useGetAddressList from "api-manage/hooks/react-query/address/useGetAddressList";
import HomeIcon from "@mui/icons-material/Home";
import { getToken } from "helper-functions/getToken";
import ControlPointOutlinedIcon from "@mui/icons-material/ControlPointOutlined";
import { useGeolocated } from "react-geolocated";
import RentalMapIcon from "../home/module-wise-components/rental/RentalMapIcon";
import MapModal from "components/Map/MapModal";
import useGetGeoCode from "api-manage/hooks/react-query/google-api/useGetGeoCode";

const RecentAddresses = ({
  handleMouseDownRecentAddresses,
  recentlyAddress,
  fromHome,
  setOpenMap,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const handleSuccess = () => {};
  const { refetch, data } = useGetAddressList(handleSuccess);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleSelect = (e, value) => {
    handleMouseDownRecentAddresses(e, value);
  };
  const { coords } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
    isGeolocationEnabled: true,
  });
  const { data: geoCodeData, isFetching: isFetchingGeoCode } = useGetGeoCode({
    lat: coords?.latitude,
    lng: coords?.longitude,
  });

  const uniqueAddresses = recentlyAddress?.filter(
    (address, index, self) =>
      index ===
        self?.findIndex((a) => a.location_name === address.location_name) &&
      ((address.latitude && address.longitude) || (address.lat && address.lng))
  );

  const renderAddressList = (addresses, isMyAddress = false) => {
    if (!addresses || addresses.length === 0) {
      return (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ padding: "10px" }}
        >
          {t(
            isMyAddress
              ? "No saved addresses found."
              : "No recent address found."
          )}
        </Typography>
      );
    }

    return addresses.map((address, index) => (
      <ListItem
        key={index}
        sx={{
          padding: "5px 0px",
          cursor: "pointer",
          display: "grid",
          gridTemplateColumns: "28px auto 1fr",
          gap: "10px",
        }}
        onClick={(e) => {
          handleSelect(
            e,
            isMyAddress
              ? address
              : {
                  address: address?.location_name,
                  latitude: address?.latitude || address?.lat,
                  longitude: address?.longitude || address?.lng,
                }
          );
        }}
      >
        <ListItemIcon
          sx={{
            border: "1px solid",
            borderColor: theme.palette.neutral[300],
            padding: "5px",
            borderRadius: "5px",
            marginRight: "0px",
          }}
        >
          {isMyAddress && address?.address_type === "home" ? (
            <HomeIcon
              sx={{ color: theme.palette.neutral[400], fontSize: "16px" }}
            />
          ) : isMyAddress ? (
            <HomeRepairServiceIcon
              sx={{ color: theme.palette.neutral[400], fontSize: "16px" }}
            />
          ) : (
            <LocationOn
              sx={{ color: theme.palette.neutral[400], fontSize: "18px" }}
            />
          )}
        </ListItemIcon>
        <ListItemText
          sx={{
            ".MuiTypography-root": {
              fontSize: "12px !important",
              textTransform: "capitalize",
            },
          }}
          primary={isMyAddress ? address?.address_type : address?.location_name}
        />
        {isMyAddress && (
          <ListItemText
            sx={{
              ".MuiTypography-root": {
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontSize: "12px !important",
                color: theme.palette.neutral[400],
              },
            }}
            primary={address?.address}
          />
        )}
      </ListItem>
    ));
  };

  return (
    <Paper
      sx={{
        borderRadius: "0 0 4px 4px",
        padding: "16px",
        boxShadow: "0px 2px 5px 0px rgba(71, 71, 71, 0.07)",
        top: "10px",
        zIndex: 99999,
        position: "absolute",
        width: "100%",
        maxHeight: "35vh",
        overflowY: "auto",
      }}
    >
      <Typography fontSize="12px" fontWeight="500" color="text.secondary">
        {t("Recent address")}
      </Typography>
      <List sx={{ marginTop: "10px", padding: 0, marginBottom: "10px" }}>
        {renderAddressList(uniqueAddresses)}
      </List>

      {getToken() && (
        <>
          <Divider sx={{ marginTop: "10px" }} />
          <Typography
            fontSize="12px"
            fontWeight="500"
            color="text.secondary"
            sx={{ marginTop: "10px" }}
          >
            {t("My address")}
          </Typography>
          <List sx={{ marginTop: "10px", padding: 0 }}>
            {renderAddressList(data?.addresses || [], true)}
          </List>
        </>
      )}
      {fromHome && typeof setOpenMap === "function" && (
        <>
          <Divider sx={{ marginTop: "10px" }} />

          <Stack
            onClick={() => setOpenMap(true)}
            flexDirection="row"
            alignItems="center"
            justifyContent="flex-start"
            gap="10px"
            mt={1.5}
            sx={{ cursor: "pointer" }}
          >
            <Box
              sx={{
                border: "1px solid ",
                borderRadius: "8px",
                padding: "5px 10px 5px 10px",
                borderColor: alpha(theme.palette.neutral[400], 0.3),
              }}
            >
              <RentalMapIcon />
            </Box>
            <Typography fontWeight={600} color={theme.palette.primary.main}>
              {t("Location From Map")}
            </Typography>
          </Stack>
        </>
      )}
      <Stack
        onClick={(e) => {
          handleSelect(e, {
            latitude: coords?.latitude,
            longitude: coords?.longitude,
            address: geoCodeData.results[0]?.formatted_address,
            isCurrent: "current",
          });
        }}
        flexDirection="row"
        alignItems="center"
        justifyContent="flex-start"
        gap="10px"
        mt={1}
        sx={{ cursor: "pointer" }}
      >
        <Box
          sx={{
            border: "1px solid ",
            borderRadius: "8px",
            padding: "5px 5px 0px 5px",
            borderColor: alpha(theme.palette.neutral[400], 0.3),
          }}
        >
          <ControlPointOutlinedIcon
            sx={{ color: theme.palette.primary.main }}
          />
        </Box>
        <Typography fontWeight={600} color={theme.palette.primary.main}>
          {t("Use Current Location")}
        </Typography>
      </Stack>
    </Paper>
  );
};

export default RecentAddresses;
