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
import { getToken } from "helper-functions/getToken";
import dynamic from "next/dynamic";
const MapModal = dynamic(() => import("../../Map/MapModal"));
import { IconButton, } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MapIcon from '@mui/icons-material/Map';
import InventoryIcon from "@mui/icons-material/Inventory";

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
  handleOpenSave,
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [currentLocationValue, setCurrentLactionValue] = useState({
    description: null,
  });
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

  const lanDirection = getLanguage() ? getLanguage() : "ltr";

  return (
    <CustomStackFullWidth height="100%">
      <Card sx={{ padding: "1.2rem", height: "100%", backgroundColor: theme.palette.background.paper, border: `1px solid rgba(0, 0, 0, 0.05)` }}>
        <CustomStackFullWidth gap={1}>
          <Stack
            align="left"
            width="100%"
            mb={2}
            direction="row"
            spacing={1}
            alignItems="center"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.2265 19.8932C18.1597 19.9612 18.0647 20.0002 17.9649 20.0002H13.8663C3.40223 16.044 9.60376 6.07422 9.60376 6.07422H15.8154L17.2731 10.3033L16.9692 13.3363L19.2504 16.0609C19.6312 17.427 19.2374 18.8661 18.2265 19.8932Z" fill="#EAAA83" />
              <path d="M13.8668 20.0002H6.79228L5.58974 16.3688L4.48657 13.0372V6.07422H9.60427C9.21427 10.2691 9.29802 17.416 13.8668 20.0002Z" fill="#DF8A57" />
              <path d="M19.2509 16.0604H10.5975C6.13703 14.0625 9.48312 10.3027 9.48312 10.3027H17.2736L19.1817 15.8378C19.207 15.9114 19.2303 15.9855 19.2509 16.0604Z" fill="#FBF198" />
              <path d="M10.5973 16.0604H7.92137L5.58949 16.3682L4.48633 13.0366V10.6058L5.94406 10.3027H9.48293C9.56586 12.243 9.8709 14.2867 10.5973 16.0604Z" fill="#F4E74D" />
              <path d="M1.12146 15.8384L4.48693 6.07422L7.8524 15.8384C7.99302 16.2464 8.06451 16.6723 8.06451 17.1007C8.06451 18.1343 7.64833 19.1306 6.89783 19.8934L6.79247 20.0004H2.33736C2.23783 20.0004 2.14302 19.9615 2.07591 19.8933C0.994466 18.7942 0.636302 17.2445 1.12146 15.8384Z" fill="#C76D33" />
              <path d="M15.9089 4.24211H14.848L10.3379 3.33301L6.0732 4.24211L6.09781 4.24832C5.56574 4.30527 5.15137 4.75555 5.15137 5.30273C5.15137 5.88848 5.62621 6.36336 6.21195 6.36336H15.9089C16.4947 6.36336 16.9695 5.88852 16.9695 5.30273C16.9695 4.71695 16.4947 4.24211 15.9089 4.24211Z" fill="#DF8A57" />
              <path d="M4.82617 1.54227C5.00055 0.985469 5.51641 0.606445 6.09988 0.606445H9.30125C11.6529 0.606445 13.9441 2.1507 14.8484 4.24266H11.5663C11.4097 4.24266 11.2576 4.26191 11.1122 4.2982C10.783 4.38039 10.6935 4.80543 10.964 5.01039L11.9575 5.76312C12.4941 6.16973 12.5809 6.94074 12.1502 7.45516C11.7475 7.93691 11.0368 8.01969 10.5335 7.6434L9.80828 7.10121C9.1682 6.62262 8.39043 6.36402 7.59121 6.36402H5.96457C5.6057 6.36402 5.26191 6.21949 5.01086 5.96305C4.81348 5.76145 4.68508 5.5025 4.64406 5.22336L4.37844 3.41555C4.34926 3.21691 4.36523 3.01426 4.42527 2.82266L4.82617 1.54227Z" fill="#FFDDCF" />
              <path d="M0 1.20738V5.45926C0 6.12609 0.522578 6.66664 1.16727 6.66664C2.14523 6.66664 3.15121 6.61883 4.09141 6.19391C4.30445 6.09707 4.50426 5.98125 4.6873 5.84844V0.818164C4.50426 0.685352 4.30445 0.569531 4.09141 0.472695C3.52836 0.218203 2.68887 0 1.4534 0C0.438828 0 0 0.528594 0 1.20738Z" fill="#36D49B" />
              <path d="M3.62598 3.48455C3.62598 4.88834 4.08598 6.28923 5.00598 6.61189C5.3793 6.73396 5.55918 6.64658 6.61301 6.39099C5.4182 6.39099 4.82082 4.93775 4.82082 3.48455C4.82082 2.03134 5.41824 0.578062 6.61301 0.578062L5.64223 0.342632C5.43352 0.284859 5.21168 0.289937 5.00598 0.357163C4.08598 0.679781 3.62598 2.08072 3.62598 3.48455Z" fill="#80E0B7" />
              <path d="M16.1491 14.5458C16.8345 14.5458 17.3901 14.1034 17.3901 13.5576C17.3901 13.0118 16.8345 12.5693 16.1491 12.5693C15.4638 12.5693 14.9082 13.0118 14.9082 13.5576C14.9082 14.1034 15.4638 14.5458 16.1491 14.5458Z" fill="#FFA1AC" />
              <path d="M9.42258 14.5458C10.1079 14.5458 10.6635 14.1034 10.6635 13.5576C10.6635 13.0118 10.1079 12.5693 9.42258 12.5693C8.73723 12.5693 8.18164 13.0118 8.18164 13.5576C8.18164 14.1034 8.73723 14.5458 9.42258 14.5458Z" fill="#FFA1AC" />
              <path d="M15.4257 12.8952C15.259 12.8952 15.1239 12.7601 15.1239 12.5934V12.1104C15.1239 11.9437 15.259 11.8086 15.4257 11.8086C15.5925 11.8086 15.7276 11.9437 15.7276 12.1104V12.5934C15.7276 12.7601 15.5925 12.8952 15.4257 12.8952Z" fill="#334151" />
              <path d="M12.786 13.2099C12.432 13.2099 12.0953 13.0565 11.8624 12.7892C11.7528 12.6635 11.766 12.4729 11.8916 12.3633C12.0173 12.2539 12.208 12.2669 12.3175 12.3926C12.4358 12.5283 12.6065 12.6062 12.786 12.6062C12.9654 12.6062 13.1362 12.5283 13.2544 12.3926C13.3639 12.2669 13.5545 12.2539 13.6803 12.3633C13.806 12.4729 13.8191 12.6635 13.7096 12.7892C13.4766 13.0565 13.14 13.2099 12.786 13.2099Z" fill="#334151" />
              <path d="M10.6124 12.8821C10.4457 12.8821 10.3106 12.747 10.3106 12.5803C10.3106 12.4381 10.1949 12.3225 10.0528 12.3225C9.91062 12.3225 9.79496 12.4381 9.79496 12.5803C9.79496 12.747 9.65984 12.8821 9.49312 12.8821C9.3264 12.8821 9.19128 12.747 9.19128 12.5803C9.19128 12.1052 9.57777 11.7188 10.0528 11.7188C10.5278 11.7188 10.9143 12.1052 10.9143 12.5803C10.9143 12.747 10.7791 12.8821 10.6124 12.8821Z" fill="#334151" />
            </svg>

            <Typography fontWeight={500} fontSize="16px">
              {t("Sender Information")}
            </Typography>
          </Stack>
          <CustomStackFullWidth alignItems="center" gap={{ xs: 0.5, sm: 1.5 }}>
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
                backgroundColor
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
              backgroundColor
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
                required
              />

            </CustomStackFullWidth>
            <CustomStackFullWidth>
              <CustomStackFullWidth
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                pb="5px"
              >
                <Typography></Typography>
                {getToken() ? (
                  <Button onClick={() => handleOpenSave("sender")} sx={{ p: 0 }}>
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
                        {t("Save Address")}
                      </Typography>
                      <PinDropIcon
                        sx={{ width: "20px", height: "20px" }}
                        color="primary"
                      />
                    </Stack>
                  </Button>
                ) : (
                  <Button onClick={handleOpen} sx={{ p: 0 }}>
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
                      <MapIcon
                        sx={{ width: "20px", height: "20px" }}
                        color="primary"
                      />
                    </Stack>
                  </Button>
                )}

              </CustomStackFullWidth>
              <CustomStackFullWidth sx={{ marginBottom: "1.5rem" }}>
                <GetLocationFrom
                  handleLocation={handleLocation}
                  sender="true"
                  fromparcel="true"
                  formattedAddress={senderFormattedAddress}
                  currentLocationValue={currentLocationValue}
                  testLocation={testLocation}
                  setCurrentLactionValue={setCurrentLactionValue}
                  setOpen={setOpen}
                  handleOpen={handleOpen}
                />
              </CustomStackFullWidth>
            </CustomStackFullWidth>
            <CustomTextFieldWithFormik
              type="text"
              label={t("Street number")}
              touched={addAddressFormik.touched.road}
              errors={addAddressFormik.errors.road}
              fieldProps={addAddressFormik.getFieldProps("senderRoad")}
              onChangeHandler={senderRoadHandler}
              value={addAddressFormik.values.road}
              backgroundColor
            />
            <CustomStackFullWidth direction="row" spacing={{ xs: 0.5, sm: 1.3 }}>
              <CustomTextFieldWithFormik
                type="text"
                label={t("House no.")}
                touched={addAddressFormik.touched.house}
                errors={addAddressFormik.errors.house}
                fieldProps={addAddressFormik.getFieldProps("senderHouse")}
                onChangeHandler={senderHouseHandler}
                value={addAddressFormik.values.senderPhone}
                backgroundColor
              />
              <CustomTextFieldWithFormik
                type="text"
                label={t("Floor no.")}
                touched={addAddressFormik.touched.floor}
                errors={addAddressFormik.errors.floor}
                fieldProps={addAddressFormik.getFieldProps("senderFloor")}
                onChangeHandler={senderFloorHandler}
                value={addAddressFormik.values.floor}
                backgroundColor
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
