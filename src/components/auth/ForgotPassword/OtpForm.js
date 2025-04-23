import React, { useEffect, useState } from "react";
import {alpha, Box, Stack, Typography, useTheme} from "@mui/material";
import {
  CustomPaperBigCard,
  CustomStackFullWidth,
  StyledInputBase,
} from "../../../styled-components/CustomStyles.style";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import LoadingButton from "@mui/lab/LoadingButton";
import OtpInput from "react-otp-input";

import * as Yup from "yup";
import {useForgotPassword} from "api-manage/hooks/react-query/forgot-password/useForgotPassword";
import {onErrorResponse} from "api-manage/api-error-response/ErrorResponses";
import toast from "react-hot-toast";

const OtpForm = ({ data, formSubmitHandler, isLoading,forgotPassword,reSendOtp ,configData}) => {

  const theme = useTheme();
  const { t } = useTranslation();
  const [otp, setOtp] = useState("");
  const [counter, setCounter] = useState(60) // Start at 30 seconds
  const [isResendDisabled, setIsResendDisabled] = useState(true)
  const otpFormik = useFormik({
    //here reset_token is otp inputs
    initialValues: {
      reset_token: "",
      phone: data?.phone,
      email:data?.email,
      verification_method:data?.verification_method,


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
  useEffect(() => {
    // Timer function to decrease counter every second
    if (counter > 0) {
      const timer = setTimeout(() => setCounter(counter - 1), 1000)
      return () => clearTimeout(timer) // Cleanup the timer on unmount
    } else {
      setIsResendDisabled(false) // Enable resend after countdown
    }
  }, [counter])
  const onSuccessHandler = (res) => {
    if (res) {
      if (res?.errors?.length > 0) {
        goNext();
        toast.error(res?.errors[0].message);
      } else {
        goNext();
        toast.success(res.message);
      }

      // goNext();
      //toast.success(res.message);
    }
  };
  const { mutate:sendOtpMutate, isLoading:sendOtpLoading } = useForgotPassword({
    onSuccessHandler,
    onError: (errors) => {
      onErrorResponse(errors);
    },
  });

  const handleResendClick = () => {
    if (!isResendDisabled) {
      const tempValue={
        phone: data?.phone,
        email:data?.email,
        verification_method:data?.verification_method

      }
      reSendOtp(tempValue,onSuccessHandler,sendOtpMutate)
      setCounter(60) // Reset counter to 30 seconds
      setIsResendDisabled(true)
      // Add logic to trigger resend code action here (API call, etc.)
    }
  }
  return (
    <CustomStackFullWidth>
      <CustomStackFullWidth>
        <Stack alignItems="center" justifyContent="center">
          <Typography fontSize="14px" marginTop="10px" color={alpha(theme.palette.neutral[400],.7)}>{t(`We’ve sent a verification code to ${data?.email}`)}</Typography>

        </Stack>
        {configData?.demo && (
          <Typography
            mt="5px"
            textAlign="center"
            fontSize="12px"
            color="textSecondary"
          >
            {t("For demo purpose use otp 123456")}
          </Typography>
        )}
        <form noValidate onSubmit={otpFormik.handleSubmit}>
          <Stack
            padding="0 20px"
            alignItems="center"
            justifyContent="center"
          >
            <Box
              sx={{
                mt: 1,
                mb: 1,
                mx: "auto",
                maxWidth: "380px",
                div: {
                  gap: "10px",
                },
                input: {
                  flexGrow: "1",
                  background: "transparent",
                  color: theme.palette.primary.main,
                  fontSize: "32px",
                  borderRadius:"4px",
                  outline: "none",
                  height: "36px",
                  border: "1px solid " + theme.palette.primary.main,
                },
              }}
            >
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                renderInput={(props) => <input {...props}
                                               style={{
                                                 fontSize: '20px', // 👈 Change font size here
                                                 width: '35px',
                                                 height: '40px',
                                                 textAlign: 'center',
                                                 margin: '0 4px',
                                                 border: "1px solid " + theme.palette.primary.main,
                                                 borderRadius: '4px',
                                               }}
                />}
              />
            </Box>

            <LoadingButton
              disabled={!otpFormik.values.reset_token}
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
        {forgotPassword && (<Stack direction="row" justifyContent="space-between">
          <Typography fontSize="12px" color={alpha(theme.palette.neutral[400],.7)}>
            {t("Didn’t receive the code?")}
          </Typography>
          <Typography
            fontSize="12px"
            fontWeight="600"
            color={
              isResendDisabled
                ? theme.palette.neutral[500]
                : theme.palette.primary.main
            }
            onClick={handleResendClick}
            sx={{
              cursor: isResendDisabled
                ? 'not-allowed'
                : 'pointer',
            }}
          >
            {isResendDisabled
              ? `${t('Resend it')} (${counter}s)`
              : t('Resend it')}
          </Typography>
        </Stack>)}

      </CustomStackFullWidth>
    </CustomStackFullWidth>
  );
};
export default OtpForm;
