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
];
const IdentityInfo = ({
  deliveryManFormik,
  identityHandler,
  identityNumberHandler,
  handleIdentityImageUpload,
  identityImage,
  setIdentityImage,
  handleFieldChange,
}) => {
  const theme = useTheme();
  useEffect(() => {
    typeof identityImage !== "string" &&
      handleFieldChange("identity_image", identityImage);
  }, [identityImage]);
  // const singleFileUploadHandlerForImage = (value) => {
  //   setIdentityImage(value.currentTarget.files[0]);
  // };
  // const imageOnchangeHandlerForImage = (value) => {
  //   setIdentityImage(value);
  // };
  const fileImagesHandler = (files) => {
    setIdentityImage(files);
  };
  return (
    <>
      <CustomBoxFullWidth>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={6}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <CustomSelectWithFormik
                  selectFieldData={IDENTITY_TYPE}
                  inputLabel={t("Identity Type")}
                  passSelectedValue={(value) => {
                    handleFieldChange("identity_type", value);
                  }}
                  touched={deliveryManFormik.touched.identity_type}
                  errors={deliveryManFormik.errors.identity_type}
                  fieldProps={deliveryManFormik.getFieldProps("identity_type")}
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
              <Grid item xs={12}>
                <CustomTextFieldWithFormik
                  placeholder={t("Identity Number")}
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
          </Grid>
          <Grid item xs={12} lg={6}>
            <CustomStackFullWidth spacing={2.5}>
              <Stack
                direction="row"
                width="100%"
                spacing={1}
                alignItems="center"
              >
                <InputLabel
                  sx={{
                    fontWeight: "600",
                    color: (theme) => theme.palette.neutral[1000],
                  }}
                >
                  {t("Identity Image")}
                </InputLabel>
                <Typography fontSize="12px">
                  {t("JPG, JPEG, PNG Less Than 1MB (Ratio 1:1)")}
                </Typography>
              </Stack>

              <MultiFileUploader
                fileImagesHandler={fileImagesHandler}
                totalFiles={identityImage}
                maxFileSize={20000000}
                supportedFileFormats={supportedFormatMultiImages}
                acceptedFileInputFormat={acceptedFileInputFormat}
                gridControl="true"
              />
            </CustomStackFullWidth>
            {/*<Stack alignItems="start" justifyContent="flex-start" spacing={2}>*/}
            {/*  <Stack*/}
            {/*    direction="row"*/}
            {/*    width="100%"*/}
            {/*    spacing={1}*/}
            {/*    alignItems="center"*/}
            {/*  >*/}
            {/*    <InputLabel*/}
            {/*      sx={{*/}
            {/*        fontWeight: "600",*/}
            {/*        color: (theme) => theme.palette.neutral[1000],*/}
            {/*      }}*/}
            {/*    >*/}
            {/*      {t("Identity Image")}*/}
            {/*    </InputLabel>*/}
            {/*    <Typography fontSize="12px">*/}
            {/*      {t("JPG, JPEG, PNG Less Than 1MB (Ratio 2:1)")}*/}
            {/*    </Typography>*/}
            {/*  </Stack>*/}

            {/*  <MultiFileUploader*/}
            {/*    fileImagesHandler={fileImagesHandler}*/}
            {/*    totalFiles={identityImage}*/}
            {/*    maxFileSize={20000000}*/}
            {/*    supportedFileFormats={supportedFormatMultiImages}*/}
            {/*    acceptedFileInputFormat={acceptedFileInputFormat}*/}
            {/*    labelText={t("Identity Image")}*/}
            {/*    width="10rem"*/}
            {/*  />*/}
            {/*  <ImageUploaderWithPreview*/}
            {/*    type="file"*/}
            {/*    labelText={t("Identity Image")}*/}
            {/*    hintText="Image format - jpg, png, jpeg, gif Image Size - maximum size 2 MB Image Ratio - 1:1"*/}
            {/*    file={identityImage}*/}
            {/*    onChange={singleFileUploadHandlerForImage}*/}
            {/*    imageOnChange={imageOnchangeHandlerForImage}*/}
            {/*    width="8.75rem"*/}
            {/*    marginLeft="0px"*/}
            {/*    error={deliveryManFormik.errors.identity_image}*/}
            {/*    // borderRadius={borderRadius ?? "50%"}*/}
            {/*  />*/}
            {/*</Stack>*/}
          </Grid>
        </Grid>
      </CustomBoxFullWidth>
    </>
  );
};

export default IdentityInfo;
