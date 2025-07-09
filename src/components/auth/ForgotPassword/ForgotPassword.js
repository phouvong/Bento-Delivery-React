import { Box, Stack, Typography } from "@mui/material";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { useFireBaseOtpVerify } from "api-manage/hooks/react-query/forgot-password/useFIreBaseOtpVerify";
import { useOtp } from "api-manage/hooks/react-query/forgot-password/useOtp";
import { auth } from "firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useState } from "react";
import {
  CustomPaper, CustomStackFullWidth,
  FlexContainerCenter,
} from "styled-components/CustomStyles.style";
import ForgotPasswordNumberForm from "./ForgotPasswordNumberForm";
import NewPassword from "./NewPassword";
import OtpForm from "./OtpForm";
import LogoSide from "components/logo/LogoSide";
import { t } from "i18next";
import { useDispatch } from "react-redux";
import CustomImageContainer from "components/CustomImageContainer";
import fImage from "../../../../public/static/Layer3.png"
import {useFireBaseResetPass} from "api-manage/hooks/react-query/forgot-password/useFireBaseResetPass";
import toast from "react-hot-toast";
const ForgotPassword = ({ configData }) => {
  const [page, setPage] = useState(0);
  const [hasVerificationMethod, setHasVerificationMethod] = useState(false);
  const [phoneOrEmail, setPhoneOrEmail] = useState('')
  const { mutate: fireBaseOtpMutation } = useFireBaseResetPass();
  const [data, setData] = useState({
    phone: "",
    email:"",
    otp: "",
  });
  const [verificationId, setVerificationId] = useState(null);
  const dispatch=useDispatch()
  const goNext = () => {
    setPage((currPage) => currPage + 1);
  };
  const goBack = () => {
    setPage((currPage) => currPage - 1);
  };

  const handleFirstForm = (values) => {
    setData({
      phone: values.phone,
      email:values?.email,
      reset_token: values.reset_token,
      verification_method:values?.verification_method
    });
  };

  const setUpRecaptcha = () => {
    // Check if reCAPTCHA is already initialized
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            // console.log("Recaptcha verified", response);
          },
          "expired-callback": () => {
            window.recaptchaVerifier?.reset();
          },
        },
        auth
      );
    } else {
      // Only reset without re-initializing
      window.recaptchaVerifier?.reset();
    }
  };

  const sendOTP = (phone) => {
    setUpRecaptcha();
    const phoneNumber = phone;
    // country code
    const appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        setVerificationId(confirmationResult.verificationId);
        setData({ ...data, phone: phoneNumber });
        goNext();
      })
      .catch((error) => {
        toast.error(error.message)
        // console.log({error})
      });
  };
  const handleSubmitOtp= (values,onSuccessHandler,mutate) => {
    handleFirstForm(values);
    if (configData?.firebase_otp_verification === 1) {
      sendOTP(values?.phone);
    } else {
      mutate(values, { onSuccess: onSuccessHandler, onError: onErrorResponse });
    }
  }


  const pageShow = () => {
    if (page === 0) {
      return (
        <ForgotPasswordNumberForm
          goNext={goNext}
          handleFirstForm={handleFirstForm}
          data={data}
          id="recaptcha-container"
          sendOTP={sendOTP}
          hasVerificationMethod={hasVerificationMethod}
          setHasVerificationMethod={setHasVerificationMethod}
          handleSubmitOtp={handleSubmitOtp}
          setPhoneOrEmail={setPhoneOrEmail}
          phoneOrEmail={phoneOrEmail}
        />
      );
    } else if (page === 1) {
      return (
        <OtpForm
          data={data}
          goBack={goBack}
          formSubmitHandler={formSubmitHandler}
          isLoading={isLoading}
          forgotPassword
          reSendOtp={handleSubmitOtp}
          phoneOrEmail={phoneOrEmail}
          configData={configData}
        />
      );
    } else page === 2;
    {
      return (
        <NewPassword
          data={data}
          handleFirstForm={handleFirstForm}
          goBack={goBack}
          phoneOrEmail={phoneOrEmail}
        />
      );
    }
  };
  const onSuccessHandler = (res) => {
    if (res) {
      goNext();
    }
  };
  const { mutate, isLoading } = useOtp(onSuccessHandler);

  const formSubmitHandler = (values) => {
    handleFirstForm(values);
    if (configData?.firebase_otp_verification === 1) {
      const tempValues = {
        phoneNumber: values?.phone,
        sessionInfo: verificationId,
        code: values?.reset_token,
        is_reset_token: 1,

      };
      fireBaseOtpMutation(tempValues, {
        onSuccess: onSuccessHandler,
        onError: onErrorResponse,
      });
    } else {
      mutate(values, {
        onSuccess: onSuccessHandler,
        onError: onErrorResponse,
      });
    }
  };
  return (
    <Box minHeight="50vh" sx={{display:"flex"}}>
      <FlexContainerCenter >
        <CustomStackFullWidth sx={{paddingX:"2rem",paddingY:"2rem", alignItems:"center",justifyContent:"center"}}>
          <Stack justifyContent="center" alignItems="center">
            { hasVerificationMethod && (page!==1 ) && <LogoSide configData={configData}/>}
            {page===1 && <CustomImageContainer
              src={fImage?.src}
              alt="logo"
              width="100px"
              height="100px"
              sx={{ borderRadius: "50%", marginBottom: "1rem" }}
            />}
            {(page===0  && hasVerificationMethod )&& <Typography variant="h6" mt="1rem" mb="1rem" fontWeight="bold">{t("Forgot your password")}</Typography>}
          {pageShow()}
          </Stack>
          </CustomStackFullWidth>
      </FlexContainerCenter>
    </Box>
  );
};

export default ForgotPassword;
