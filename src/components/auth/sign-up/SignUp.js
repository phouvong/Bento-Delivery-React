import { Box } from "@mui/system";
import { t } from "i18next";
import React, { useEffect, useState } from "react";
import {
  CustomPaperBigCard,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import AuthHeader from "../AuthHeader";
import SignUpForm from "./SignUpForm";
// import AcceptTermsAndConditions from "../../../../pages/auth/AcceptTermsAndConditions";
import LoadingButton from "@mui/lab/LoadingButton";
import { Typography, useTheme } from "@mui/material";
import {
  onErrorResponse,
  onSingleErrorResponse,
} from "api-manage/api-error-response/ErrorResponses";
import { useSignUp } from "api-manage/hooks/react-query/auth/useSignUp";
import { useFireBaseOtpVerify } from "api-manage/hooks/react-query/forgot-password/useFIreBaseOtpVerify";
import { useVerifyPhone } from "api-manage/hooks/react-query/forgot-password/useVerifyPhone";
import useGetProfile from "api-manage/hooks/react-query/profile/useGetProfile";
import { auth } from "firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useFormik } from "formik";
import { getGuestId } from "helper-functions/getToken";
import Link from "next/link";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "redux/slices/profileInfo";
import { setWelcomeModal } from "redux/slices/utils";
import { setDefaultLanguage } from "utils/setDefaultLanguage";
import { signup_successfull } from "utils/toasterMessages";
import { ModuleSelection } from "../../landing-page/hero-section/module-selection";
import CustomModal from "../../modal";
import AcceptTermsAndConditions from "../AcceptTermsAndConditions";
import OtpForm from "./OtpForm";
import SignUpValidation from "./SignUpValidation";
import { getLoginUserCheck } from "components/auth/sign-in/loginHepler";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";

const SignUp = ({
  configData,
  setModalFor,
  sendOTP,
  handleClose,
  loginMutation,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  //const { configData } = useSelector((state) => state.configData);
  const { profileInfo } = useSelector((state) => state.profileInfo);
  const [openModuleSelection, setOpenModuleSelection] = useState(false);
  const theme = useTheme();
  const [otpData, setOtpData] = useState({ type: "" });
  const [mainToken, setMainToken] = useState(null);
  const [openOtpModal, setOpenOtpModal] = useState(false);
  //const [welcomeModal, setWelcomeModal] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [verificationId, setVerificationId] = useState(null);
  const [loginValue, setLoginValue] = useState(null);
  const guestId = getGuestId();
  // const { sendOTP, verificationId, isOtpSent } = useFirebasePhoneAuth();

  const signUpFormik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirm_password: "",
      ref_code: "",
      tandc: false,
    },
    validationSchema: SignUpValidation(),
    onSubmit: async (values, helpers) => {
      try {
        formSubmitHandler(values);
      } catch (err) {}
    },
  });
  const handleCloseOtp = () => {
    setOpenOtpModal(false);
  };

  const fNameHandler = (value) => {
    signUpFormik.setFieldValue("name", value);
  };
  const lNameHandler = (value) => {
    signUpFormik.setFieldValue("l_name", value);
  };
  const emailHandler = (value) => {
    signUpFormik.setFieldValue("email", value);
  };
  const handleOnChange = (value) => {
    signUpFormik.setFieldValue("phone", `+${value}`);
  };
  const passwordHandler = (value) => {
    signUpFormik.setFieldValue("password", value);
  };
  const confirmPasswordHandler = (value) => {
    signUpFormik.setFieldValue("confirm_password", value);
  };
  const handleCheckbox = (e) => {
    signUpFormik.setFieldValue("tandc", e.target.checked);
  };
  const ReferCodeHandler = (value) => {
    signUpFormik.setFieldValue("ref_code", value);
  };

  let location = undefined;
  if (typeof window !== "undefined") {
    location = localStorage.getItem("location");
  }
  useEffect(() => {
    if (otpData?.type !== "") {
      setOpenOtpModal(true);
    }
  }, [otpData]);

  const userOnSuccessHandler = (res) => {
    dispatch(setUser(res));
    //handleClose()
  };
  const { data: userData, refetch: profileRefetch } =
    useGetProfile(userOnSuccessHandler);
  const handleTokenAfterSignUp = (response) => {
    if (response) {
      localStorage.setItem("token", response?.token);
      profileRefetch();
      toast.success(t(signup_successfull));
      dispatch(setWelcomeModal(true));
      const zoneSelected = JSON.parse(localStorage.getItem("zoneid"));
      if (zoneSelected && getCurrentModuleType()) {
        if (getCurrentModuleType() !== "parcel") {
          router.push("/interest", undefined, { shallow: true });
        } else {
          router.push("/home", undefined, { shallow: true });
        }
      } else {
        router.push("/home", undefined, { shallow: true });
      }
      handleClose();
    }
  };

  const handleCloseModuleModal = (item) => {
    if (item) {
      toast.success(t("A Module has been selected."));
      if (signUpFormik.values.ref_code) {
        setSelectedModule(item);
        dispatch(setWelcomeModal(true));
      }

      if (item.module_type !== "parcel") {
        router.push("/interest", undefined, { shallow: true });
      } else {
        router.push("/home", undefined, { shallow: true });
      }
    }

    setOpenModuleSelection(false);
  };
  // const handleCloseWelcomeModal = () => {
  //   if (
  //     selectedModule.module_type === "ecommerce" ||
  //     selectedModule.module_type === "food"
  //   ) {
  //     router.push("/interest", undefined, { shallow: true });
  //   } else {
  //     router.push("/home", undefined, { shallow: true });
  //   }
  // };

  const { mutate, isLoading, error } = useSignUp();
  const formSubmitHandler = (values) => {
    const signUpData = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      password: values.password,
      confirm_password: values.confirm_password,
      ref_code: values.ref_code,
      guest_id: values?.guest_id ?? getGuestId(),
    };
    setLoginValue(signUpData);
    mutate(signUpData, {
      onSuccess: async (response) => {
        getLoginUserCheck(
          response,
          signUpData,
          handleTokenAfterSignUp,
          setOtpData,
          setMainToken,
          sendOTP,
          configData
        );
      },
      onError: onErrorResponse,
    });
  };

  const reSendOtp = () => {
    const values = {
      email_or_phone: signUpFormik?.values?.phone,
      login_type: "manual",
      password: signUpFormik?.values?.password,
      guest_id: getGuestId(),
      field_type: "phone",
    };
    loginMutation(values);
  };

  const { mutate: otpVerifyMutate, isLoading: isLoadingOtpVerifiyAPi } =
    useVerifyPhone();

  const { mutate: fireBaseOtpMutation, isLoading: fireIsLoading } =
    useFireBaseOtpVerify();
  const otpFormSubmitHandler = (values) => {
    const onSuccessHandler = (res) => {
      setOpenOtpModal(false);
      handleTokenAfterSignUp(res);
    };

    if (
      configData?.firebase_otp_verification === 1 &&
      configData?.centralize_login?.phone_verification_status === 1
    ) {
      const temValue = {
        session_info: verificationId,
        phone: values.phone,
        otp: values.reset_token,
        login_type: "manual",
        guest_id: getGuestId(),
      };
      fireBaseOtpMutation(temValue, {
        onSuccess: onSuccessHandler,
        onError: onErrorResponse,
      });
    } else {
      let tempValues = {
        [otpData?.verification_type]: otpData.type,
        otp: values.reset_token,
        login_type: otpData?.login_type,
        verification_type: otpData?.verification_type,
        guest_id: getGuestId(),
      };

      otpVerifyMutate(tempValues, {
        onSuccess: onSuccessHandler,
        onError: (error) => {
          toast.error(error?.response?.data?.message, {
            id: "error",
          });
        },
      });
    }
  };

  const handleSignIn = () => {
    setModalFor("sign-in");
  };

  const handleClick = () => {
    window.open("/terms-and-conditions");
  };
  return (
    <>
      <CustomStackFullWidth justifyContent="center" alignItems="center">
        <CustomStackFullWidth justifyContent="center" alignItems="center">
          <Box
            sx={{
              maxWidth: "650px",
              padding: { xs: "30px", md: "47px" },
              minWidth: { xs: "300px", md: "450px" },
            }}
            width="100%"
          >
            <CustomStackFullWidth spacing={2}>
              <AuthHeader configData={configData} />
              <form noValidate onSubmit={signUpFormik.handleSubmit}>
                <CustomStackFullWidth spacing={2}>
                  <SignUpForm
                    configData={configData}
                    handleOnChange={handleOnChange}
                    passwordHandler={passwordHandler}
                    fNameHandler={fNameHandler}
                    lNameHandler={lNameHandler}
                    emailHandler={emailHandler}
                    confirmPasswordHandler={confirmPasswordHandler}
                    ReferCodeHandler={ReferCodeHandler}
                    signUpFormik={signUpFormik}
                  />
                  <AcceptTermsAndConditions
                    handleCheckbox={handleCheckbox}
                    handleClick={handleClick}
                    formikType={signUpFormik}
                  />
                  <CustomStackFullWidth spacing={2}>
                    <LoadingButton
                      type="submit"
                      fullWidth
                      variant="contained"
                      loading={isLoading}
                      disabled={!signUpFormik.values.tandc}
                      id="recaptcha-container"
                    >
                      {t("Sign Up")}
                    </LoadingButton>
                    <Typography
                      sx={{
                        a: {
                          "&:hover": {
                            letterSpacing: "0.03em",
                          },
                        },
                      }}
                    >
                      {t("Already have an account?")}{" "}
                      <span
                        onClick={handleSignIn}
                        style={{
                          color: theme.palette.primary.main,
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                      >
                        {t("Sign In")}
                      </span>
                    </Typography>
                  </CustomStackFullWidth>
                </CustomStackFullWidth>
              </form>
            </CustomStackFullWidth>
          </Box>
        </CustomStackFullWidth>
        <CustomModal handleClose={handleClose} openModal={openOtpModal}>
          <OtpForm
            data={otpData?.phone}
            formSubmitHandler={otpFormSubmitHandler}
            isLoading={isLoadingOtpVerifiyAPi || fireIsLoading}
          />
        </CustomModal>
      </CustomStackFullWidth>
      <CustomModal
        handleClose={() => setOpenOtpModal(false)}
        openModal={openOtpModal}
      >
        <OtpForm
          data={otpData?.type ? otpData?.type : signUpFormik?.values?.phone}
          formSubmitHandler={otpFormSubmitHandler}
          isLoading={isLoadingOtpVerifiyAPi || fireIsLoading}
          loginValue={loginValue}
          reSendOtp={reSendOtp}
          handleClose={() => setOpenOtpModal(false)}
        />
      </CustomModal>
      {openModuleSelection && (
        <ModuleSelection
          location={location}
          closeModal={handleCloseModuleModal}
          disableAutoFocus
        />
      )}
    </>
  );
};

export default React.memo(SignUp);
