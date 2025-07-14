import React, { useEffect, useState } from "react";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { Button, Card, Typography, useTheme } from "@mui/material";
import { Stack } from "@mui/system";
import { useTranslation } from "react-i18next";
import CustomTextFieldWithFormik from "../../form-fields/CustomTextFieldWithFormik";
import PinDropIcon from "@mui/icons-material/PinDrop";
import SaveAddress from "../../SaveAddress";
import GetLocationFrom from "./GetLocationFrom";
import CustomPhoneInput from "../../custom-component/CustomPhoneInput";
import { getLanguage } from "helper-functions/getLanguage";
import { getToken } from "helper-functions/getToken";
import dynamic from "next/dynamic";
const MapModal = dynamic(() => import("../../Map/MapModal"));

const SenderInfoForm = ({
  addAddressFormik,
  senderNameHandler,
  senderPhoneHandler,
  handleLocation,
  coords,
  configData,
  senderFormattedAddress,
  setSenderFormattedAddress,
  setSenderLocation,
  senderRoadHandler,
  senderHouseHandler,
  senderFloorHandler,
  senderEmailHandler,
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [currentLocationValue, setCurrentLactionValue] = useState({
    description: null,
  });
  const [senderOptionalAddress, setSenderOptionalAddress] = useState({});
  const [testLocation, setTestLocation] = useState(null);
  const theme = useTheme();
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (senderFormattedAddress) {
      setCurrentLactionValue({
        description: senderFormattedAddress,
      });
      setTestLocation(senderFormattedAddress);
    } else {
      setCurrentLactionValue({
        description: "",
      });
    }
  }, [senderFormattedAddress]);

  useEffect(() => {
    senderRoadHandler(
      senderOptionalAddress?.road
        ? senderOptionalAddress?.road
        : addAddressFormik.values.senderRoad
    );
    senderFloorHandler(
      senderOptionalAddress?.floor
        ? senderOptionalAddress?.floor
        : addAddressFormik.values.senderFloor
    );
    senderHouseHandler(
      senderOptionalAddress?.house
        ? senderOptionalAddress?.house
        : addAddressFormik.values.senderHouse
    );
  }, [senderOptionalAddress]);
  const lanDirection = getLanguage() ? getLanguage() : "ltr";

  return (
    <CustomStackFullWidth height="100%">
      <Card sx={{ padding: "1.2rem", height: "100%" }}>
        <CustomStackFullWidth spacing={2}>
          <Stack align="center" width="100%">
            <Typography fontWeight={500} fontSize="16px">
              {t("Sender Information")}
            </Typography>
          </Stack>
          <CustomStackFullWidth alignItems="center" spacing={3}>
            <CustomStackFullWidth alignItems="center">
              <CustomTextFieldWithFormik
                required="true"
                type="text"
                label={t("Sender Name")}
                touched={addAddressFormik.touched.senderName}
                errors={addAddressFormik.errors.senderName}
                fieldProps={addAddressFormik.getFieldProps("senderName")}
                onChangeHandler={senderNameHandler}
                value={addAddressFormik.values.senderName}
              />
            </CustomStackFullWidth>
            <CustomTextFieldWithFormik
              required
              label={t("Email")}
              touched={addAddressFormik.touched.senderEmail}
              errors={addAddressFormik.errors.senderEmail}
              fieldProps={addAddressFormik.getFieldProps("senderEmail")}
              onChangeHandler={senderEmailHandler}
              value={addAddressFormik.values.senderEmail}
            />
            <CustomStackFullWidth alignItems="center">
              <CustomPhoneInput
                value={addAddressFormik.values.senderPhone}
                onHandleChange={senderPhoneHandler}
                initCountry={configData?.country}
                touched={addAddressFormik.touched.senderPhone}
                errors={addAddressFormik.errors.senderPhone}
                rtlChange="true"
                lanDirection={lanDirection}
                height="45px"
                borderRadius="8px"
              />
              {/*<CustomTextFieldWithFormik*/}
              {/*  required="true"*/}
              {/*  type="number"*/}
              {/*  label={t("Sender Phone")}*/}
              {/*  touched={addAddressFormik.touched.senderPhone}*/}
              {/*  errors={addAddressFormik.errors.senderPhone}*/}
              {/*  fieldProps={addAddressFormik.getFieldProps("senderPhone")}*/}
              {/*  onChangeHandler={senderPhoneHandler}*/}
              {/*  value={addAddressFormik.values.senderPhone}*/}
              {/*/>*/}
            </CustomStackFullWidth>
            <CustomStackFullWidth>
              <CustomStackFullWidth
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                pb="5px"
              >
                <Typography>{t("Pickup Address")}</Typography>
                <Button onClick={handleOpen}>
                  <Stack
                    gap="5px"
                    alignItems="center"
                    justifyContent="center"
                    direction="row"
                  >
                    <Typography
                      color={theme.palette.primary.main}
                      fontSize="12px"
                    >
                      {t("Set from map")}
                    </Typography>
                    <PinDropIcon
                      sx={{ width: "20px", height: "20px" }}
                      color="primary"
                    />
                  </Stack>
                </Button>
              </CustomStackFullWidth>
              <GetLocationFrom
                handleLocation={handleLocation}
                sender="true"
                fromparcel="true"
                formattedAddress={senderFormattedAddress}
                currentLocationValue={currentLocationValue}
                testLocation={testLocation}
                setCurrentLactionValue={setCurrentLactionValue}
              />
            </CustomStackFullWidth>
            <CustomTextFieldWithFormik
              type="text"
              label={t("Street number")}
              touched={addAddressFormik.touched.road}
              errors={addAddressFormik.errors.road}
              fieldProps={addAddressFormik.getFieldProps("senderRoad")}
              onChangeHandler={senderRoadHandler}
              value={addAddressFormik.values.road}
            />
            <CustomStackFullWidth direction="row" spacing={1.3}>
              <CustomTextFieldWithFormik
                type="text"
                label={t("House no.")}
                touched={addAddressFormik.touched.house}
                errors={addAddressFormik.errors.house}
                fieldProps={addAddressFormik.getFieldProps("senderHouse")}
                onChangeHandler={senderHouseHandler}
                value={addAddressFormik.values.senderPhone}
              />
              <CustomTextFieldWithFormik
                type="text"
                label={t("Floor no.")}
                touched={addAddressFormik.touched.floor}
                errors={addAddressFormik.errors.floor}
                fieldProps={addAddressFormik.getFieldProps("senderFloor")}
                onChangeHandler={senderFloorHandler}
                value={addAddressFormik.values.floor}
              />
            </CustomStackFullWidth>
            {getToken() && (
              <CustomStackFullWidth>
                <Card sx={{ padding: ".5rem" }} elevation={9}>
                  <SaveAddress
                    handleLocation={handleLocation}
                    configData={configData}
                    setSenderFormattedAddress={setSenderFormattedAddress}
                    setSenderLocation={setSenderLocation}
                    setSenderOptionalAddress={setSenderOptionalAddress}
                    sender="true"
                  />
                </Card>
              </CustomStackFullWidth>
            )}

            {/*<CustomStackFullWidth>*/}
            {/*  <CustomTextFieldWithFormik*/}
            {/*    type="text"*/}
            {/*    label={t("Street number")}*/}
            {/*    touched={addAddressFormik.touched.senderRoad}*/}
            {/*    errors={addAddressFormik.errors.senderRoad}*/}
            {/*    fieldProps={addAddressFormik.getFieldProps("senderRoad")}*/}
            {/*    onChangeHandler={senderRoadHandler}*/}
            {/*    value={addAddressFormik.values.senderRoad}*/}
            {/*  />*/}
            {/*</CustomStackFullWidth>*/}
            {/*<CustomStackFullWidth direction="row" spacing={1.3}>*/}
            {/*  <CustomTextFieldWithFormik*/}
            {/*    type="text"*/}
            {/*    label={t("House no.")}*/}
            {/*    touched={addAddressFormik.touched.senderHouse}*/}
            {/*    errors={addAddressFormik.errors.senderHouse}*/}
            {/*    fieldProps={addAddressFormik.getFieldProps("senderHouse")}*/}
            {/*    onChangeHandler={senderHouseHandler}*/}
            {/*    value={addAddressFormik.values.senderHouse}*/}
            {/*  />*/}
            {/*  <CustomTextFieldWithFormik*/}
            {/*    type="text"*/}
            {/*    label={t("Floor no.")}*/}
            {/*    touched={addAddressFormik.touched.senderFloor}*/}
            {/*    errors={addAddressFormik.errors.senderFloor}*/}
            {/*    fieldProps={addAddressFormik.getFieldProps("senderFloor")}*/}
            {/*    onChangeHandler={senderFloorHandler}*/}
            {/*    value={addAddressFormik.values.senderFloor}*/}
            {/*  />*/}
            {/*</CustomStackFullWidth>*/}
          </CustomStackFullWidth>
        </CustomStackFullWidth>
      </Card>
      {open && (
        <MapModal
          open={open}
          handleClose={handleClose}
          coords={coords}
          setSenderFormattedAddress={setSenderFormattedAddress}
          setSenderLocation={setSenderLocation}
          handleLocation={handleLocation}
          toparcel="1"
        />
      )}
    </CustomStackFullWidth>
  );
};

export default SenderInfoForm;
