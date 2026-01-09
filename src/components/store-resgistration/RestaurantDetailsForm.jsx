import React, { useEffect, useState } from "react";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { alpha, Grid, InputAdornment, useTheme, Stack } from "@mui/material";
import CustomTextFieldWithFormik from "../form-fields/CustomTextFieldWithFormik";
import { useTranslation } from "react-i18next";
import WorkIcon from "@mui/icons-material/Work";
import RoomIcon from "@mui/icons-material/Room";
import LandslideIcon from '@mui/icons-material/Landslide';
import CustomSelectWithFormik from "components/custom-select/CustomSelectWithFormik";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LangTab from "components/store-resgistration/LanTab";
import { useSelector } from "react-redux";
import CustomMultiSelect from "components/custom-multi-select/CustomMultiSelect";
import HailIcon from '@mui/icons-material/Hail';

export const checkTaxiModule = (value, moduleOption) => {
  const moduleObj = moduleOption?.find((item) => item.value === value);
  return moduleObj?.type === "rental";
};
const RestaurantDetailsForm = ({
  RestaurantJoinFormik,
  restaurantNameHandler,
  restaurantAddressHandler,
  restaurantvatHandler,
  zoneOption,
  zoneHandler,
  moduleHandler,
  moduleOption,
  handleTimeTypeChangeHandler,
  currentTab,
  handleCurrentTab,
  tabs,
  selectedLanguage,
  minDeliveryTimeHandler,
  maxDeliveryTimeHandler,
  pickupZoneHandler,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [address, setAddress] = React.useState("");
  const timeType = [
    { label: "Minute", value: "minute" },
    { label: "Hour", value: "hour" },
    { label: "Day", value: "day" },
  ];
  useEffect(() => {
    setAddress(
      RestaurantJoinFormik.values.restaurant_address?.[selectedLanguage]
    );
  }, [RestaurantJoinFormik.values.restaurant_address, selectedLanguage]);
  const { selectedModule } = useSelector((state) => state.utilsData);
  const [moduleType, SetModuleType] = useState("");
  useEffect(() => {
    SetModuleType(selectedModule?.module_type);
  }, [selectedModule]);


  return (
    <CustomStackFullWidth alignItems="center" key={address || selectedLanguage}>
      <Grid container spacing={{ xs: "0", md: "3" }}>
        <CustomStackFullWidth spacing={4}>
          <CustomStackFullWidth
            sx={{
              padding: { xs: "10px", md: "20px" },
              paddingBottom: "0px !important",
              borderRadius: "10px",
              gap: "0px",
              backgroundColor: (theme) => theme.palette.background.default,
            }}
          >
            <LangTab
              tabs={tabs}
              currentTab={currentTab}
              setCurrentTab={handleCurrentTab}
              fontSize=""
            />
            <Stack mt={4}>
              <CustomTextFieldWithFormik
                labelColor={alpha(theme.palette.neutral[1000], 0.8)}
                backgroundColor
                required="true"
                type="text"
                label={`${t("Business Name")} (${t(tabs[currentTab]?.value)})`}
                placeholder={t("Business name")}
                value={
                  RestaurantJoinFormik.values.restaurant_name[selectedLanguage]
                }
                touched={RestaurantJoinFormik.touched.restaurant_name}
                errors={RestaurantJoinFormik.errors.restaurant_name}
                onChangeHandler={restaurantNameHandler}
                fontSize="12px"
                startIcon={
                  <InputAdornment position="start">
                    <WorkIcon
                      sx={{
                        color:
                          RestaurantJoinFormik.touched.restaurant_name &&
                            !RestaurantJoinFormik.errors.restaurant_name
                            ? theme.palette.primary.main
                            : theme.palette.neutral[400],
                        fontSize: "18px",
                      }}
                    />
                  </InputAdornment>
                }
              />
            </Stack>
            <Stack>
              <CustomTextFieldWithFormik
                labelColor={alpha(theme.palette.neutral[1000], 0.8)}
                backgroundColor
                placeholder={t("Business address")}
                required="true"
                type="text"
                label={`${t("Business Address")} (${t(tabs[currentTab]?.value)})`}
                touched={RestaurantJoinFormik.touched.restaurant_address}
                errors={RestaurantJoinFormik.errors.restaurant_address}
                value={
                  RestaurantJoinFormik.values.restaurant_address?.[
                  selectedLanguage
                  ] || ""
                } // Use the selected language value
                onChangeHandler={restaurantAddressHandler}
                fontSize="12px"
                startIcon={
                  <InputAdornment position="start">
                    <RoomIcon
                      sx={{
                        color:
                          RestaurantJoinFormik.touched.restaurant_address &&
                            !RestaurantJoinFormik.errors.restaurant_address
                            ? theme.palette.primary.main
                            : alpha(theme.palette.neutral[400], 0.7),
                        fontSize: "18px",
                      }}
                    />
                  </InputAdornment>
                }
              />
            </Stack>
          </CustomStackFullWidth>

          <CustomStackFullWidth gap={{ xs: "30px", md: "30px" }}>
            <Grid item xs={12} sm={12} md={12}>
              <CustomSelectWithFormik
                labelColor={alpha(theme.palette.neutral[1000], 0.8)}
                selectFieldData={zoneOption}
                inputLabel={t("Business Zone")}
                passSelectedValue={zoneHandler}
                touched={RestaurantJoinFormik.touched.zoneId}
                errors={RestaurantJoinFormik.errors.zoneId}
                fieldProps={RestaurantJoinFormik.getFieldProps("zoneId")}
                placeholder={t("Select Business Zone")}
                required={true}
                startIcon={
                  <LandslideIcon
                    sx={{
                      color: alpha(theme.palette.neutral[400], 0.7),
                      fontSize: "18px",
                    }}
                  />
                }
              />
            </Grid>

            {RestaurantJoinFormik.values.zoneId && (
              <Grid item xs={12} sm={12} md={12}>
                <CustomSelectWithFormik
                  labelColor={alpha(theme.palette.neutral[1000], 0.8)}
                  selectFieldData={moduleOption}
                  inputLabel={t("Business Module")}
                  placeholder={t("Select Business Module")}
                  passSelectedValue={moduleHandler}
                  touched={RestaurantJoinFormik.touched.module_id}
                  errors={RestaurantJoinFormik.errors.module_id}
                  fieldProps={RestaurantJoinFormik.getFieldProps("module_id")}
                  required={true}
                  startIcon={
                    <WorkIcon
                      sx={{
                        color: alpha(theme.palette.neutral[400], 0.7),
                        fontSize: "18px",
                      }}
                    />
                  }
                />
              </Grid>
            )}
            {checkTaxiModule(
              RestaurantJoinFormik?.values?.module_id,
              moduleOption
            ) && (
                <Grid item xs={12} sm={12} md={12} >
                  <CustomMultiSelect
                    required
                    zoneOption={zoneOption}
                    label="Pickup Area"
                    placeholder={
                      RestaurantJoinFormik.values.pickup_zone_id.length < 1
                        ? "Select Pickup Area"
                        : ""
                    }
                    handleChange={pickupZoneHandler}
                    icon={
                      <HailIcon
                        sx={{
                          color:
                            RestaurantJoinFormik.touched.restaurant_name &&
                              !RestaurantJoinFormik.errors.restaurant_name
                              ? theme.palette.primary.main
                              : alpha(theme.palette.neutral[400], 0.7),
                          fontSize: "16px",
                        }}
                      />
                    }
                  />
                </Grid>
              )}

            <Grid item container xs={12} sm={12} md={12} spacing={{ xs: 0, md: 2 }}>
              <Grid item md={4} xs={12}>
                <CustomTextFieldWithFormik
                  labelColor={alpha(theme.palette.neutral[1000], 0.8)}
                  placeholder={
                    checkTaxiModule(
                      RestaurantJoinFormik?.values?.module_id,
                      moduleOption
                    )
                      ? t("Min Pickup Time")
                      : t("Min Delivery Time")
                  }
                  required="true"
                  type="number"
                  name="min_delivery_time"
                  label={
                    checkTaxiModule(
                      RestaurantJoinFormik?.values?.module_id,
                      moduleOption
                    )
                      ? t("Minimum Pickup Time")
                      : t("Minimum Delivery Time")
                  }
                  touched={RestaurantJoinFormik.touched.min_delivery_time}
                  errors={RestaurantJoinFormik.errors.min_delivery_time}
                  fieldProps={RestaurantJoinFormik.getFieldProps(
                    "min_delivery_time"
                  )}
                  onChangeHandler={minDeliveryTimeHandler}
                  value={RestaurantJoinFormik.values.min_delivery_time}
                  fontSize="12px"
                  startIcon={
                    <InputAdornment position="start">
                      <LocalShippingIcon
                        sx={{
                          color:
                            RestaurantJoinFormik.touched.min_delivery_time &&
                              !RestaurantJoinFormik.errors.min_delivery_time
                              ? theme.palette.primary.main
                              : alpha(theme.palette.neutral[400], 0.7),
                          fontSize: "18px",
                        }}
                      />
                    </InputAdornment>
                  }
                />
              </Grid>
              <Grid item md={4} xs={12}>
                <CustomTextFieldWithFormik
                  labelColor={alpha(theme.palette.neutral[1000], 0.8)}
                  placeholder={
                    checkTaxiModule(
                      RestaurantJoinFormik?.values?.module_id,
                      moduleOption
                    )
                      ? t("Max Pickup Time")
                      : t("Max Delivery Time")
                  }
                  required="true"
                  type="number"
                  name="max_delivery_time"
                  label={
                    checkTaxiModule(
                      RestaurantJoinFormik?.values?.module_id,
                      moduleOption
                    )
                      ? t("Maximum Pickup Time")
                      : t("Maximum Delivery Time")
                  }
                  touched={RestaurantJoinFormik.touched.max_delivery_time}
                  errors={RestaurantJoinFormik.errors.max_delivery_time}
                  fieldProps={RestaurantJoinFormik.getFieldProps(
                    "max_delivery_time"
                  )}
                  onChangeHandler={maxDeliveryTimeHandler}
                  value={RestaurantJoinFormik.values.max_delivery_time}
                  fontSize="12px"
                  startIcon={
                    <InputAdornment position="start">
                      <LocalShippingIcon
                        sx={{
                          color:
                            RestaurantJoinFormik.touched.max_delivery_time &&
                              !RestaurantJoinFormik.errors.max_delivery_time
                              ? theme.palette.primary.main
                              : alpha(theme.palette.neutral[400], 0.7),
                          fontSize: "18px",
                        }}
                      />
                    </InputAdornment>
                  }
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4}>
                <CustomSelectWithFormik
                  required={true}
                  labelColor={alpha(theme.palette.neutral[1000], 0.8)}
                  selectFieldData={timeType}
                  inputLabel={t("Duration type")}
                  passSelectedValue={handleTimeTypeChangeHandler}
                  touched={RestaurantJoinFormik.touched.delivery_time_type}
                  errors={RestaurantJoinFormik.errors.delivery_time_type}
                  placeholder={t("Select Duration")}
                  fieldProps={RestaurantJoinFormik.getFieldProps(
                    "delivery_time_type"
                  )}
                />
              </Grid>
            </Grid>
          </CustomStackFullWidth>
        </CustomStackFullWidth>
      </Grid>
    </CustomStackFullWidth>
  );
};
export default RestaurantDetailsForm;
