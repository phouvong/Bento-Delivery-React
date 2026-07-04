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
import { useTranslation } from "react-i18next";
import CustomTextFieldWithFormik from "../../form-fields/CustomTextFieldWithFormik";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddIcon from "@mui/icons-material/Add";
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
            {t("Receiver Details")}
          </Typography>

          <CustomStackFullWidth gap={{ xs: 1.25, sm: 1.75 }}>
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
                fontWeight={500}
                fontSize="13px"
                mb={0.75}
                color={theme.palette.text.primary}
              >
                {t("Receiver Location")}
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
                    color={
                      hasLocation
                        ? theme.palette.primary.main
                        : theme.palette.text.primary
                    }
                    fontWeight={700}
                    fontSize="13px"
                    lineHeight={1.2}
                  >
                    {hasLocation ? t("Receiver Location") : t("Set Location")}
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
                      ? receiverFormattedAddress
                      : t("A location where you want to send the parcel")}
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  sx={{
                    color: hasLocation
                      ? theme.palette.primary.main
                      : theme.palette.text.primary,
                    flexShrink: 0,
                  }}
                >
                  {hasLocation ? (
                    <EditOutlinedIcon sx={{ fontSize: "18px" }} />
                  ) : (
                    <AddIcon sx={{ fontSize: "20px" }} />
                  )}
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
