import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
  alpha,
  Grid,
  InputAdornment,
  Typography,
  useTheme,
  Stack,
} from "@mui/material";
import CustomTextFieldWithFormik from "components/form-fields/CustomTextFieldWithFormik";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { getLanguage } from "helper-functions/getLanguage";
import LockIcon from "@mui/icons-material/Lock";
import React from "react";
import EmailIcon from "@mui/icons-material/Email";

const AccountInfo = ({
  RestaurantJoinFormik,
  fNameHandler,
  lNameHandler,
  phoneHandler,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <CustomStackFullWidth>
      <Typography fontSize={{xs: "16px", sm: "18px"}} fontWeight="500" textAlign="left" p={{xs: 1.2, sm: 2}} sx={{
          borderBottom: `1px solid ${alpha(
            theme.palette.neutral[400],
            0.2
          )}`,
        }}>
        {t("Account Info")}
      </Typography>
      <Stack p={2} pb={0} mt={2}>
        <Grid container columnSpacing={3}>
          <Grid item xs={12} md={12} align="left">
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <CustomTextFieldWithFormik
              labelColor={alpha(theme.palette.neutral[1000],0.8)}
              placeholder={t("Type your email")}
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
            labelColor={alpha(theme.palette.neutral[1000],0.8)}
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
            labelColor={alpha(theme.palette.neutral[1000],0.8)}
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
      </Stack>
    </CustomStackFullWidth>
  );
};
export default AccountInfo;
