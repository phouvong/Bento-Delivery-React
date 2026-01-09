import {
  Grid,
  InputAdornment,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import CustomSelectWithFormik from "components/custom-select/CustomSelectWithFormik";
import CustomTextFieldWithFormik from "components/form-fields/CustomTextFieldWithFormik";
import { t } from "i18next";
import RoomIcon from "@mui/icons-material/Room";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import BadgeIcon from "@mui/icons-material/Badge";
import React, { useEffect, useState } from "react";
import ImageUploaderWithPreview from "components/single-file-uploader-with-preview/ImageUploaderWithPreview";
import { alpha, Box, display } from "@mui/system";
import { IDENTITY_TYPE } from "./constants";
import { useTheme } from "@emotion/react";
import InputLabel from "@mui/material/InputLabel";
import MultiFileUploader from "components/multi-file-uploader/MultiFileUploader";
import { DeliveryCaption } from "components/checkout/CheckOut.style";
import InfoIcon from "@mui/icons-material/Info";

const acceptedFileInputFormat =
  "application/pdf,image/*,text/plain,.doc, .docx,.txt";
const supportedFormatMultiImages = [
  "jpg",
  "jpeg",
  "gif",
  "png",
  "pdf",
  "doc",
  "docx",
  "deb",
  "webp",
];
const IdentityInfo = ({
  deliveryManFormik,
  identityImage,
  setIdentityImage,
  handleFieldChange,
}) => {
  const theme = useTheme();
  useEffect(() => {
    typeof identityImage !== "string" &&
      handleFieldChange("identity_image", identityImage);
  }, [identityImage]);

  const fileImagesHandler = (files) => {
    setIdentityImage(files);
  };
  return (
    <>
      <CustomBoxFullWidth>
        <Grid container columnSpacing={3}>
          <Grid item xs={12} md={6} sx={{ minHeight: "5rem" }}>
            <CustomSelectWithFormik
              required
              selectFieldData={IDENTITY_TYPE}
              inputLabel={t("Identity Type")}
              passSelectedValue={(value) => {
                handleFieldChange("identity_type", value);
              }}
              touched={deliveryManFormik.touched.identity_type}
              errors={deliveryManFormik.errors.identity_type}
              fieldProps={deliveryManFormik.getFieldProps("identity_type")}
              placeholder={t("Select Identity Type")}
              startIcon={
                <BadgeIcon
                  sx={{
                    color:
                      deliveryManFormik.touched.identity_type &&
                        !deliveryManFormik.errors.identity_type
                        ? theme.palette.primary.main
                        : alpha(theme.palette.neutral[400], 0.7),
                    fontSize: "18px",
                  }}
                />
              }
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextFieldWithFormik
              required
              type="number"
              label={t("Identity Number")}
              touched={deliveryManFormik.touched.identity_number}
              errors={deliveryManFormik.errors.identity_number}
              fieldProps={deliveryManFormik.getFieldProps(
                "identity_number"
              )}
              onChangeHandler={(value) => {
                handleFieldChange("identity_number", value);
              }}
              value={deliveryManFormik.values.identity_number}
              placeholder={t("Enter Identity Number")}
              fontSize="12px"
              startIcon={
                <InputAdornment position="start">
                  <BadgeIcon
                    sx={{
                      color:
                        deliveryManFormik.touched.identity_number &&
                          !deliveryManFormik.errors.identity_number
                          ? theme.palette.primary.main
                          : alpha(theme.palette.neutral[400], 0.7),
                      fontSize: "18px",
                    }}
                  />
                </InputAdornment>
              }
            />
          </Grid>
        </Grid>

        <CustomStackFullWidth spacing={2}>
          <Stack
            direction="row"
            flexWrap="wrap"
            width="100%"
            spacing={1}
            alignItems="center"
          >
            <InputLabel
              sx={{
                fontWeight: "500",
                color: (theme) => theme.palette.neutral[1000],
              }}
            >
              {t("Identity Image")}
            </InputLabel>
            <Typography fontSize="10px">
              ({t("JPG, JPEG, PNG ,WEBP Less Than 1MB Ratio 1:1")})
            </Typography>
          </Stack>

          <MultiFileUploader
            fileImagesHandler={fileImagesHandler}
            totalFiles={identityImage}
            maxFileSize={1024 * 1024}
            supportedFileFormats={supportedFormatMultiImages}
            acceptedFileInputFormat={acceptedFileInputFormat}
          />
        </CustomStackFullWidth>
      </CustomBoxFullWidth>
    </>
  );
};

export default IdentityInfo;
