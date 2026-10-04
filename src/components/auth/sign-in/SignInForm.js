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
import { useDispatch } from "react-redux";
import { setOpenForgotPasswordModal } from "redux/slices/utils";

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
  handleClose,
  isRemember,
  newLayout,
}) => {
  const lanDirection = getLanguage() ? getLanguage() : "ltr";

  const theme = useTheme();
  const textColor = theme.palette.whiteContainer.main;
  const [isPhone, setIsPhone] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const value = loginFormik.values.email_or_phone;

    const filterInput = checkInput(value);
    if (filterInput === "phone") {
      setIsPhone("phone");
    } else {
      setIsPhone("email");
    }
  }, [loginFormik.values.email_or_phone]);

  if (newLayout) {
    return (
      <form
        noValidate
        onSubmit={loginFormik.handleSubmit}
        id="signin-form"
        style={{ flex: 1, display: "flex", flexDirection: "column" }}
      >
        <CustomStackFullWidth sx={{ gap: "32px", pt: "16px", flex: 1 }}>
          {/* Fields + remember row */}
          <CustomStackFullWidth sx={{ gap: "16px" }}>
            {/* Email/Phone field */}
            {isPhone === "phone" ? (
              <CustomPhoneInputManual
                id="signin-phone-input"
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
                id="signin-email-input"
                autoFocus={isPhone === "email"}
                required
                label={t("Email/Phone")}
                placeholder={t("Type your number or mail")}
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

            {/* Password field */}
            <CustomTextFieldWithFormik
              id="signin-password-input"
              height="45px"
              required="true"
              type="password"
              label={t("Password")}
              placeholder={t("Ex: 8+ Character")}
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

            {/* Remember me + Forgot password */}
            <CustomStackFullWidth
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ gap: "12px" }}
            >
              <FormControlLabel
                sx={{ m: 0, gap: "8px" }}
                control={
                  <Checkbox
                    id="signin-remember-checkbox"
                    size="small"
                    value="remember"
                    color="primary"
                    onChange={rememberMeHandleChange}
                    checked={isRemember || false}
                    sx={{ p: 0 }}
                  />
                }
                label={
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: 500,
                      letterSpacing: "-0.42px",
                      lineHeight: 1.1,
                      color: "text.secondary",
                      textTransform: "capitalize",
                    }}
                  >
                    {t("Remember me")}
                  </Typography>
                }
              />
              <Typography
                id="signin-forgot-password-link"
                onClick={() => {
                  dispatch(setOpenForgotPasswordModal(true));
                  handleClose();
                }}
                sx={{
                  fontSize: "14px",
                  fontWeight: 700,
                  letterSpacing: "-0.42px",
                  lineHeight: 1.1,
                  color: theme.palette.info?.blue ?? "#3979e0",
                  textTransform: "capitalize",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {t("Forgot Password ?")}
              </Typography>
            </CustomStackFullWidth>
          </CustomStackFullWidth>

          {/* Button + sign up footer */}
          <CustomStackFullWidth
            sx={{ flex: 1, justifyContent: "space-between" }}
          >
            <LoadingButton
              id="signin-submit-button"
              type="submit"
              fullWidth
              variant="contained"
              loading={isLoading}
              sx={{
                color: textColor,
                height: "44px",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: 700,
                letterSpacing: "-0.48px",
                lineHeight: 1.1,
                textTransform: "capitalize",
                boxShadow: "none",
                "&:hover": { boxShadow: "none" },
              }}
            >
              {t("Continue to Login")}
            </LoadingButton>

            {only && (
              <CustomStackFullWidth
                direction="row"
                alignItems="center"
                justifyContent="center"
                sx={{ gap: "4px", marginTop: "16px" }}
              >
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: 400,
                    letterSpacing: "-0.42px",
                    lineHeight: 1.2,
                    color: "text.secondary",
                  }}
                >
                  {t("New to {{name}}?", { name: configData?.business_name })}
                </Typography>
                <Typography
                  id="signin-signup-link"
                  onClick={handleSignUp}
                  sx={{
                    fontSize: "14px",
                    fontWeight: 600,
                    letterSpacing: "-0.42px",
                    lineHeight: 1.2,
                    color: theme.palette.info?.blue ?? "#3979e0",
                    cursor: "pointer",
                  }}
                >
                  {t("Sign Up")}
                </Typography>
              </CustomStackFullWidth>
            )}
          </CustomStackFullWidth>
        </CustomStackFullWidth>
      </form>
    );
  }

  return (
    <form noValidate onSubmit={loginFormik.handleSubmit} id="signin-form">
      <CustomStackFullWidth alignItems="center">
        <CustomStackFullWidth
          spacing={{ xs: 2, md: 3 }}
          sx={{ position: "relative" }}
        >
          {isPhone === "phone" ? (
            <CustomPhoneInputManual
              id="signin-phone-input"
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
              id="signin-email-input"
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
          {/* <TextField
        id="email-input" // 👈 unique id
        label="Email"
        variant="outlined"
        fullWidth
      /> */}
          <CustomTextFieldWithFormik
            id="signin-password-input"
            height="45px"
            required="true"
            type="password"
            label={t("Password")}
            placeholder={t("Minimum 8 characters")}
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
                  id="signin-remember-checkbox"
                  value="remember"
                  color="primary"
                  onChange={rememberMeHandleChange}
                  checked={isRemember || false}
                />
              }
              label={
                <CustomTypography fontSize="14px">
                  {t("Remember me")}
                </CustomTypography>
              }
            />
            <CustomLink
              id="signin-forgot-password-link"
              onClick={() => {
                dispatch(setOpenForgotPasswordModal(true));
                handleClose();
              }}
              sx={{ fontWeight: "400", fontSize: "14px" }}
            >
              {t("Forgot password?")}
            </CustomLink>
          </CustomStackFullWidth>
          <CustomStackFullWidth sx={{ paddingBottom: "5px" }}>
            <CustomColouredTypography
              id="signin-terms-link"
              onClick={handleClick}
              sx={{
                cursor: "pointer",
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
                {" "}
                {t("Terms & Conditions")}
              </Typography>
            </CustomColouredTypography>
          </CustomStackFullWidth>

          <CustomStackFullWidth spacing={2}>
            <LoadingButton
              id="signin-submit-button"
              type="submit"
              fullWidth
              variant="contained"
              loading={isLoading}
              sx={{ color: textColor }}
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
                    id="signin-signup-link"
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
