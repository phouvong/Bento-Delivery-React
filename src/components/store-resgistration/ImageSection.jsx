import React from "react";
import { CustomBoxFullWidth } from "components/chat/Chat.style";
import { useTranslation } from "react-i18next";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import InputLabel from "@mui/material/InputLabel";
import ImageUploaderWithPreview from "components/single-file-uploader-with-preview/ImageUploaderWithPreview";
import { CustomTypography } from "components/home/PromotionalBanner";
import { Typography } from "@mui/material";
import { Stack } from "@mui/system";

const ImageSection = ({
  RestaurantJoinFormik,
  singleFileUploadHandlerForImage,
  imageOnchangeHandlerForImage,
  singleFileUploadHandlerForCoverPhoto,
  imageOnchangeHandlerForCoverPhoto,
}) => {
  const { t } = useTranslation();
  return (
    <CustomStackFullWidth
      sx={{ flexDirection: { xs: "column", sm: "column", md: "row" } }}
      gap="20px"
    >
      <Stack spacing={1} mb=".8rem" sx={{ flexGrow: 1 }}>
        <InputLabel
          sx={{
            fontWeight: "600",
            color: (theme) => theme.palette.neutral[1000],
          }}
        >
          {t("Cover Photo")}
        </InputLabel>
        <Typography fontSize="12px">
          {t("JPG, JPEG, PNG Less Than 1MB (Ratio 2:1)")}
        </Typography>
        <ImageUploaderWithPreview
          marginLeft="0px"
          type="file"
          labelText={t("Click to upload")}
          hintText="Image format - jpg, png, jpeg, gif Image Size - maximum size 2 MB Image Ratio - 1:1"
          file={RestaurantJoinFormik.values.cover_photo}
          onChange={singleFileUploadHandlerForCoverPhoto}
          imageOnChange={imageOnchangeHandlerForCoverPhoto}
          width="250px"
          error={
            RestaurantJoinFormik.touched.cover_photo &&
            RestaurantJoinFormik.errors.cover_photo
          }
        />
        {RestaurantJoinFormik.touched.cover_photo &&
          RestaurantJoinFormik.errors.cover_photo && (
            <Typography
              sx={{
                fontSize: "12px",
                ml: "10px",
                fontWeight: "inherit",
                color: (theme) => theme.palette.error.main,
              }}
            >
              {t("Cover photo is required")}
            </Typography>
          )}
      </Stack>
      <Stack spacing={1} mb=".8rem" sx={{ flexGrow: 0 }}>
        <InputLabel
          sx={{
            fontWeight: "600",
            color: (theme) => theme.palette.neutral[1000],
          }}
        >
          {t("Logo")}
        </InputLabel>
        <Typography fontSize="12px">
          {t("JPG, JPEG, PNG Less Than 1MB (Ratio 1:1)")}
        </Typography>
        <ImageUploaderWithPreview
          marginLeft="0px"
          type="file"
          labelText={t("Click to upload")}
          hintText="Image format - jpg, png, jpeg, gif Image Size - maximum size 2 MB Image Ratio - 1:1"
          file={RestaurantJoinFormik?.values?.logo}
          onChange={singleFileUploadHandlerForImage}
          imageOnChange={imageOnchangeHandlerForImage}
          width="150px"
          error={
            RestaurantJoinFormik.touched.logo &&
            RestaurantJoinFormik.errors.logo
          }
        />
        {RestaurantJoinFormik.touched.logo &&
          RestaurantJoinFormik.errors.logo && (
            <Typography
              sx={{
                fontSize: "12px",
                ml: "10px",
                fontWeight: "inherit",
                color: (theme) => theme.palette.error.main,
              }}
            >
              {t("Cover photo is required")}
            </Typography>
          )}
      </Stack>
    </CustomStackFullWidth>
  );
};
export default ImageSection;
