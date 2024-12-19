import React from "react";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import CustomTextFieldWithFormik from "../../form-fields/CustomTextFieldWithFormik";
import CustomPhoneInput from "../../custom-component/CustomPhoneInput";
import { t } from "i18next";
import { alpha, Grid, InputAdornment, NoSsr, useTheme } from "@mui/material";
import { getLanguage } from "helper-functions/getLanguage";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import LockIcon from "@mui/icons-material/Lock";
import GroupIcon from "@mui/icons-material/Group";

const SignUpForm = ({
  configData,
  handleOnChange,
  passwordHandler,
  lNameHandler,
  fNameHandler,
  confirmPasswordHandler,
  emailHandler,
  ReferCodeHandler,
  signUpFormik,
}) => {
  const lanDirection = getLanguage() ? getLanguage() : "ltr";
  const theme = useTheme();
  return (
    <NoSsr>
      <Grid container spacing={2.5}>
        <Grid
          item
          xs={12}
          md={
            configData?.customer_wallet_status === 1 &&
            configData?.ref_earning_status === 1
              ? 6
              : 12
          }
        >
          <CustomTextFieldWithFormik
            required
            label={t("User Name")}
            placeholder={t("Enter user name")}
            touched={signUpFormik.touched.name}
            errors={signUpFormik.errors.name}
            fieldProps={signUpFormik.getFieldProps("name")}
            onChangeHandler={fNameHandler}
            value={signUpFormik.values.name}
            startIcon={
              <InputAdornment position="start">
                <AccountCircleIcon
                  sx={{
                    color:
                      signUpFormik.touched.name && !signUpFormik.errors.name
                        ? theme.palette.primary.main
                        : alpha(theme.palette.neutral[500], 0.4),
                  }}
                />
              </InputAdornment>
            }
          />
        </Grid>
        {configData?.customer_wallet_status === 1 &&
          configData?.ref_earning_status === 1 && (
            <Grid item xs={12} md={6}>
              <CustomTextFieldWithFormik
                label={t("Refer Code (Optional)")}
                touched={signUpFormik.touched.ref_code}
                errors={signUpFormik.errors.ref_code}
                fieldProps={signUpFormik.getFieldProps("ref_code")}
                onChangeHandler={ReferCodeHandler}
                value={signUpFormik.values.ref_code}
                placeholder={t("Refer Code")}
                startIcon={
                  <InputAdornment position="start">
                    <GroupIcon
                      sx={{
                        color:
                          signUpFormik.touched.confirm_password &&
                          !signUpFormik.errors.confirm_password
                            ? theme.palette.primary.main
                            : alpha(theme.palette.neutral[500], 0.4),
                      }}
                    />
                  </InputAdornment>
                }
              />
            </Grid>
          )}
        <Grid item xs={12} md={6}>
          <CustomTextFieldWithFormik
            required
            label={t("Email")}
            placeholder={t("Email")}
            touched={signUpFormik.touched.email}
            errors={signUpFormik.errors.email}
            fieldProps={signUpFormik.getFieldProps("email")}
            onChangeHandler={emailHandler}
            value={signUpFormik.values.email}
            startIcon={
              <InputAdornment position="start">
                <MailIcon
                  sx={{
                    color:
                      signUpFormik.touched.email && !signUpFormik.errors.email
                        ? theme.palette.primary.main
                        : alpha(theme.palette.neutral[500], 0.4),
                  }}
                />
              </InputAdornment>
            }
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <CustomPhoneInput
            value={signUpFormik.values.phone}
            onHandleChange={handleOnChange}
            initCountry={configData?.country}
            touched={signUpFormik.touched.phone}
            errors={signUpFormik.errors.phone}
            lanDirection={lanDirection}
            height="45px"
            borderRadius="10px"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <CustomTextFieldWithFormik
            required
            type="password"
            label={t("Password")}
            placeholder={t("Password")}
            touched={signUpFormik.touched.password}
            errors={signUpFormik.errors.password}
            fieldProps={signUpFormik.getFieldProps("password")}
            onChangeHandler={passwordHandler}
            value={signUpFormik.values.password}
            startIcon={
              <InputAdornment position="start">
                <LockIcon
                  sx={{
                    color:
                      signUpFormik.touched.password &&
                      !signUpFormik.errors.password
                        ? theme.palette.primary.main
                        : alpha(theme.palette.neutral[500], 0.4),
                  }}
                />
              </InputAdornment>
            }
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <CustomTextFieldWithFormik
            required
            type="password"
            label={t("Confirm Password")}
            placeholder={t("Confirm Password")}
            touched={signUpFormik.touched.confirm_password}
            errors={signUpFormik.errors.confirm_password}
            fieldProps={signUpFormik.getFieldProps("confirm_password")}
            onChangeHandler={confirmPasswordHandler}
            value={signUpFormik.values.confirm_password}
            startIcon={
              <InputAdornment position="start">
                <LockIcon
                  sx={{
                    color:
                      signUpFormik.touched.confirm_password &&
                      !signUpFormik.errors.confirm_password
                        ? theme.palette.primary.main
                        : alpha(theme.palette.neutral[500], 0.4),
                  }}
                />
              </InputAdornment>
            }
          />
        </Grid>
      </Grid>
    </NoSsr>
  );
};

export default SignUpForm;
