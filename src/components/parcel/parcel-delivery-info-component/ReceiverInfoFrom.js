import React, { useEffect, useState } from "react";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { Button, Card, Typography, useTheme } from "@mui/material";
import { Stack } from "@mui/system";
import { useTranslation } from "react-i18next";
import CustomTextFieldWithFormik from "../../form-fields/CustomTextFieldWithFormik";
import PinDropIcon from "@mui/icons-material/PinDrop";
import GetLocationFrom from "./GetLocationFrom";
import CustomPhoneInput from "../../custom-component/CustomPhoneInput";
import { getLanguage } from "helper-functions/getLanguage";
import dynamic from "next/dynamic";
const MapModal = dynamic(() => import("../../Map/MapModal"));
const ReceiverInfoFrom = ({
  addAddressFormik,
  receiverNameHandler,
  receiverPhoneHandler,
  roadHandler,
  houseHandler,
  floorHandler,
  handleLocation,
  coords,

  receiverFormattedAddress,
  receiverEmailHandler,
  configData,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [receiverOptionalAddress, setReceiverOptionalAddress] = useState({});
  const [open, setOpen] = useState(false);
  const [testLocation, setTestLocation] = useState(null);
  const [currentLocationValue, setCurrentLactionValue] = useState({
    description: null,
  });
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (receiverFormattedAddress) {
      setCurrentLactionValue({
        description: receiverFormattedAddress,
      });
      setTestLocation(receiverFormattedAddress);
    } else {
      setCurrentLactionValue({
        description: "",
      });
    }
  }, [receiverFormattedAddress]);

  useEffect(() => {
    roadHandler(
      receiverOptionalAddress?.road
        ? receiverOptionalAddress?.road
        : addAddressFormik.values.road
    );
    floorHandler(
      receiverOptionalAddress?.floor
        ? receiverOptionalAddress?.floor
        : addAddressFormik.values.floor
    );
    houseHandler(
      receiverOptionalAddress?.house
        ? receiverOptionalAddress?.house
        : addAddressFormik.values.house
    );
  }, [receiverOptionalAddress]);
  const lanDirection = getLanguage() ? getLanguage() : "ltr";
  return (
    <CustomStackFullWidth height="100%">
      <Card sx={{ padding: "1.2rem", height: "100%" }}>
        <CustomStackFullWidth spacing={2}>
          <Stack align="center">
            <Typography fontWeight={500} fontSize="16px">
              {t("Receiver Information")}
            </Typography>
          </Stack>
          <CustomStackFullWidth alignItems="center" spacing={3}>
            <CustomStackFullWidth alignItems="center">
              <CustomTextFieldWithFormik
                required="true"
                type="text"
                label={t("Receiver Name")}
                touched={addAddressFormik.touched.receiverName}
                errors={addAddressFormik.errors.receiverName}
                fieldProps={addAddressFormik.getFieldProps("receiverName")}
                onChangeHandler={receiverNameHandler}
                value={addAddressFormik.values.receiverName}
              />
            </CustomStackFullWidth>
            <CustomTextFieldWithFormik
              required
              label={t("Email")}
              touched={addAddressFormik.touched.receiverEmail}
              errors={addAddressFormik.errors.receiverEmail}
              fieldProps={addAddressFormik.getFieldProps("receiverEmail")}
              onChangeHandler={receiverEmailHandler}
              value={addAddressFormik.values.receiverEmail}
            />
            <CustomStackFullWidth alignItems="center">
              <CustomPhoneInput
                value={addAddressFormik.values.receiverPhone}
                onHandleChange={receiverPhoneHandler}
                initCountry={configData?.country}
                touched={addAddressFormik.touched.receiverPhone}
                errors={addAddressFormik.errors.receiverPhone}
                rtlChange="true"
                lanDirection={lanDirection}
                height="45px"
                borderRadius="8px"
              />
              {/*<CustomTextFieldWithFormik*/}
              {/*  required="true"*/}
              {/*  type="number"*/}
              {/*  label={t("Receiver Phone")}*/}
              {/*  touched={addAddressFormik.touched.receiverPhone}*/}
              {/*  errors={addAddressFormik.errors.receiverPhone}*/}
              {/*  fieldProps={addAddressFormik.getFieldProps("receiverPhone")}*/}
              {/*  onChangeHandler={receiverPhoneHandler}*/}
              {/*  value={addAddressFormik.values.receiverPhone}*/}
              {/*/>*/}
            </CustomStackFullWidth>
            <CustomStackFullWidth pb="4px">
              <CustomStackFullWidth
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                pb="5px"
              >
                <Typography>{t("Delivery Address")}</Typography>
                <Button onClick={() => handleOpen()}>
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
                fromparcel="true"
                handleLocation={handleLocation}
                formattedAddress={receiverFormattedAddress}
                currentLocationValue={currentLocationValue}
                setCurrentLactionValue={setCurrentLactionValue}
                testLocation={testLocation}
                toReceiver="true"
              />
            </CustomStackFullWidth>
            {/*<CustomStackFullWidth>*/}
            {/*  <Card sx={{ padding: "1rem" }} elevation={9}>*/}
            {/*    <SaveAddress*/}
            {/*      handleLocation={handleLocation}*/}
            {/*      configData={configData}*/}
            {/*      setReceiverFormattedAddress={setReceiverFormattedAddress}*/}
            {/*      setReceiverLocation={setReceiverLocation}*/}
            {/*      setReceiverOptionalAddress={setReceiverOptionalAddress}*/}
            {/*    />*/}
            {/*  </Card>*/}
            {/*</CustomStackFullWidth>*/}
            <CustomStackFullWidth>
              <CustomTextFieldWithFormik
                type="text"
                label={t("Street number")}
                touched={addAddressFormik.touched.road}
                errors={addAddressFormik.errors.road}
                fieldProps={addAddressFormik.getFieldProps("road")}
                onChangeHandler={roadHandler}
                value={addAddressFormik.values.road}
              />
            </CustomStackFullWidth>
            <CustomStackFullWidth direction="row" spacing={1.3}>
              <CustomTextFieldWithFormik
                type="text"
                label={t("House no.")}
                touched={addAddressFormik.touched.house}
                errors={addAddressFormik.errors.house}
                fieldProps={addAddressFormik.getFieldProps("house")}
                onChangeHandler={houseHandler}
                value={addAddressFormik.values.senderPhone}
              />
              <CustomTextFieldWithFormik
                type="text"
                label={t("Floor no.")}
                touched={addAddressFormik.touched.floor}
                errors={addAddressFormik.errors.floor}
                fieldProps={addAddressFormik.getFieldProps("floor")}
                onChangeHandler={floorHandler}
                value={addAddressFormik.values.floor}
              />
            </CustomStackFullWidth>
          </CustomStackFullWidth>
        </CustomStackFullWidth>
      </Card>
      {open && (
        <MapModal
          open={open}
          handleClose={handleClose}
          coords={coords}
          toparcel="1"
          handleLocation={handleLocation}
          fromReceiver="1"
        />
      )}
    </CustomStackFullWidth>
  );
};

export default ReceiverInfoFrom;
