import React, { useEffect } from "react";
import {
  CustomStackFullWidth,
  CustomTabs,
} from "styled-components/CustomStyles.style";
import { alpha, Grid, InputAdornment, useTheme } from "@mui/material";
import CustomTextFieldWithFormik from "../form-fields/CustomTextFieldWithFormik";
import { useTranslation } from "react-i18next";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import WorkIcon from "@mui/icons-material/Work";
import RoomIcon from "@mui/icons-material/Room";
import CustomSelectWithFormik from "components/custom-select/CustomSelectWithFormik";
import PaidIcon from "@mui/icons-material/Paid";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LangTab from "components/store-resgistration/LanTab";

const RestaurantDetailsForm = ({
  RestaurantJoinFormik,
  restaurantNameHandler,
  restaurantAddressHandler,
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
      RestaurantJoinFormik.values.restaurant_address[selectedLanguage]
    );
  }, [RestaurantJoinFormik.values.restaurant_address[selectedLanguage]]);
  return (
    <CustomStackFullWidth alignItems="center" key={address || selectedLanguage}>
      <Grid container spacing={{ xs: "0", md: "3" }}>
        <CustomStackFullWidth spacing={4}>
          <CustomStackFullWidth
            sx={{
              padding: { xs: "0px", md: "20px" },
              borderRadius: "10px",
              gap: "20px",
              backgroundColor: (theme) => theme.palette.background.default,
            }}
          >
            <LangTab
              tabs={tabs}
              currentTab={currentTab}
              setCurrentTab={handleCurrentTab}
              fontSize=""
            />
            <Grid item xs={12}>
              <CustomTextFieldWithFormik
                backgroundColor
                required="true"
                type="text"
                label={t("Store Name")}
                placeholder={t("Store name")}
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
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <CustomTextFieldWithFormik
                backgroundColor
                placeholder={t("Store address")}
                required="true"
                type="text"
                label={t("Store Address")}
                touched={RestaurantJoinFormik.touched.restaurant_address}
                errors={RestaurantJoinFormik.errors.restaurant_address}
                value={
                  RestaurantJoinFormik.values.restaurant_address[
                    selectedLanguage
                  ]
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
            </Grid>
          </CustomStackFullWidth>

          <CustomStackFullWidth gap={{ xs: "20px", md: "30px" }}>
            <Grid item xs={12} sm={12} md={12}>
              <CustomSelectWithFormik
                selectFieldData={zoneOption}
                inputLabel={t("Business Zone")}
                passSelectedValue={zoneHandler}
                touched={RestaurantJoinFormik.touched.zoneId}
                errors={RestaurantJoinFormik.errors.zoneId}
                fieldProps={RestaurantJoinFormik.getFieldProps("zoneId")}
                startIcon={
                  <RoomIcon
                    sx={{
                      color:
                        RestaurantJoinFormik.touched.zoneId &&
                        !RestaurantJoinFormik.errors.zoneId
                          ? theme.palette.primary.main
                          : alpha(theme.palette.neutral[400], 0.7),
                      fontSize: "18px",
                    }}
                  />
                }
              />
            </Grid>
            {RestaurantJoinFormik.values.zoneId && (
              <Grid item xs={12} sm={12} md={12}>
                <CustomSelectWithFormik
                  selectFieldData={moduleOption}
                  inputLabel={t("Business Module")}
                  passSelectedValue={moduleHandler}
                  touched={RestaurantJoinFormik.touched.module_id}
                  errors={RestaurantJoinFormik.errors.module_id}
                  fieldProps={RestaurantJoinFormik.getFieldProps("module_id")}
                  startIcon={
                    <RoomIcon
                      sx={{
                        color:
                          RestaurantJoinFormik.touched.module_id &&
                          !RestaurantJoinFormik.errors.module_id
                            ? theme.palette.primary.main
                            : alpha(theme.palette.neutral[400], 0.7),
                        fontSize: "18px",
                      }}
                    />
                  }
                />
              </Grid>
            )}

            <Grid item xs={12} sm={12} md={12}>
              <CustomTextFieldWithFormik
                required="true"
                type="number"
                label={t("VAT/TAX")}
                placeholder={t("VAT/TAX")}
                touched={RestaurantJoinFormik.touched.vat}
                errors={RestaurantJoinFormik.errors.vat}
                fieldProps={RestaurantJoinFormik.getFieldProps("vat")}
                onChangeHandler={restaurantNameHandler}
                value={RestaurantJoinFormik.values.vat}
                fontSize="12px"
                startIcon={
                  <InputAdornment position="start">
                    <PaidIcon
                      sx={{
                        color:
                          RestaurantJoinFormik.touched.vat &&
                          !RestaurantJoinFormik.errors.vat
                            ? theme.palette.primary.main
                            : alpha(theme.palette.neutral[400], 0.7),
                        fontSize: "18px",
                      }}
                    />
                  </InputAdornment>
                }
              />
            </Grid>
            <Grid item container xs={12} sm={12} md={12} spacing={2}>
              <Grid item md={4} xs={12}>
                <CustomTextFieldWithFormik
                  placeholder={t("Min Delivery Time")}
                  required="true"
                  type="number"
                  name="min_delivery_time"
                  label={t("Minimum Delivery Time")}
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
                  placeholder={t("Max Delivery Time")}
                  required="true"
                  type="number"
                  name="max_delivery_time"
                  label={t("Maximum Delivery Time")}
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
                  selectFieldData={timeType}
                  inputLabel={t("Duration type")}
                  passSelectedValue={handleTimeTypeChangeHandler}
                  touched={RestaurantJoinFormik.touched.delivery_time_type}
                  errors={RestaurantJoinFormik.errors.delivery_time_type}
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
