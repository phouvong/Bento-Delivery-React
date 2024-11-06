import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { CustomBoxFullWidth } from "components/chat/Chat.style";
import {
  alpha,
  Grid,
  InputAdornment,
  Typography,
  useTheme,
} from "@mui/material";
import CustomTextFieldWithFormik from "components/form-fields/CustomTextFieldWithFormik";
import CustomPhoneInput from "components/custom-component/CustomPhoneInput";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { getLanguage } from "helper-functions/getLanguage";
import RoomIcon from "@mui/icons-material/Room";
import React from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CustomDivider from "components/CustomDivider";
const OwnerForm = ({
  RestaurantJoinFormik,
  fNameHandler,
  lNameHandler,
  phoneHandler,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { configData } = useSelector((state) => state.configData);
  const lanDirection = getLanguage() ? getLanguage() : "ltr";
  return (
    <CustomStackFullWidth>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12} align="left">
          <Typography fontSize="18px" fontWeight="500">
            {t("Owner Information")}
          </Typography>
          <CustomDivider border="1px" paddingTop="5px" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CustomTextFieldWithFormik
            placeholder={t("First name")}
            required="true"
            type="text"
            label={t("First Name")}
            touched={RestaurantJoinFormik.touched.f_name}
            errors={RestaurantJoinFormik.errors.f_name}
            fieldProps={RestaurantJoinFormik.getFieldProps("f_name")}
            onChangeHandler={fNameHandler}
            value={RestaurantJoinFormik.values.f_name}
            fontSize="12px"
            startIcon={
              <InputAdornment position="start">
                <AccountCircleIcon
                  sx={{
                    color:
                      RestaurantJoinFormik.touched.restaurant_name &&
                      !RestaurantJoinFormik.errors.restaurant_name
                        ? theme.palette.primary.main
                        : alpha(theme.palette.neutral[400], 0.7),
                    fontSize: "18px",
                  }}
                />
              </InputAdornment>
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CustomTextFieldWithFormik
            required="true"
            type="text"
            placeholder={t("Last name")}
            label={t("Last Name")}
            touched={RestaurantJoinFormik.touched.l_name}
            errors={RestaurantJoinFormik.errors.l_name}
            fieldProps={RestaurantJoinFormik.getFieldProps("l_name")}
            onChangeHandler={lNameHandler}
            value={RestaurantJoinFormik.values.l_name}
            fontSize="12px"
            startIcon={
              <InputAdornment position="start">
                <AccountCircleIcon
                  sx={{
                    color:
                      RestaurantJoinFormik.touched.restaurant_name &&
                      !RestaurantJoinFormik.errors.restaurant_name
                        ? theme.palette.primary.main
                        : alpha(theme.palette.neutral[400], 0.7),
                    fontSize: "18px",
                  }}
                />
              </InputAdornment>
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CustomPhoneInput
            initCountry={configData?.country}
            value={RestaurantJoinFormik.values.phone}
            onHandleChange={phoneHandler}
            touched={RestaurantJoinFormik.touched.phone}
            errors={RestaurantJoinFormik.errors.phone}
            lanDirection={lanDirection}
            height="45px"
            borderRadius="10px"
          />
        </Grid>
      </Grid>
    </CustomStackFullWidth>
  );
};
export default OwnerForm;
