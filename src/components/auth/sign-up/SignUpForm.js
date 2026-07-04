import React from "react";
import CustomTextFieldWithFormik from "../../form-fields/CustomTextFieldWithFormik";
import CustomPhoneInput from "../../custom-component/CustomPhoneInput";
import { t } from "i18next";
import { alpha, Box, InputAdornment, NoSsr, useTheme } from "@mui/material";
import { getLanguage } from "helper-functions/getLanguage";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import LockIcon from "@mui/icons-material/Lock";
import GroupIcon from "@mui/icons-material/Group";

const showReferCode = (configData) =>
  configData?.customer_wallet_status === 1 &&
  configData?.ref_earning_status === 1;

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

  const iconColor = (touched, error) =>
    touched && !error
      ? theme.palette.primary.main
      : alpha(theme.palette.neutral[500], 0.4);

  return (
    <NoSsr>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          columnGap: "16px",
          rowGap: "16px",
        }}
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
                  color: iconColor(
                    signUpFormik.touched.name,
                    signUpFormik.errors.name,
                  ),
                }}
              />
            </InputAdornment>
          }
        />

        {showReferCode(configData) && (
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
                    color: iconColor(
                      signUpFormik.touched.ref_code,
                      signUpFormik.errors.ref_code,
                    ),
                  }}
                />
              </InputAdornment>
            }
          />
        )}

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
                  color: iconColor(
                    signUpFormik.touched.email,
                    signUpFormik.errors.email,
                  ),
                }}
              />
            </InputAdornment>
          }
        />

        <Box sx={{ pb: { xs: "16px", md: 0 } }}>
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
        </Box>

        <CustomTextFieldWithFormik
          required
          type="password"
          label={t("Password")}
          placeholder={t("Minimum 8 characters")}
          touched={signUpFormik.touched.password}
          errors={signUpFormik.errors.password}
          fieldProps={signUpFormik.getFieldProps("password")}
          onChangeHandler={passwordHandler}
          value={signUpFormik.values.password}
          startIcon={
            <InputAdornment position="start">
              <LockIcon
                sx={{
                  color: iconColor(
                    signUpFormik.touched.password,
                    signUpFormik.errors.password,
                  ),
                }}
              />
            </InputAdornment>
          }
        />

        <CustomTextFieldWithFormik
          required
          type="password"
          label={t("Confirm Password")}
          placeholder={t("Re-enter your password")}
          touched={signUpFormik.touched.confirm_password}
          errors={signUpFormik.errors.confirm_password}
          fieldProps={signUpFormik.getFieldProps("confirm_password")}
          onChangeHandler={confirmPasswordHandler}
          value={signUpFormik.values.confirm_password}
          startIcon={
            <InputAdornment position="start">
              <LockIcon
                sx={{
                  color: iconColor(
                    signUpFormik.touched.confirm_password,
                    signUpFormik.errors.confirm_password,
                  ),
                }}
              />
            </InputAdornment>
          }
        />
      </Box>
    </NoSsr>
  );
};

export default SignUpForm;
