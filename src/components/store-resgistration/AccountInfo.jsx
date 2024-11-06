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
import LockIcon from "@mui/icons-material/Lock";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import React from "react";
import EmailIcon from "@mui/icons-material/Email";
import CustomDivider from "components/CustomDivider";

const AccountInfo = ({
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
            {t("Account Info")}
          </Typography>
          <CustomDivider border="1px" paddingTop="5px" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CustomTextFieldWithFormik
            required="true"
            type="text"
            label={t("Email")}
            touched={RestaurantJoinFormik.touched.email}
            errors={RestaurantJoinFormik.errors.email}
            fieldProps={RestaurantJoinFormik.getFieldProps("email")}
            onChangeHandler={fNameHandler}
            value={RestaurantJoinFormik.values.email}
            fontSize="12px"
            startIcon={
              <InputAdornment position="start">
                <EmailIcon
                  sx={{
                    color:
                      RestaurantJoinFormik.touched.email &&
                      !RestaurantJoinFormik.errors.email
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
            placeholder={t("Password")}
            required="true"
            type="password"
            label={t("Password")}
            touched={RestaurantJoinFormik.touched.password}
            errors={RestaurantJoinFormik.errors.password}
            fieldProps={RestaurantJoinFormik.getFieldProps("password")}
            onChangeHandler={lNameHandler}
            value={RestaurantJoinFormik.values.password}
            fontSize="12px"
            startIcon={
              <InputAdornment position="start">
                <LockIcon
                  sx={{
                    color:
                      RestaurantJoinFormik.touched.password &&
                      !RestaurantJoinFormik.errors.password
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
            placeholder={t("Confirm Password")}
            required="true"
            type="password"
            label={t("Confirm Password")}
            touched={RestaurantJoinFormik.touched.confirm_password}
            errors={RestaurantJoinFormik.errors.confirm_password}
            fieldProps={RestaurantJoinFormik.getFieldProps("confirm_password")}
            onChangeHandler={lNameHandler}
            value={RestaurantJoinFormik.values.confirm_password}
            fontSize="12px"
            startIcon={
              <InputAdornment position="start">
                <LockIcon
                  sx={{
                    color:
                      RestaurantJoinFormik.touched.confirm_password &&
                      !RestaurantJoinFormik.errors.confirm_password
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
    </CustomStackFullWidth>
  );
};
export default AccountInfo;
