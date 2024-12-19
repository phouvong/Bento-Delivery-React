import React, { memo } from "react";
import { alpha, TextField, Typography } from "@mui/material";

import { t } from "i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputAdornment from "@mui/material/InputAdornment";
import MailIcon from "@mui/icons-material/Mail";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import GroupIcon from "@mui/icons-material/Group";
import { LoadingButton } from "@mui/lab";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import CustomImageContainer from "components/CustomImageContainer";
import CustomPhoneInput from "components/custom-component/CustomPhoneInput";
import { useSelector } from "react-redux";
import { getGuestId } from "helper-functions/getToken";
import { styled } from "@mui/system";
import { getLanguage } from "helper-functions/getLanguage";
export const CustomSignUpTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-input": {
    padding: "12.5px 0px !important",
    fontSize: "14px",
    fontWeight: "400",
    borderRadius: "4px",
    "&::placeholder": {
      color: alpha(theme.palette.neutral[400], 0.7), // Light placeholder color
    },
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: "4px",
    "& fieldset": {
      borderColor: alpha(theme.palette.neutral[400], 0.5), // Light outline color
      borderWidth: "1px", // Thin outline
    },
    "&:hover fieldset": {
      borderColor: alpha(theme.palette.neutral[600], 0.7), // Slightly darker on hover
    },
    "&.Mui-focused fieldset": {
      borderColor: alpha(theme.palette.primary.main, 0.7), // Light and thin border color on focus
      borderWidth: "1px", // Keep the outline thin on focus
    },
  },
  "& .MuiInputLabel-root": {
    color: theme.palette.neutral[1000],
    "&.Mui-focused": {
      color: (theme) => theme.palette.neutral[1000], // Set label color to black when focused
    },
    "&.MuiInputLabel-shrink": {
      transform: "translate(14px, -6px) scale(0.75) !important", // Adjust the label position and scale when it shrinks
      // Ensure it doesn’t overlap with the startAdornment
    },
  },
}));

const AddUserInfo = ({ formSubmitHandler, loginInfo, isLoading, userInfo }) => {
  const { configData } = useSelector((state) => state.configData);
  const lanDirection = getLanguage() ? getLanguage() : "ltr";
  const userInfoFormik = useFormik({
    initialValues: {
      name: userInfo?.name ? userInfo?.name : "",
      email: "",
      ref_code: "",
      phone: "",
    },
    validationSchema: Yup.object({
      // phone: Yup.string()
      //     .required(t('Please give a phone number'))
      //     .min(10, 'number must be 10 digits'),
    }),

    onSubmit: async (values, helpers) => {
      try {
        formSubmitHandler({
          ...values,
          login_type: loginInfo.login_type,
          phone: loginInfo?.is_email ? values?.phone : loginInfo.phone,
          email: loginInfo?.is_email ? loginInfo?.email : values?.email,
          guest_id: getGuestId(),
        });
      } catch (err) {}
    },
  });
  const otpHandleChange = (value) => {
    userInfoFormik.setFieldValue("phone", `+${value}`);
  };

  return (
    <>
      <CustomStackFullWidth
        spacing={3}
        sx={{ maxWidth: "400px", padding: "2rem" }}
      >
        <CustomStackFullWidth alignItems="center">
          <CustomImageContainer
            src={configData?.logo_full_url}
            maxWidth="300px"
            height="50px"
            alt="Logo"
            objectfit="contain"
          />
        </CustomStackFullWidth>
        <Typography textAlign="center" fontSize="14px" color="textSecondary">
          {t(
            "Just one step away! This will help make your profile more personalized."
          )}
        </Typography>
        <CustomStackFullWidth alignItems="center">
          <form
            onSubmit={userInfoFormik.handleSubmit}
            noValidate
            style={{ width: "100%" }}
          >
            <CustomStackFullWidth gap="36px">
              <CustomSignUpTextField
                required
                fullWidth
                id="name"
                label={t("Name")}
                placeholder={t("Name")}
                name="name"
                autoComplete="name"
                value={userInfoFormik.values.name}
                onChange={userInfoFormik.handleChange}
                error={
                  userInfoFormik.touched.name &&
                  Boolean(userInfoFormik.errors.name)
                }
                helperText={
                  userInfoFormik.touched.name && userInfoFormik.errors.name
                }
                touched={userInfoFormik.touched.name}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircleIcon
                        sx={{
                          fontSize: "1.2rem",
                          color: (theme) =>
                            alpha(theme.palette.neutral[400], 0.5),
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
                //  autoFocus
              />
              {loginInfo?.is_email ? (
                <CustomPhoneInput
                  value={userInfoFormik.values.phone}
                  onHandleChange={otpHandleChange}
                  initCountry={configData?.country}
                  touched={userInfoFormik.touched.phone}
                  errors={userInfoFormik.errors.phone}
                  rtlChange="true"
                  lanDirection={lanDirection}
                  height="45px"
                />
              ) : (
                <CustomSignUpTextField
                  required
                  fullWidth
                  id="email"
                  label={t("Email")}
                  name="email"
                  autoComplete="email"
                  placeholder={t("Email")}
                  value={userInfoFormik.values.email}
                  onChange={userInfoFormik.handleChange}
                  error={
                    userInfoFormik.touched.email &&
                    Boolean(userInfoFormik.errors.email)
                  }
                  helperText={
                    userInfoFormik.touched.email && userInfoFormik.errors.email
                  }
                  touched={userInfoFormik.touched.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MailIcon
                          sx={{
                            fontSize: "1.2rem",
                            color: (theme) =>
                              alpha(theme.palette.neutral[400], 0.5),
                          }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
              {configData?.customer_wallet_status === 1 &&
                configData?.ref_earning_status === 1 && (
                  <CustomSignUpTextField
                    fullWidth
                    id="ref_code"
                    label={t("Refer Code (Optional)")}
                    placeholder={t("Refer Code (Optional)")}
                    name="ref_code"
                    autoComplete="ref_code"
                    value={userInfoFormik.values.ref_code}
                    onChange={userInfoFormik.handleChange}
                    error={
                      userInfoFormik.touched.ref_code &&
                      Boolean(userInfoFormik.errors.ref_code)
                    }
                    helperText={
                      userInfoFormik.touched.ref_code &&
                      userInfoFormik.errors.ref_code
                    }
                    touched={userInfoFormik.touched.ref_code}
                    //   autoFocus
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <GroupIcon
                            sx={{
                              fontSize: "1.2rem",
                              color: (theme) =>
                                alpha(theme.palette.neutral[400], 0.5),
                            }}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}

              <LoadingButton
                type="submit"
                fullWidth
                sx={{
                  mt: 1,
                  mb: 3.5,
                  maxWidth: "400px",
                  height: "45px",
                }}
                loading={isLoading}
                variant="contained"
              >
                {t("Done")}
              </LoadingButton>
            </CustomStackFullWidth>
          </form>
        </CustomStackFullWidth>
      </CustomStackFullWidth>
    </>
  );
};

export default memo(AddUserInfo);
