import { alpha, Grid, InputAdornment, Stack, Typography, Box } from "@mui/material";
import CustomTextFieldWithFormik from "components/form-fields/CustomTextFieldWithFormik";
import { t } from "i18next";
import RoomIcon from "@mui/icons-material/Room";
import React, { useEffect } from "react";
import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";
import CustomSelectWithFormik from "components/custom-select/CustomSelectWithFormik";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ImageUploaderWithPreview from "components/single-file-uploader-with-preview/ImageUploaderWithPreview";
import useGetVehicleList from "api-manage/hooks/react-query/vehicle-list/vehicle-list";
import useGetZoneList from "api-manage/hooks/react-query/zone-list/zone-list";
import { DELIVERY_MAN_TYPE } from "./constants";
import { useTheme } from "@emotion/react";
import InputLabel from "@mui/material/InputLabel";
import PeopleIcon from '@mui/icons-material/People';
import { toast } from "react-hot-toast";

const UserInfo = ({
  deliveryManFormik,
  image,
  setImage,
  handleFieldChange,
}) => {
  const theme = useTheme();
  const {
    data: zoneList,
    isLoading: zoneListLoading,

    refetch: zoneListRefetch,
  } = useGetZoneList();
  const {
    data: vehicleList,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetVehicleList();

  // Optionally trigger fetch on mount or other conditions

  useEffect(() => {
    typeof image !== "string" && handleFieldChange("image", image);
  }, [image]);

  useEffect(() => {
    refetch();
    zoneListRefetch(); // Fetches data when the component mounts
  }, []);

  const vehicleListOptions = vehicleList?.map((item) => {
    return {
      label: item?.type,
      value: item?.id.toString(),
    };
  });

  const zoneListOptions = zoneList?.map((item) => {
    return {
      label: item?.name,
      value: item?.id.toString(),
    };
  });

  const singleFileUploadHandlerForImage = (value) => {
    if (value.currentTarget.files[0].size > 1048576) {
      toast.error(t("Image size must be less than 1MB"));
      return;
    }
    setImage(value.currentTarget.files[0]);
  };
  const imageOnchangeHandlerForImage = (value) => {
    if (value.size > 1048576) {
      toast.error(t("Image size must be less than 1MB"));
      return;
    }
    setImage(value);
  };

  return (
    <>
      <CustomBoxFullWidth>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={9}>
            <Grid container columnSpacing={3}>
              <Grid item xs={12} sm={6}>
                <CustomTextFieldWithFormik
                  required
                  placeholder={t("First name")}
                  type="text"
                  label={t("First name")}
                  touched={deliveryManFormik.touched.f_name}
                  errors={deliveryManFormik.errors.f_name}
                  fieldProps={deliveryManFormik.getFieldProps("f_name")}
                  onChangeHandler={(value) => {
                    handleFieldChange("f_name", value);
                  }}
                  value={deliveryManFormik.values.f_name}
                  fontSize="12px"
                  startIcon={
                    <InputAdornment position="start">
                      <AccountCircleIcon
                        sx={{
                          color:
                            deliveryManFormik.touched.f_name &&
                              !deliveryManFormik.errors.f_name
                              ? theme.palette.primary.main
                              : alpha(theme.palette.neutral[400], 0.7),
                          fontSize: "18px",
                        }}
                      />
                    </InputAdornment>
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextFieldWithFormik
                  required
                  placeholder={t("Last name")}
                  type="text"
                  label={t("Last name")}
                  fieldProps={deliveryManFormik.getFieldProps("l_name")}
                  onChangeHandler={(value) => {
                    handleFieldChange("l_name", value);
                  }}
                  value={deliveryManFormik.values.l_name}
                  touched={deliveryManFormik.touched.l_name}
                  errors={deliveryManFormik.errors.l_name}
                  fontSize="12px"
                  startIcon={
                    <InputAdornment position="start">
                      <AccountCircleIcon
                        sx={{
                          color:
                            deliveryManFormik.touched.l_name &&
                              !deliveryManFormik.errors.l_name
                              ? theme.palette.primary.main
                              : alpha(theme.palette.neutral[400], 0.7),
                          fontSize: "18px",
                        }}
                      />
                    </InputAdornment>
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextFieldWithFormik
                  required
                  placeholder={t("Email")}
                  type="email"
                  label={t("Email")}
                  touched={deliveryManFormik.touched.email}
                  errors={deliveryManFormik.errors.email}
                  fieldProps={deliveryManFormik.getFieldProps("email")}
                  onChangeHandler={(value) => {
                    handleFieldChange("email", value);
                  }}
                  value={deliveryManFormik.values.email}
                  fontSize="12px"
                  startIcon={
                    <InputAdornment position="start">
                      <EmailIcon
                        sx={{
                          color:
                            deliveryManFormik.touched.email &&
                              !deliveryManFormik.errors.email
                              ? theme.palette.primary.main
                              : alpha(theme.palette.neutral[400], 0.7),
                          fontSize: "18px",
                        }}
                      />
                    </InputAdornment>
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} sx={{ minHeight: "5rem" }}>
                <CustomSelectWithFormik
                  required
                  selectFieldData={DELIVERY_MAN_TYPE}
                  inputLabel={t("Deliveryman Type")}
                  passSelectedValue={(value) => {
                    handleFieldChange("earning", value);
                  }}
                  touched={deliveryManFormik.touched.earning}
                  errors={deliveryManFormik.errors.earning}
                  fieldProps={deliveryManFormik.getFieldProps("earning")}
                  placeholder={t("Select Deliveryman Type")}
                  startIcon={
                    <RoomIcon
                      sx={{
                        color:
                          deliveryManFormik.touched.earning &&
                            !deliveryManFormik.errors.earning
                            ? theme.palette.primary.main
                            : alpha(theme.palette.neutral[400], 0.7),
                        fontSize: "18px",
                      }}
                    />
                  }
                />
              </Grid>
              {deliveryManFormik.values.earning === "1" && (
                <Grid item xs={12} sm={6} sx={{ minHeight: "5rem" }}>
                  <CustomTextFieldWithFormik
                    placeholder={t("Referral Code")}
                    type="text"
                    label={t("Referral Code")}
                    touched={deliveryManFormik.touched.referral_code}
                    errors={deliveryManFormik.errors.referral_code}
                    fieldProps={deliveryManFormik.getFieldProps("referral_code")}
                    onChangeHandler={(value) => {
                      handleFieldChange("referral_code", value);
                    }}
                    value={deliveryManFormik.values.referral_code}
                    fontSize="12px"
                    startIcon={
                      <InputAdornment position="start">
                        <PeopleIcon
                          sx={{
                            color: alpha(theme.palette.neutral[400], 0.7),
                            fontSize: "18px",
                          }}
                        />
                      </InputAdornment>
                    }
                  />
                </Grid>
              )}
              <Grid item xs={12} sm={6} sx={{ minHeight: "5rem" }}>
                <CustomSelectWithFormik
                  required
                  selectFieldData={zoneListOptions}
                  inputLabel={t("Delivery Zone")}
                  passSelectedValue={(value) => {
                    handleFieldChange("zone_id", value);
                  }}
                  touched={deliveryManFormik.touched.zone_id}
                  errors={deliveryManFormik.errors.zone_id}
                  fieldProps={deliveryManFormik.getFieldProps("zone_id")}
                  placeholder={t("Delivery Zone")}
                  startIcon={
                    <LocationOnIcon
                      sx={{
                        color: alpha(theme.palette.neutral[400], 0.7),
                        fontSize: "18px",
                      }}
                    />
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} >
                <CustomSelectWithFormik
                  required
                  selectFieldData={vehicleListOptions}
                  inputLabel={t("Select Vehicle Type")}
                  passSelectedValue={(value) => {
                    handleFieldChange("vehicle_id", value);
                  }}
                  touched={deliveryManFormik.touched.vehicle_id}
                  errors={deliveryManFormik.errors.vehicle_id}
                  fieldProps={deliveryManFormik.getFieldProps("vehicle_id")}
                  placeholder={t("Select Vehicle Type")}
                  startIcon={
                    <DirectionsCarIcon
                      sx={{
                        color:
                          deliveryManFormik.touched.vehicle_id &&
                            !deliveryManFormik.errors.vehicle_id
                            ? theme.palette.primary.main
                            : alpha(theme.palette.neutral[400], 0.7),
                        fontSize: "18px",
                      }}
                    />
                  }
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            lg={3}
          >
            <Box
              sx={{
                backgroundColor: theme.palette.background.default,
                borderRadius: ".5rem",
                padding: "1rem",
                paddingBottom: "1.5rem",
                textAlign: "center",
                flexGrow: 1,
              }}>
              <Stack justifyContent="center" alignItems="center">
                <InputLabel
                  sx={{
                    fontWeight: "500",
                    color: (theme) => theme.palette.neutral[1000],
                  }}
                >
                  {t("Profile Image")}
                </InputLabel>
                <Typography fontSize="10px" mb="1rem">
                  {t("JPG, JPEG, PNG,WEBP Less Than 1MB (Ratio 2:1)")}
                </Typography>
                <ImageUploaderWithPreview
                  type="file"
                  labelText={t("Add Image")}
                  hintText="Image format - jpg, png, jpeg, gif, webp Image Size - maximum size 2 MB Image Ratio - 1:1"
                  file={image}
                  onChange={singleFileUploadHandlerForImage}
                  imageOnChange={imageOnchangeHandlerForImage}
                  width="8.75rem"
                  error={deliveryManFormik.errors.image}
                // borderRadius={borderRadius ?? "50%"}
                />
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </CustomBoxFullWidth>
    </>
  );
};

export default UserInfo;
