import React, { useEffect, useState } from "react";
import {  Stack } from "@mui/system";
import { alpha, Box, Typography, useTheme } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { CustomStackFullWidth } from "../styled-components/CustomStyles.style";
import { useTranslation } from "react-i18next";
import useGetAddressList from "../api-manage/hooks/react-query/address/useGetAddressList";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import AddNewAddress from "./address/add-new-address";
import { Skeleton } from "@mui/material";
import AddNewAddressButton from "./address/add-new-address/AddNewAddressButton";
import { useSelector } from "react-redux";
import CustomDivider from "components/CustomDivider";
import CustomImageContainer from "components/CustomImageContainer";
import nodata from "./address/assets/empty-address.svg";
const SaveAddress = ({
  handleSenderLocation,
  configData,
  setSenderFormattedAddress,
  setSenderLocation,
  setSenderOptionalAddress,
  setReceiverFormattedAddress,
  setReceiverLocation,
  sender,
  setReceiverOptionalAddress,
  setOpenSave,
  parcel
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { profileInfo } = useSelector((state) => state.profileInfo);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const { data, refetch, isRefetching, isLoading } = useGetAddressList();
  const { openAddressModal } = useSelector((state) => state.addressModel);
  const hasAddresses = data?.addresses?.length > 0;
  useEffect(() => {
    refetch();
  }, []);

  const handleClick = (adds) => {
    let location = { lat: adds?.latitude, lng: adds?.longitude };
    if (sender === "true") {
      setSenderLocation(location);
      setSenderFormattedAddress(adds.address);
      setSenderOptionalAddress(adds);
      setOpenSave?.(false);
    } else {
      setReceiverLocation(location);
      setReceiverFormattedAddress(adds.address);
      setReceiverOptionalAddress(adds);
      setOpenSave?.(false);
    }

    setSelectedAddress(adds?.id);
  };
  return (
    <CustomStackFullWidth paddingX="1rem" paddingBottom="1rem">
      <Stack direction="row" justifyContent="space-between" alignItems="center" mt="1rem" >
        <Typography fontWeight="bold">{t("Saved Addresses")}</Typography>
        {(!parcel || hasAddresses) && <AddNewAddressButton parcel />}
        {openAddressModal && (
          <AddNewAddress
            refetch={refetch}
            t={t}
            configData={configData}
            openAddressModal={openAddressModal}
            profileInfo={profileInfo}
          />
        )}
      </Stack>
      <CustomDivider border="1px" paddingTop="10px"/>
      <SimpleBar style={{ maxHeight: 400 }}>
        {isLoading ? (
          <Skeleton width="100%" height={120} />
        ) : hasAddresses ? (
          data.addresses?.map((adds, index) => {
            return (
              <Stack
                key={adds.id}
                // alignItems="center"
                justifyContent="flex-start"
                direction="row"
                spacing={1}
                sx={{
                  cursor: "pointer",
                  borderRadius: "10px",
                  mt: "1rem",
                  position: "relative",
                }}
                backgroundColor={
                  adds.id === selectedAddress &&
                  alpha(theme.palette.primary.main, 0.3)
                }
                onClick={() => handleClick(adds)}
                paddingY="1rem"
              >
                {adds.id === selectedAddress && (
                  <CheckCircleIcon
                    color="primary"
                    sx={{
                      position: "absolute",
                      top: 5,
                      right: 5,
                      width: "20px",
                      height: "20px",
                    }}
                  />
                )}
                <HomeIcon
                  sx={{ width: "16.5px", height: "16.5px" }}
                  color="primary"
                />
                <Stack>
                  <Typography
                    fontSize={{ xs: "12px", md: "14px" }}
                    fontWeight="600"
                    textTransform="capitalize"
                  >
                    {t(adds?.address_type)}
                  </Typography>
                  <Typography
                    fontSize={{ xs: "12px", md: "14px" }}
                    sx={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {adds?.address}
                  </Typography>
                </Stack>
              </Stack>
            );
          })
        ) : (
          <Stack alignItems="center" justifyContent="center" spacing={1} paddingBlock="1rem">
            <CustomImageContainer
              src={nodata?.src}
              alt={t("No address found")}
              width="118px"
              height="60"
            />
            <Typography fontSize="16px" fontWeight="600" color="text.secondary">
              {t("Oops!")}
            </Typography>
            <Typography fontSize="12px" color="text.secondary">
              {t("No address found")}
            </Typography>
            <Box
              sx={{
                marginTop: "16px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px 30px",
                borderRadius: "8px",
                backgroundColor: "grey.200",
              }}
            >
              {parcel && <AddNewAddressButton parcel />}
            </Box>
          </Stack>
        )}
      </SimpleBar>
    </CustomStackFullWidth>
  );
};

export default SaveAddress;
