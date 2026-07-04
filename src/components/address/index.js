import React, { useEffect, useState } from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import {
  Button,
  Grid,
  NoSsr,
  styled,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import CustomEmptyResult from "../custom-empty-result";
import nodata from "./assets/Group 1597886316.svg";
import Shimmer from "./Shimmer";
import AddressCard from "./address-card";
import { useDispatch, useSelector } from "react-redux";
import { t } from "i18next";
import { SmallDeviceIconButton } from "../profile/basic-information";
import { useTheme } from "@emotion/react";
import { setAllSaveAddress } from "redux/slices/storedData";

export const GrayButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: "12px",
  border: "1px solid",
  borderColor: theme.palette.primary.main,
  borderRadius: "5px",
}));
const Address = (props) => {
  const {
    configData,
    setAddAddress,
    addAddress,
    setEditAddress,
    data,
    refetch,
    isLoading,
  } = props;
  const { AllSaveAddress } = useSelector((state) => state.storedData);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const { openAddressModal } = useSelector((state) => state.addressModel);

  const [edit, setEdit] = useState(null);
  useEffect(() => {
    if (AllSaveAddress?.length === 0) {
      refetch();
    }
  }, []);
  useEffect(() => {
    if (data) {
      dispatch(setAllSaveAddress(data?.addresses));
    }
  }, [data]);

  const handleClick = () => {
    setEditAddress(null);
    setAddAddress((prvState) => !prvState);
  };

  return (
    <CustomStackFullWidth
      padding={{ xs: "10px", sm: "15px", md: "20px" }}
      spacing={2}
    >
      <CustomStackFullWidth
        justifyContent="space-between"
        direction="row"
        alignItems="center"
      >
        <Typography
          fontSize={{ xs: "14px", sm: "14px", md: "16px" }}
          fontWeight="700"
        >
          {t("My Addresses")}
        </Typography>

        <Stack>
          {isSmall ? (
            <SmallDeviceIconButton onClick={handleClick}>
              <i
                className="fi fi-rs-map-marker-plus"
                style={{ fontSize: "16px", lineHeight: 1, display: "flex" }}
              />
            </SmallDeviceIconButton>
          ) : (
            <GrayButton
              onClick={handleClick}
              variant="outlined"
              startIcon={
                <i
                  className="fi fi-rs-map-marker-plus"
                  style={{ fontSize: "16px", lineHeight: 1, display: "flex" }}
                />
              }
            >
              {t("Add Address")}
            </GrayButton>
          )}
        </Stack>
      </CustomStackFullWidth>
      <Box>
        {AllSaveAddress?.length === 0 ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{ minHeight: "300px" }}
            spacing={1.5}
          >
            <i
              className="fi fi-rr-marker"
              style={{
                fontSize: "48px",
                lineHeight: 1,
                display: "flex",
                color: theme.palette.neutral[300],
              }}
            />
            <Typography
              fontSize="16px"
              fontWeight="600"
              color={theme.palette.neutral[500]}
            >
              {t("No Address Found")}
            </Typography>
            <Typography
              fontSize="13px"
              color={theme.palette.neutral[400]}
              textAlign="center"
            >
              {t("You have not added any address yet.")}
            </Typography>
          </Stack>
        ) : (
          <Grid container spacing={{ xs: 2, sm: 3, md: 3 }}>
            {AllSaveAddress?.map((item, index) => {
              return (
                <Grid key={item?.id} item xs={12} sm={6}>
                  <AddressCard
                    key={item?.id}
                    item={item}
                    refetch={refetch}
                    configData={configData}
                    dispatch={dispatch}
                    openAddressModal={openAddressModal}
                    setEditAddress={setEditAddress}
                    edit={edit}
                    setAddAddress={setAddAddress}
                  />
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>
    </CustomStackFullWidth>
  );
};

Address.propTypes = {};

export default Address;
