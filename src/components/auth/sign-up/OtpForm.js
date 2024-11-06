import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  TextField,
  useTheme,
  IconButton,
} from "@mui/material";
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
import CustomImageContainer from "components/CustomImageContainer";
import { maskSensitiveInfo } from "utils/CustomFunctions";
import CloseIcon from "@mui/icons-material/Close";
import otpImage from "../asset/SMS.png";

const OtpForm = ({
  data,
  formSubmitHandler,
  isLoading,
  loginValue,
  reSendOtp,
  handleClose,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [otp, setOtp] = useState("");
  const otpFormik = useFormik({
    //here reset_token is otp inputs
    initialValues: {
      reset_token: "",
      phone: data,
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
  const [counter, setCounter] = useState(60); // Start at 30 seconds
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  useEffect(() => {
    // Timer function to decrease counter every second
    if (counter > 0) {
      const timer = setTimeout(() => setCounter(counter - 1), 1000);
      return () => clearTimeout(timer); // Cleanup the timer on unmount
    } else {
      setIsResendDisabled(false); // Enable resend after countdown
    }
  }, [counter]);

  const handleResendClick = () => {
    if (!isResendDisabled) {
      reSendOtp(loginValue);
      setCounter(60); // Reset counter to 30 seconds
      setIsResendDisabled(true);
      // Add logic to trigger resend code action here (API call, etc.)
    }
  };
  return (
    <CustomStackFullWidth
      justifyContent="center"
      alignItems="center"
      padding={{ xs: "2rem", md: "3rem" }}
      position="relative"
    >
      <IconButton
        onClick={handleClose}
        sx={{
          zIndex: "99",
          position: "absolute",
          top: 6,
          right: 6,
          backgroundColor: (theme) => theme.palette.neutral[100],
          borderRadius: "50%",
          [theme.breakpoints.down("sm")]: {
            top: -0,
            right: -0,
          },
        }}
      >
        <CloseIcon
          sx={{
            fontSize: {
              xs: "16px",
              sm: "18px",
              md: "20px",
            },
            fontWeight: "500",
          }}
        />
      </IconButton>

      <CustomStackFullWidth
        maxWidth="300px"
        gap="26px"
        alignItems="center"
        justifyContent="center"
      >
        <Typography
          fontSize="16px"
          fontWeight="500"
          color={theme.palette.neutral[1000]}
        >
          {t("OTP Verification")}
        </Typography>

        <CustomImageContainer
          src={otpImage.src}
          alt="logo"
          width="100px"
          objectFit="contained"
        />
        <Stack>
          <Typography textAlign="center" fontSize="12px" color="textSecondary">
            {t(
              `We’ve sent a verification code to ${maskSensitiveInfo(data)}
                          `
            )}
          </Typography>
          <Typography
            mt="5px"
            textAlign="center"
            fontSize="12px"
            color="textSecondary"
          >
            {t("For demo propose use otp 123456")}
          </Typography>
        </Stack>

        {/* <Typography>{data?.phone}</Typography> */}
        <Stack width="100%">
          <form onSubmit={otpFormik.handleSubmit}>
            <Stack
              alignItems="center"
              justifyContent="center"
              gap="16px"
              width="100%"
            >
              <Box
                sx={{
                  div: {
                    gap: {
                      xs: "5px",
                      sm: "8px",
                      md: "10px",
                    },
                  },
                  input: {
                    flexGrow: "1",
                    background: "transparent",
                    color: theme.palette.primary.main,
                    fontSize: "16px",
                    outline: "none",
                    height: {
                      xs: "35px",
                      sm: "40px",
                      md: "45px",
                    },
                    width: {
                      xs: "35px !important",
                      sm: "40px !important",
                      md: "45px !important",
                    },
                    borderRadius: "10px",
                    border: "1.6px solid " + theme.palette.primary.main,
                  },
                }}
              >
                <OtpInput
                  value={otpFormik.values.reset_token}
                  onChange={(otp) =>
                    otpFormik.setFieldValue("reset_token", otp)
                  }
                  numInputs={6}
                  onBlur={otpFormik.handleBlur("reset_token")}
                  renderInput={(props) => <input {...props} />}
                  error={
                    otpFormik.touched.reset_token &&
                    Boolean(otpFormik.errors.reset_token)
                  }
                />
                {/* <OtpInput
                                value={otp}
                                onChange={setOtp}
                                numInputs={4}
                                renderInput={(props) => <input {...props} />}
                            /> */}
              </Box>

              <LoadingButton
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                loading={isLoading}
                disabled={
                  !otpFormik.values.reset_token ||
                  otpFormik.values.reset_token.length !== 6
                }
              >
                {t("Verify")}
              </LoadingButton>
            </Stack>
            <Stack
              direction="row"
              width="100%"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                fontSize="12px"
                fontWeight="600"
                color={theme.palette.neutral[500]}
              >
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
                  cursor: isResendDisabled ? "not-allowed" : "pointer",
                }}
              >
                {isResendDisabled
                  ? `${t("Resend it")} (${counter}s)`
                  : t("Resend it")}
              </Typography>
            </Stack>
          </form>
        </Stack>
      </CustomStackFullWidth>
    </CustomStackFullWidth>
  );
};
export default OtpForm;
