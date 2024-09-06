import React, { useEffect, useRef, useState } from "react";
import { Box, Stack, Typography, TextField, useTheme } from "@mui/material";
import {
  CustomPaperBigCard,
  CustomStackFullWidth,
  StyledInputBase,
} from "styled-components/CustomStyles.style";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import OtpInput from "react-otp-input";

import LoadingButton from "@mui/lab/LoadingButton";

import * as Yup from "yup";

const OtpForm = ({ data, formSubmitHandler, isLoading, recaptcha }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [otp, setOtp] = useState("");
  const otpFormik = useFormik({
    //here reset_token is otp inputs
    initialValues: {
      reset_token: "",
      phone: data?.phone,
    },
    validationSchema: Yup.object({
      reset_token: Yup.string().required(t("field is empty")),
    }),
    onSubmit: async (values) => {
      try {
        formSubmitHandler(values);
      } catch (err) {}
    },
  });
  useEffect(() => {
    otpFormik.setFieldValue("reset_token", otp);
  }, [otp]);
  return (
    <CustomPaperBigCard width="auto" noboxshadow="true">
      <CustomStackFullWidth>
        <Stack alignItems="center" justifyContent="center">
          <Typography>
            {t("Enter the verification code (OTP) sent to")}
          </Typography>
          <Typography>{data?.phone}</Typography>
        </Stack>
        <form noValidate onSubmit={otpFormik.handleSubmit}>
          <Stack
            mt="2rem"
            padding="0 20px"
            alignItems="center"
            justifyContent="center"
          >
            <Box
              sx={{
                mt: 3,
                mb: 1,
                mx: "auto",
                maxWidth: "380px",
                div: {
                  gap: "20px",
                },
                input: {
                  flexGrow: "1",
                  background: "transparent",
                  color: theme.palette.primary.main,
                  fontSize: "24px",
                  border: "none",
                  outline: "none",
                  height: "45px",
                  borderBottom: "1px solid " + theme.palette.primary.main,
                },
              }}
            >
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                renderInput={(props) => <input {...props} />}
              />
            </Box>

            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              loading={isLoading}
            >
              {t("Verify")}
            </LoadingButton>
          </Stack>
        </form>
      </CustomStackFullWidth>
    </CustomPaperBigCard>
  );
};
export default OtpForm;
