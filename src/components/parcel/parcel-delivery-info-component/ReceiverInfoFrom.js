import React, { useState } from "react";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import {
  alpha,
  Box,
  Card,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useTranslation } from "react-i18next";
import CustomTextFieldWithFormik from "../../form-fields/CustomTextFieldWithFormik";
import CustomPhoneInput from "../../custom-component/CustomPhoneInput";
import { getLanguage } from "helper-functions/getLanguage";
import dynamic from "next/dynamic";
const MapModal = dynamic(() => import("../../Map/MapModal"));

const ReceiverInfoFrom = ({
  addAddressFormik,
  receiverNameHandler,
  receiverPhoneHandler,
  handleLocation,
  coords,
  receiverFormattedAddress,
  receiverEmailHandler,
  configData,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const lanDirection = getLanguage() ? getLanguage() : "ltr";
  const hasLocation = !!receiverFormattedAddress;

  return (
    <CustomStackFullWidth height="100%">
      <Card
        sx={{
          padding: { xs: "16px", md: "20px" },
          height: "100%",
          backgroundColor: (theme) =>
            theme.palette.mode === "dark"
              ? theme.palette.background.default
              : "#F7F7F7",
          borderRadius: "16px",
          boxShadow: "none",
          overflow: "visible",
        }}
      >
        <CustomStackFullWidth gap={{ xs: 1.5, md: 2.5 }}>
          <Typography
            fontWeight={700}
            fontSize={{ xs: "16px", md: "20px" }}
            letterSpacing="-0.6px"
            color="neutral.1050"
          >
            {t("Receiver Details")}
          </Typography>

          <CustomStackFullWidth gap={{ xs: 1.5, md: 3 }}>
            <CustomTextFieldWithFormik
              required="true"
              type="text"
              label={t("Receiver Name")}
              placeholder={t("Enter receiver name")}
              touched={addAddressFormik.touched.receiverName}
              errors={addAddressFormik.errors.receiverName}
              fieldProps={addAddressFormik.getFieldProps("receiverName")}
              onChangeHandler={receiverNameHandler}
              value={addAddressFormik.values.receiverName}
              backgroundColor
            />
            <CustomTextFieldWithFormik
              required
              label={t("Email")}
              placeholder={t("Enter email")}
              touched={addAddressFormik.touched.receiverEmail}
              errors={addAddressFormik.errors.receiverEmail}
              fieldProps={addAddressFormik.getFieldProps("receiverEmail")}
              onChangeHandler={receiverEmailHandler}
              value={addAddressFormik.values.receiverEmail}
              backgroundColor
            />
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

            <Box>
              <Typography
                fontWeight={400}
                fontSize="16px"
                letterSpacing="-0.48px"
                mb={0.75}
                color="neutral.700"
              >
                {t("Receiver Location")}
              </Typography>
              <Box
                onClick={handleOpen}
                sx={{
                  cursor: "pointer",
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: "8px",
                  padding: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1.5,
                  transition: "background-color 0.2s",
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.06),
                  },
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  gap="12px"
                  sx={{ flex: 1, minWidth: 0 }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      backgroundColor: "background.secondary",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <i
                      className="fi fi-rr-marker"
                      style={{
                        fontSize: "14px",
                        lineHeight: 1,
                        display: "flex",
                        color: theme.palette.neutral[700],
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      color="neutral.1050"
                      fontWeight={700}
                      fontSize="14px"
                      lineHeight={1.1}
                    >
                      {hasLocation ? t("Receiver Location") : t("Set Location")}
                    </Typography>
                    <Typography
                      fontSize="14px"
                      color="neutral.500"
                      sx={{
                        mt: 0.5,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {hasLocation
                        ? receiverFormattedAddress
                        : t("A location where you want to send the parcel")}
                    </Typography>
                  </Box>
                </Stack>
                <IconButton
                  size="small"
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "8px",
                    color: theme.palette.primary.main,
                    flexShrink: 0,
                  }}
                >
                  <i
                    className={hasLocation ? "fi fi-rr-pencil" : "fi fi-rr-add"}
                    style={{ fontSize: "16px", lineHeight: 1, display: "flex" }}
                  />
                </IconButton>
              </Box>
            </Box>
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
