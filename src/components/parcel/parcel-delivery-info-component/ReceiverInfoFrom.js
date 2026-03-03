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
import MapIcon from '@mui/icons-material/Map';
import { getToken } from "helper-functions/getToken";

const ReceiverInfoFrom = ({
  addAddressFormik,
  receiverNameHandler,
  receiverPhoneHandler,
  roadHandler,
  houseHandler,
  floorHandler,
  handleLocation,
  coords,
  handleOpenSave,
  receiverFormattedAddress,
  receiverEmailHandler,
  configData,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
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

  const lanDirection = getLanguage() ? getLanguage() : "ltr";
  return (
    <CustomStackFullWidth height="100%">
      <Card sx={{ padding: "1.2rem", height: "100%", backgroundColor: theme.palette.background.paper, border: `1px solid rgba(0, 0, 0, 0.05)` }}>
        <CustomStackFullWidth gap={1}>
          <Stack align="left" mb={2} direction="row" spacing={1} alignItems="center">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_20439_65168)">
                <path d="M19.8521 13.26C19.8521 14.3258 19.423 15.353 18.6489 16.1399C18.58 16.2101 18.4821 16.2503 18.3791 16.2503H14.9401C4.08143 11.9987 8.85229 1.88867 8.85229 1.88867H16.1628L17.6661 6.25035L17.7861 9.60594L19.7048 12.1879C19.8027 12.5378 19.8521 12.8976 19.8521 13.26Z" fill="#EAAA83" />
                <path d="M14.9398 16.2503H6.85649L5.51138 12.1879L4.47876 9.06926V1.88867H8.85204C9.00806 5.55844 9.93399 13.531 14.9398 16.2503Z" fill="#DF8A57" />
                <path d="M19.704 12.1876H11.199C6.61944 10.3776 9.31592 6.25 9.31592 6.25H17.6653L19.6326 11.9576C19.6587 12.0336 19.6828 12.1104 19.704 12.1876Z" fill="#FBF198" />
                <path d="M11.1993 12.1876H5.51113L4.47852 9.06894V6.4882L5.9818 6.25H9.31621C9.65863 8.20359 10.2347 10.3323 11.1993 12.1876Z" fill="#F4E74D" />
                <path d="M1.008 11.958L4.47866 1.88867L7.94933 11.9581C8.09437 12.3788 8.16808 12.818 8.16808 13.2598C8.16808 14.3256 7.73894 15.3531 6.96491 16.1397L6.8562 16.2501H2.26187C2.15925 16.2501 2.06144 16.21 1.99226 16.1397C0.876985 15.0062 0.507649 13.4081 1.008 11.958Z" fill="#C76D33" />
                <path d="M17.0834 1.08078V1.10652C17.0834 1.70336 16.5995 2.1873 16.0022 2.1873H9.25781C6.28777 1.31031 8.96187 0 8.96187 0H16.0022C16.5995 0 17.0834 0.483945 17.0834 1.08078Z" fill="#DF8A57" />
                <path d="M9.2582 2.18727H5.08371C4.48687 2.18727 4.00293 1.70332 4.00293 1.10648V1.08074C4.00297 0.483945 4.48691 0 5.08371 0H8.96227C8.80996 0.438711 8.60535 1.38086 9.2582 2.18727Z" fill="#D97C41" />
                <path d="M16.5053 10.6251C17.2121 10.6251 17.785 10.1688 17.785 9.60602C17.785 9.04318 17.2121 8.58691 16.5053 8.58691C15.7985 8.58691 15.2256 9.04318 15.2256 9.60602C15.2256 10.1688 15.7985 10.6251 16.5053 10.6251Z" fill="#FFA1AC" />
                <path d="M9.56879 10.6251C10.2756 10.6251 10.8485 10.1688 10.8485 9.60602C10.8485 9.04318 10.2756 8.58691 9.56879 8.58691C8.86202 8.58691 8.28906 9.04318 8.28906 9.60602C8.28906 10.1688 8.86202 10.6251 9.56879 10.6251Z" fill="#FFA1AC" />
                <path d="M15.7595 8.92336C15.5876 8.92336 15.4482 8.78402 15.4482 8.61207V8.11402C15.4482 7.94207 15.5876 7.80273 15.7595 7.80273C15.9314 7.80273 16.0708 7.94207 16.0708 8.11402V8.61207C16.0708 8.78402 15.9315 8.92336 15.7595 8.92336Z" fill="#334151" />
                <path d="M13.0369 9.24734C12.6718 9.24734 12.3247 9.08925 12.0844 8.81363C11.9715 8.68402 11.985 8.48738 12.1146 8.37445C12.2442 8.26152 12.4408 8.27503 12.5538 8.4046C12.6757 8.54456 12.8518 8.6248 13.0368 8.6248C13.2219 8.6248 13.398 8.54456 13.5199 8.4046C13.6328 8.27503 13.8294 8.26152 13.9591 8.37445C14.0887 8.48742 14.1022 8.68402 13.9893 8.81363C13.7491 9.08925 13.402 9.24734 13.0369 9.24734Z" fill="#334151" />
                <path d="M10.7957 8.90969C10.6238 8.90969 10.4845 8.77035 10.4845 8.5984C10.4845 8.4518 10.3652 8.3325 10.2186 8.3325C10.072 8.3325 9.95266 8.4518 9.95266 8.5984C9.95266 8.77035 9.81332 8.90969 9.64137 8.90969C9.46941 8.90969 9.33008 8.77035 9.33008 8.5984C9.33008 8.10852 9.72863 7.70996 10.2185 7.70996C10.7084 7.70996 11.107 8.10852 11.107 8.5984C11.107 8.77031 10.9677 8.90969 10.7957 8.90969Z" fill="#334151" />
                <path d="M3.89851 16.5625L0.420419 18.8812C-0.0825496 19.2165 0.159443 20 0.759169 20H6.71101V19.375L3.89851 16.5625Z" fill="#36D49B" />
                <path d="M10.3679 15.2288L9.65284 15.4634C9.51761 15.5433 9.53745 15.7449 9.68601 15.7968L10.9775 16.107C11.1508 16.1676 12.1523 16.1987 12.3358 16.1984C12.581 16.1987 13.7013 16.2474 14.1398 16.0376L15.5238 15.373C16.0989 15.0968 16.7898 15.2924 17.1348 15.8291C17.5394 16.4586 17.3119 17.2998 16.6451 17.6395C14.8421 18.5582 14.5874 18.7648 13.9051 18.7648H9.42878C8.58128 18.7648 7.75894 19.0074 7.05441 19.4542C6.61905 19.7302 6.26112 19.1241 5.89663 18.7596L4.37319 17.4236C3.94058 16.991 3.54698 16.4585 3.9796 16.0258L4.89999 15.1055C5.51491 14.4905 6.25616 14.013 7.0771 13.7263C7.11651 13.7125 7.15675 13.6989 7.19745 13.6858C7.42331 13.6119 7.66249 13.5879 7.89956 13.6041C8.1898 13.6242 9.15562 13.4915 9.9332 13.3782C10.3651 13.3153 10.7844 13.5535 10.9517 13.9565C11.1647 14.4697 10.8959 15.0555 10.3679 15.2288Z" fill="#FFDDCF" />
                <path d="M3.45649 16.9439L6.32911 19.8165C6.57317 20.0606 6.96891 20.0606 7.21297 19.8165C7.45704 19.5725 7.45704 19.1767 7.21297 18.9326L4.34032 16.06C4.09625 15.8159 3.70051 15.8159 3.45645 16.06C3.21243 16.3041 3.21243 16.6998 3.45649 16.9439Z" fill="#80E0B7" />
              </g>
              <defs>
                <clipPath id="clip0_20439_65168">
                  <rect width="20" height="20" fill="white" />
                </clipPath>
              </defs>
            </svg>

            <Typography fontWeight={500} fontSize="16px">
              {t("Receiver Information")}
            </Typography>
          </Stack>
          <CustomStackFullWidth alignItems="center" gap={{ xs: 0.5, sm: 1.5 }}>
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
                backgroundColor
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
              backgroundColor
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
                required
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
                <Typography></Typography>
                {getToken() ? (
                  <Button onClick={() => handleOpenSave("receiver")} sx={{ p: 0 }}>
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
                  fromparcel="true"
                  handleLocation={handleLocation}
                  formattedAddress={receiverFormattedAddress}
                  currentLocationValue={currentLocationValue}
                  setCurrentLactionValue={setCurrentLactionValue}
                  testLocation={testLocation}
                  toReceiver="true"
                  setOpen={setOpen}
                  handleOpen={handleOpen}
                />
              </CustomStackFullWidth>

            </CustomStackFullWidth>
            <CustomStackFullWidth>
              <CustomTextFieldWithFormik
                type="text"
                label={t("Street number")}
                touched={addAddressFormik.touched.road}
                errors={addAddressFormik.errors.road}
                fieldProps={addAddressFormik.getFieldProps("road")}
                onChangeHandler={roadHandler}
                value={addAddressFormik.values.road}
                backgroundColor
              />
            </CustomStackFullWidth>
            <CustomStackFullWidth direction="row" spacing={{ xs: 0.5, sm: 1.3 }}>
              <CustomTextFieldWithFormik
                type="text"
                label={t("House no.")}
                touched={addAddressFormik.touched.house}
                errors={addAddressFormik.errors.house}
                fieldProps={addAddressFormik.getFieldProps("house")}
                onChangeHandler={houseHandler}
                value={addAddressFormik.values.senderPhone}
                backgroundColor
              />
              <CustomTextFieldWithFormik
                type="text"
                label={t("Floor no.")}
                touched={addAddressFormik.touched.floor}
                errors={addAddressFormik.errors.floor}
                fieldProps={addAddressFormik.getFieldProps("floor")}
                onChangeHandler={floorHandler}
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
          toparcel="1"
          handleLocation={handleLocation}
          fromReceiver="1"
        />
      )}
    </CustomStackFullWidth>
  );
};

export default ReceiverInfoFrom;
