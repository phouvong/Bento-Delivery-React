import React, { useEffect, useState } from "react";
import {
  CustomColouredTypography,
  CustomLink,
  CustomStackFullWidth,
  CustomTypographyGray,
} from "../../../styled-components/CustomStyles.style";
import CustomPhoneInput from "../../custom-component/CustomPhoneInput";
import CustomTextFieldWithFormik from "../../form-fields/CustomTextFieldWithFormik";
import { t } from "i18next";
import { getLanguage } from "../../../helper-functions/getLanguage";
import LockIcon from "@mui/icons-material/Lock";
import {
  InputAdornment,
  alpha,
  useTheme,
  FormControlLabel,
  Checkbox,
  Typography,
} from "@mui/material";
import CustomPhoneInputManual from "components/custom-component/CustomPhoneInputManual";
import { checkInput } from "utils/CustomFunctions";

import { CustomTypography } from "components/landing-page/hero-section/HeroSection.style";
import LoadingButton from "@mui/lab/LoadingButton";

import PhoneOrEmailIcon from "components/auth/asset/PhoneOrEmailIcon";

const SignInForm = ({
  loginFormik,
  configData,
  handleOnChange,
  passwordHandler,
  rememberMeHandleChange,
  isApiCalling,
  isLoading,
  handleSignUp,
  only,
  handleClick,
}) => {
  const lanDirection = getLanguage() ? getLanguage() : "ltr";
  const theme = useTheme();
  const textColor = theme.palette.whiteContainer.main;
  const [isPhone, setIsPhone] = useState("");

  useEffect(() => {
    const value = loginFormik.values.email_or_phone;

    const filterInput = checkInput(value);
    if (filterInput === "phone") {
      setIsPhone("phone");
    } else {
      setIsPhone("email");
    }
  }, [loginFormik.values.email_or_phone]);
  return (
    <form noValidate onSubmit={loginFormik.handleSubmit}>
      <CustomStackFullWidth alignItems="center">
        <CustomStackFullWidth
          spacing={{ xs: 2, md: 3 }}
          sx={{ position: "relative" }}
        >
          {isPhone === "phone" ? (
            <CustomPhoneInputManual
              value={loginFormik.values.email_or_phone}
              onHandleChange={handleOnChange}
              initCountry={configData?.country}
              touched={loginFormik.touched.email_or_phone}
              errors={loginFormik.errors.email_or_phone}
              lanDirection={lanDirection}
              height="45px"
              autoFocus
              borderRadius="10px"
            />
          ) : (
            <CustomTextFieldWithFormik
              autoFocus={isPhone === "email" && true}
              required
              label={t("Email/Phone")}
              placeholder={t("Email/Phone")}
              touched={loginFormik.touched.email_or_phone}
              errors={loginFormik.errors.email_or_phone}
              fieldProps={loginFormik.getFieldProps("email_or_phone")}
              onChangeHandler={handleOnChange}
              value={loginFormik.values.email_or_phone}
              startIcon={
                <InputAdornment position="start">
                  <PhoneOrEmailIcon
                    sx={{
                      color:
                        loginFormik.touched.email_or_phone &&
                        !loginFormik.errors.email_or_phone
                          ? theme.palette.primary.main
                          : alpha(theme.palette.neutral[500], 0.4),
                    }}
                  />
                </InputAdornment>
              }
            />
          )}

          <CustomTextFieldWithFormik
            height="45px"
            required="true"
            type="password"
            label={t("Password")}
            placeholder={t("Enter password")}
            touched={loginFormik.touched.password}
            errors={loginFormik.errors.password}
            fieldProps={loginFormik.getFieldProps("password")}
            onChangeHandler={passwordHandler}
            value={loginFormik.values.password}
            startIcon={
              <InputAdornment position="start">
                <LockIcon
                  sx={{
                    color:
                      loginFormik.touched.password &&
                      !loginFormik.errors.password
                        ? theme.palette.primary.main
                        : alpha(theme.palette.neutral[500], 0.6),
                  }}
                />
              </InputAdornment>
            }
          />
        </CustomStackFullWidth>
        <CustomStackFullWidth mt="10px" spacing={2}>
          <CustomStackFullWidth
            justifyContent="space-between"
            alignItems="center"
            direction="row"
          >
            <FormControlLabel
              control={
                <Checkbox
                  value="remember"
                  color="primary"
                  onChange={rememberMeHandleChange}
                />
              }
              label={
                <CustomTypography fontSize="14px">
                  {t("Remember me")}
                </CustomTypography>
              }
            />
            <CustomLink
              href="/forgot-password"
              sx={{ fontWeight: "400", fontSize: "14px" }}
            >
              {t("Forgot password?")}
            </CustomLink>
          </CustomStackFullWidth>
          <CustomStackFullWidth sx={{ paddingBottom: "5px" }}>
            <CustomColouredTypography
              onClick={handleClick}
              sx={{
                cursor: "pointer",
                // textDecoration: 'underline',
                fontWeight: "400",
                fontSize: "12px",
                [theme.breakpoints.down("sm")]: {
                  fontSize: "12px",
                  marginLeft: "0px",
                },
              }}
            >
              {t("* By login I Agree with all the")}
              <Typography
                component="span"
                color={theme.palette.primary.main}
                sx={{
                  textAlign: "center",
                  fontWeight: "400",
                  fontSize: "12px",
                }}
              >
                {t(" Terms & Conditions")}
              </Typography>
            </CustomColouredTypography>
          </CustomStackFullWidth>
          {/*<AcceptTermsAndConditions*/}
          {/*  handleCheckbox={handleCheckbox}*/}
          {/*  formikType={loginFormik}*/}
          {/*/>*/}
          <CustomStackFullWidth spacing={2}>
            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              loading={isLoading}
              sx={{ color: textColor }}
              id="recaptcha-container"
            >
              {t("Sign In")}
            </LoadingButton>

            {only && (
              <CustomStackFullWidth alignItems="center" spacing={0.5}>
                <CustomStackFullWidth
                  direction="row"
                  alignItems="center"
                  justifyContent="center"
                  spacing={0.5}
                >
                  <CustomTypography fontSize="14px">
                    {t("Don't have an account?")}
                  </CustomTypography>
                  <span
                    onClick={handleSignUp}
                    style={{
                      color: theme.palette.primary.main,
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                  >
                    {t("Sign Up")}
                  </span>
                </CustomStackFullWidth>
              </CustomStackFullWidth>
            )}
          </CustomStackFullWidth>
        </CustomStackFullWidth>
      </CustomStackFullWidth>
    </form>
  );
};

export default SignInForm;
