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
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CustomPhoneInput from "../../custom-component/CustomPhoneInput";
import { getLanguage } from "helper-functions/getLanguage";
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
  senderEmailHandler,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const lanDirection = getLanguage() ? getLanguage() : "ltr";
  const hasLocation = !!senderFormattedAddress;

  return (
    <CustomStackFullWidth height="100%">
      <Card
        sx={{
          padding: { xs: "1rem", md: "1.5rem" },
          height: "100%",
          backgroundColor: (theme) =>
            theme.palette.mode === "dark"
              ? theme.palette.background.default
              : "#F7F7F7",
          border: `1px solid ${
            theme.palette.neutral?.[200] || "rgba(0, 0, 0, 0.06)"
          }`,
          borderRadius: "12px",
          boxShadow: "none",
        }}
      >
        <CustomStackFullWidth gap={1.5}>
          <Typography fontWeight={700} fontSize={{ xs: "16px", md: "18px" }}>
            {t("Sender Details")}
          </Typography>

          <CustomStackFullWidth gap={{ xs: 1.25, sm: 1.75 }}>
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

            <Box>
              <Typography
                fontWeight={500}
                fontSize="13px"
                mb={0.75}
                color={theme.palette.text.primary}
              >
                {t("Pickup Address")}
              </Typography>
              <Box
                onClick={handleOpen}
                sx={{
                  cursor: "pointer",
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${
                    theme.palette.neutral?.[200] || "rgba(0,0,0,0.06)"
                  }`,
                  borderRadius: "12px",
                  padding: "12px 14px",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 1.5,
                  transition: "background-color 0.2s",
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.06),
                  },
                }}
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    color={theme.palette.primary.main}
                    fontWeight={700}
                    fontSize="13px"
                    lineHeight={1.2}
                  >
                    {t("Current Location")}
                  </Typography>
                  <Typography
                    fontSize="12px"
                    color={
                      theme.palette.neutral?.[500] ||
                      theme.palette.text.secondary
                    }
                    sx={{
                      mt: 0.5,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {hasLocation
                      ? senderFormattedAddress
                      : t("A location where you want to pick up the parcel")}
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  sx={{
                    color: theme.palette.primary.main,
                    flexShrink: 0,
                  }}
                >
                  <EditOutlinedIcon sx={{ fontSize: "18px" }} />
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
