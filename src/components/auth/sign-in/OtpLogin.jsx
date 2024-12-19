import React from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { t } from "i18next";
import Typography from "@mui/material/Typography";
import {
  CustomColouredTypography,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import CustomPhoneInput from "components/custom-component/CustomPhoneInput";
import { Checkbox, FormControlLabel, useTheme } from "@mui/material";
import { getLanguage } from "helper-functions/getLanguage";
import configData from "redux/slices/configData";
import { CustomTypography } from "components/landing-page/hero-section/HeroSection.style";

const OtpLogin = ({
  otpLoginFormik,
  otpHandleChange,
  global,
  isLoading,
  handleClick,
  rememberMeHandleChange,
  fireBaseId,
  configData,
}) => {
  const theme = useTheme();
  const lanDirection = getLanguage() ? getLanguage() : "ltr";
  return (
    <CustomStackFullWidth>
      <Typography fontSize="18px" fontWeight="600" textAlign="left" mb="1rem">
        {t("Sign In")}
      </Typography>
      <form onSubmit={otpLoginFormik.handleSubmit} noValidate>
        <CustomStackFullWidth sx={{ gap: "14px" }}>
          <CustomPhoneInput
            value={otpLoginFormik.values.phone}
            onHandleChange={otpHandleChange}
            initCountry={configData?.country}
            touched={otpLoginFormik.touched.phone}
            errors={otpLoginFormik.errors.phone}
            rtlChange="true"
            borderRadius="10px"
            height="45px"
            lanDirection={lanDirection}
          />
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
          {/*<RememberMe rememberMeHandleChange={rememberMeHandleChange} />*/}
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
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              fontSize: "14px",
              fontWeight: "500",

              height: "45px",
            }}
            loading={isLoading}
            id={fireBaseId}
          >
            {t("Get OTP ")}
          </LoadingButton>
        </CustomStackFullWidth>
      </form>
    </CustomStackFullWidth>
  );
};

export default OtpLogin;
