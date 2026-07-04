import { IconButton, NoSsr, Typography, useTheme } from "@mui/material";
import { Box, Stack } from "@mui/system";
import React, { useEffect, useReducer, useState } from "react";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";

import { t } from "i18next";
import { CustomTypography } from "../../landing-page/hero-section/HeroSection.style";
import SignInForm from "./SignInForm";
import {
  onErrorResponse,
  onSingleErrorResponse,
} from "api-manage/api-error-response/ErrorResponses";

import { useFireBaseOtpVerify } from "api-manage/hooks/react-query/forgot-password/useFIreBaseOtpVerify";
import { useVerifyPhone } from "api-manage/hooks/react-query/forgot-password/useVerifyPhone";
import { useWishListGet } from "api-manage/hooks/react-query/wish-list/useWishListGet";

import { useFormik } from "formik";
import { getGuestId } from "helper-functions/getToken";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setCartList } from "redux/slices/cart";
import { setUser } from "redux/slices/profileInfo";
import { setWishList } from "redux/slices/wishList";
import {
  checkInput,
  formatPhoneNumber,
  handleProductValueWithOutDiscount,
} from "utils/CustomFunctions";
import {
  loginSuccessFull,
  moduleSelected,
  SigninSuccessFull,
} from "utils/toasterMessages";
import useGetGroupedCart from "../../../api-manage/hooks/react-query/add-cart/useGetGroupedCart";
import useGetProfile from "../../../api-manage/hooks/react-query/profile/useGetProfile";
import { getSelectedVariations } from "../../header/second-navbar/SecondNavbar";
import { ModuleSelection } from "../../landing-page/hero-section/module-selection";
import CustomModal from "../../modal";
import AuthHeader from "../AuthHeader";
import OtpForm from "../sign-up/OtpForm";
import SocialLogins from "./social-login/SocialLogins";
import {
  ACTIONS,
  loginInitialState,
  loginReducer,
} from "components/auth/state";
import {
  getActiveLoginStatus,
  getLoginUserCheck,
} from "components/auth/sign-in/loginHepler";
import OtpLogin from "components/auth/sign-in/OtpLogin";
import * as Yup from "yup";

import CloseIcon from "@mui/icons-material/Close";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import useGetBookingList from "api-manage/hooks/react-query/useGetBookingList";
import { useGetWishList } from "api-manage/hooks/react-query/rental-wishlist/useGetWishlist";
import ForgotPassword from "../ForgotPassword/ForgotPassword";
import { setOpenForgotPasswordModal } from "redux/slices/utils";

const SignIn = ({
  modalFor,
  configData,
  setModalFor,
  setLoginInfo,
  setJwtToken,
  setUserInfo,
  handleSuccess,
  setMedium,
  zoneid,
  loginMutation,
  loginIsLoading,
  verificationId,
  sendOTP,
  handleClose,
  forceStatus,
  onBack,
}) => {
  const router = useRouter();
  const previousRouteName = router.query.from;
  const { openForgotPasswordModal } = useSelector((state) => state.utilsData);
  const guestId = getGuestId();
  const dispatch = useDispatch();
  const [openModuleSelection, setOpenModuleSelection] = useState(false);
  const [openOtpModal, setOpenOtpModal] = useState(false);
  const [loginValue, setLoginValue] = useState(null);
  const [otpData, setOtpData] = useState({ type: "" });
  const [mainToken, setMainToken] = useState(null);
  const [isApiCalling, setIsApiCalling] = useState(false);
  const [isRemember, setIsRemember] = useState(false);
  const theme = useTheme();

  const [state, loginDispatch] = useReducer(loginReducer, loginInitialState);
  let userDatafor = undefined;
  const moduleType = getCurrentModuleType();
  if (typeof window !== "undefined") {
    userDatafor = JSON.parse(localStorage.getItem("userDatafor"));
  }

  const loginFormik = useFormik({
    initialValues: {
      email_or_phone: userDatafor?.email_or_phone || "",
      password: userDatafor ? userDatafor.password : "",
      tandc: false,
    },
    validationSchema: Yup.object({
      email_or_phone: Yup.string()
        .required(t("Email or phone number is required"))
        .test(
          "email-or-phone",
          t("Must be a valid email or phone number"),
          function (value) {
            // Regular expressions for validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex
            const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format for phone numbers

            // Check if value matches either email or phone regex
            return emailRegex.test(value) || phoneRegex.test(value);
          }
        ),
      password: Yup.string()
        .min(6, t("Password is too short - should be 6 chars minimum."))
        .required(t("Password is required")),
    }),
    onSubmit: async (values, helpers) => {
      try {
        if (isRemember) {
          localStorage.setItem("userDatafor", JSON.stringify(values));
        }
        formSubmitHandler({ ...values, login_type: "manual" });
      } catch (err) {}
    },
  });

  const cartListSuccessHandler = (res) => {
    if (res) {
      const tempCartLists = res?.map((item) => ({
        ...item?.item,
        cartItemId: item?.id,
        totalPrice:
          handleProductValueWithOutDiscount(item?.item) * item?.quantity,
        selectedAddons: item?.item?.addons,
        quantity: item?.quantity,
        food_variations: item?.item?.food_variations,
        itemBasePrice: item?.item?.price,
        selectedOption:
          moduleType !== "food"
            ? item?.variation
            : getSelectedVariations(item?.item?.food_variations),
      }));
      dispatch(setCartList(tempCartLists));
    }
  };

  const { data, refetch: cartListRefetch, isLoading } = useGetGroupedCart();

  const bookingSuccess = (res) => {
    dispatch(setCartList(res));
  };
  const {
    data: bookingLists,
    isLoading: bookingListsIsLoading,
    refetch: bookingRefetch,
  } = useGetBookingList(getGuestId(), bookingSuccess);
  const userOnSuccessHandler = (res) => {
    dispatch(setUser(res));
  };

  let location = undefined;
  let isModuleSelected = undefined;
  let lanDirection = undefined;
  let languageSetting;
  if (typeof window !== "undefined") {
    location = localStorage.getItem("location");
    isModuleSelected = JSON.parse(localStorage.getItem("module"));
    lanDirection = JSON.parse(localStorage.getItem("settings"));
    languageSetting = JSON.parse(localStorage.getItem("language-setting"));
  }

  const handleOnChange = (value) => {
    loginFormik.setFieldValue("email_or_phone", formatPhoneNumber(value));
  };
  const passwordHandler = (value) => {
    loginFormik.setFieldValue("password", value);
  };

  useEffect(() => {
    if (otpData?.type !== "") {
      setOpenOtpModal(true);
    }
  }, [otpData]);
  const onSuccessHandler = (response) => {
    dispatch(setWishList(response));
    setIsApiCalling(false);
  };

  const { refetch: profileRefetch } = useGetProfile(userOnSuccessHandler);
  const { refetch: wishlistRefetch } = useWishListGet(
    {},
    false,
    onSuccessHandler
  );
  const { refetch: rentalWishlistRefetch } = useGetWishList(onSuccessHandler);

  const handleTokenAfterSignIn = async (response) => {
    if (response) {
      localStorage.setItem("token", response?.token);
      if (moduleType === "rental") {
        await bookingRefetch();
        await rentalWishlistRefetch();
      } else {
        await cartListRefetch();
        await wishlistRefetch();
      }
      await profileRefetch();

      toast.success(t(loginSuccessFull));

      if (router.pathname === "/forgot-password") {
        router.push("/home");
      }
      handleClose();
    }
  };

  const handleCloseModuleModal = (item) => {
    if (item) {
      toast.success(t(moduleSelected));
      if (previousRouteName) {
        router.push("/home");
      } else {
        router.back();
      }
    }
    setOpenModuleSelection(false);
  };

  const formSubmitHandler = (values) => {
    const numberOrEmail = checkInput(values?.email_or_phone);
    let newValues = {};
    if (values?.login_type === "otp") {
      newValues = {
        ...values,
        type: "phone",
        guest_id: guestId,
      };
    } else {
      newValues = {
        ...values,
        guest_id: guestId,
        field_type: numberOrEmail,
        type: numberOrEmail,
      };
    }
    setLoginValue(newValues);
    loginMutation(newValues, {
      onSuccess: async (response) => {
        if (response?.is_personal_info === 0) {
          handleLoginInfo(response, {
            phone: newValues.email_or_phone,
          });
        } else {
          getLoginUserCheck(
            response,
            newValues,
            handleTokenAfterSignIn,
            setOtpData,
            setMainToken,
            sendOTP,
            configData
          );
        }
      },
      onError: onErrorResponse,
    });
  };

  const { mutate: otpVerifyMutate, isLoading: isLoadingOtpVerifyApi } =
    useVerifyPhone();
  const { mutate: fireBaseOtpMutation, isLoading: fireIsLoading } =
    useFireBaseOtpVerify();

  const handleLoginInfo = (res, values) => {
    // Common logic to set login info based on response
    setLoginInfo({
      ...res,
      phone: values.phone,
      otp: values?.reset_token,
    });

    // Determine which modal to show based on the response
    if (res?.is_personal_info === 0) {
      setModalFor("user_info");
    } else if (res?.is_exist_user !== null) {
      setModalFor("is_exist_user");
    } else {
      setOpenOtpModal(false);
      handleClose();
      handleTokenAfterSignIn(res).then();
      //handleClose();
    }
  };
  const otpFormSubmitHandler = (values) => {
    if (configData?.firebase_otp_verification === 1) {
      const temValue = {
        session_info: verificationId,
        phone: values.phone,
        otp: values.reset_token,
        login_type: "otp",
        guest_id: getGuestId(),
      };
      fireBaseOtpMutation(temValue, {
        onSuccess: (res) => {
          if (res) {
            handleLoginInfo(res, values);
          }
        },
        onError: onErrorResponse,
      });
    } else {
      let tempValues = {
        phone: values.phone,
        otp: values.reset_token,
        login_type: otpData?.login_type,
        verification_type: otpData?.verification_type,
        guest_id: getGuestId(),
      };
      const onSuccessHandler = (res) => {
        if (res) {
          handleLoginInfo(res, values);
        }
      };

      otpVerifyMutate(tempValues, {
        onSuccess: onSuccessHandler,
        onError: onSingleErrorResponse,
      });
    }
  };

  const rememberMeHandleChange = (e) => {
    setIsRemember(e.target.checked);
  };
  useEffect(() => {
    let userDatafor = undefined;
    if (typeof window !== "undefined") {
      userDatafor = JSON.parse(localStorage.getItem("userDatafor"));
    }
    if (userDatafor) {
      setIsRemember(true);
    }
  }, []);
  const { centralize_login } = configData || {};
  const getActiveLoginType = () => {
    if (centralize_login) {
      const { otp_login_status, manual_login_status, social_login_status } =
        centralize_login;

      loginDispatch({
        type: ACTIONS.setActiveLoginType,
        payload: {
          otp: otp_login_status === 1,
          manual: manual_login_status === 1,
          social: social_login_status === 1,
        },
      });
    }
  };
  const onlyOtp =
    centralize_login?.otp_login_status &&
    !centralize_login?.manual_login_status &&
    !centralize_login?.social_login_status;

  useEffect(() => {
    getActiveLoginType();
  }, []);

  useEffect(() => {
    if (forceStatus) {
      loginDispatch({ type: ACTIONS.setStatus, payload: forceStatus });
    } else {
      getActiveLoginStatus(state, loginDispatch);
    }
  }, [state.activeLoginType]);

  const otpLoginFormik = useFormik({
    initialValues: {
      phone: "",
    },
    validationSchema: Yup.object({
      phone: Yup.string()
        .required(t("Please give a phone number"))
        .min(10, "Number must be 10 digits"),
    }),
    onSubmit: async (values, helpers) => {
      try {
        formSubmitHandler({ ...values, login_type: "otp" });
      } catch (err) {}
    },
  });
  const otpHandleChange = (value) => {
    otpLoginFormik.setFieldValue("phone", `+${value}`);
  };
  const handleClick = () => {
    window.open("/terms-and-conditions");
  };
  const selectedOtp = () => {
    loginDispatch({
      type: ACTIONS.setActiveLoginType,
      payload: {
        otp: true,
        manual: false,
        social: false,
      },
    });
  };

  const handleSignUp = () => {
    setModalFor("sign-up");
  };
  useEffect(() => {
    // Old flow: close SignIn modal when switching to sign-up.
    // New AuthModal flow (onBack defined) handles sign-up internally — skip.
    if (!onBack && modalFor === "sign-up") {
      handleClose();
    }
  }, [modalFor]);

  const handleFormBasedOnDirection = () => {
    const commonSignInFormProps = {
      isApiCalling,
      configData,
      handleOnChange,
      passwordHandler,
      loginFormik,
      lanDirection: lanDirection?.direction,
      rememberMeHandleChange,
      isLoading: loginIsLoading,
      handleClick,
      handleClose,
      isRemember,
    };

    const commonSocialLoginsProps = {
      socialLogin: configData?.social_login,
      configData,
      state,
      setJwtToken,
      setUserInfo,
      handleSuccess,
      setModalFor,
      setMedium,
      loginMutation,
      setLoginInfo,
    };

    const orSeparator = (
      <Typography
        textAlign="center"
        fontSize="14px"
        color={theme.palette.neutral[400]}
      >
        {t("Or")}
      </Typography>
    );

    const otpOption = (
      <Typography
        component="span"
        textAlign="center"
        fontSize="14px"
        fontWeight="400"
        color={theme.palette.neutral[400]}
      >
        {t("Sign in with")}
        <Typography
          onClick={selectedOtp}
          sx={{ textDecoration: "underline", cursor: "pointer" }}
          component="span"
          color={theme.palette.primary.main}
          ml="10px"
        >
          {t("OTP")}
        </Typography>
      </Typography>
    );

    const signUpFooter = (
      <CustomStackFullWidth
        alignItems="center"
        spacing={0.5}
        sx={{ paddingTop: "10px !important" }}
      >
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
    );

    const socialLoginSection = (
      <>
        <Typography fontSize="14px" textAlign="center">
          {t("or login with")}
        </Typography>
        <SocialLogins {...commonSocialLoginsProps} />
      </>
    );

    if (state?.status && state?.activeLoginType) {
      switch (state.status) {
        case "otp":
          return (
            <OtpLogin
              otpHandleChange={otpHandleChange}
              otpLoginFormik={otpLoginFormik}
              configData={configData}
              isLoading={loginIsLoading}
              handleClick={handleClick}
              rememberMeHandleChange={rememberMeHandleChange}
              handleClose={handleClose}
              isRemember={isRemember}
              getActiveLoginType={getActiveLoginType}
              onlyOtp={onlyOtp}
            />
          );

        case "manual":
          return (
            <Stack width="100%">
              <SignInForm
                {...commonSignInFormProps}
                only
                handleSignUp={handleSignUp}
              />
            </Stack>
          );

        case "social":
          return <SocialLogins {...commonSocialLoginsProps} />;

        case "otp_manual":
          return (
            <Stack width="100%" gap="1rem">
              <SignInForm {...commonSignInFormProps} />
              {orSeparator}
              {otpOption}
              {signUpFooter}
            </Stack>
          );

        case "otp_social":
          return (
            <>
              <OtpLogin
                otpHandleChange={otpHandleChange}
                otpLoginFormik={otpLoginFormik}
                configData={configData}
                isLoading={loginIsLoading}
                handleClick={handleClick}
                rememberMeHandleChange={rememberMeHandleChange}
                isRemember={isRemember}
                getActiveLoginType={getActiveLoginType}
                onlyOtp={onlyOtp}
              />
              {socialLoginSection}
            </>
          );

        case "manual_social":
          return (
            <CustomStackFullWidth gap="1rem">
              <SignInForm {...commonSignInFormProps} />
              {socialLoginSection}
              {signUpFooter}
            </CustomStackFullWidth>
          );

        case "all":
          return (
            <CustomStackFullWidth gap="1rem">
              <SignInForm {...commonSignInFormProps} />
              <Stack gap="10px">
                {orSeparator}
                {otpOption}
              </Stack>
              <SocialLogins {...commonSocialLoginsProps} />
              {signUpFooter}
            </CustomStackFullWidth>
          );

        default:
          return null;
      }
    }
  };
  // ── New Figma layout (used when coming from AuthLanding) ──────────────────
  if (onBack) {
    const isOtpMode = forceStatus === "otp";
    return (
      <>
        <NoSsr>
          <Box
            sx={{
              position: "relative",
              backgroundColor: "background.paper",
              borderRadius: "20px",
              overflow: "hidden",
              width: { xs: "100%", sm: "450px" },
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Back button — pinned to the top-left corner of the modal */}
            <IconButton
              onClick={onBack}
              size="small"
              sx={{
                position: "absolute",
                top: 10,
                left: 0,
                p: "8px",
                borderRadius: "16px",
                zIndex: 2,
              }}
            >
              <i
                className="fi fi-rr-arrow-small-left"
                style={{ fontSize: "20px", lineHeight: 1, display: "flex" }}
              />
            </IconButton>

            {/* Close button — pinned to the top-right corner of the modal */}
            <IconButton
              onClick={handleClose}
              size="small"
              sx={{
                position: "absolute",
                top: 10,
                right: 0,
                p: "8px",
                borderRadius: "16px",
                zIndex: 2,
              }}
            >
              <CloseIcon sx={{ fontSize: "20px" }} />
            </IconButton>

            {/* Content — top padding leaves room for the absolute corner icons */}
            <Stack
              sx={{ gap: "20px", pt: "56px", pb: "56px", px: "32px", flex: 1 }}
            >
              {/* Title */}
              <Stack sx={{ gap: "4px" }}>
                <Typography
                  sx={{
                    fontSize: "20px",
                    fontWeight: 700,
                    letterSpacing: "-0.6px",
                    lineHeight: 1.1,
                    color: theme.palette.neutral?.[1050] ?? "text.primary",
                  }}
                >
                  {isOtpMode
                    ? t("Login With OTP")
                    : t("Login With Email/Phone")}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: 400,
                    letterSpacing: "-0.42px",
                    lineHeight: 1.2,
                    color: "text.secondary",
                  }}
                >
                  {isOtpMode
                    ? t("Use your registered phone number to get OTP")
                    : t("Use your registered email/phone number to login")}
                </Typography>
              </Stack>

              {/* Form */}
              {isOtpMode ? (
                <form
                  noValidate
                  onSubmit={otpLoginFormik.handleSubmit}
                  style={{ flex: 1, display: "flex", flexDirection: "column" }}
                >
                  <Stack sx={{ gap: "32px", pt: "16px", flex: 1 }}>
                    {/* Input + button */}
                    <Stack sx={{ gap: "24px", flex: 1 }}>
                      <OtpLogin
                        otpHandleChange={otpHandleChange}
                        otpLoginFormik={otpLoginFormik}
                        configData={configData}
                        isLoading={loginIsLoading}
                        handleClick={handleClick}
                        rememberMeHandleChange={rememberMeHandleChange}
                        handleClose={handleClose}
                        isRemember={isRemember}
                        getActiveLoginType={getActiveLoginType}
                        onlyOtp={onlyOtp}
                        inlineLayout
                      />
                    </Stack>

                    {/* Footer */}
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="center"
                      sx={{ gap: "4px" }}
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
                        {t("New to {{name}}?", {
                          name: configData?.business_name,
                        })}
                      </Typography>
                      <Typography
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
                    </Stack>
                  </Stack>
                </form>
              ) : (
                <SignInForm
                  isApiCalling={isApiCalling}
                  configData={configData}
                  handleOnChange={handleOnChange}
                  passwordHandler={passwordHandler}
                  loginFormik={loginFormik}
                  lanDirection={lanDirection?.direction}
                  rememberMeHandleChange={rememberMeHandleChange}
                  isLoading={loginIsLoading}
                  handleClick={handleClick}
                  handleClose={handleClose}
                  isRemember={isRemember}
                  only
                  handleSignUp={handleSignUp}
                  newLayout
                />
              )}
            </Stack>
          </Box>
        </NoSsr>

        <CustomModal
          handleClose={() => setOpenOtpModal(false)}
          openModal={openOtpModal}
        >
          <OtpForm
            data={otpData?.type ? otpData?.type : loginFormik?.values?.phone}
            formSubmitHandler={otpFormSubmitHandler}
            isLoading={isLoadingOtpVerifyApi || fireIsLoading}
            recaptcha="recaptcha-container"
            loginValue={loginValue}
            reSendOtp={formSubmitHandler}
            handleClose={() => setOpenOtpModal(false)}
          />
        </CustomModal>
      </>
    );
  }
  // ── End new Figma layout ───────────────────────────────────────────────────

  return (
    <>
      <NoSsr>
        <CustomStackFullWidth justifyContent="center" alignItems="center">
          <Box
            sx={{
              maxWidth: "450px",
              minWidth: { xs: "300px", md: "400px" },
              padding: { xs: "30px", md: "47px" },
              position: "relative",
            }}
            width="100%"
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
            <CustomStackFullWidth spacing={2}>
              <AuthHeader configData={configData} />
              {handleFormBasedOnDirection()}
            </CustomStackFullWidth>
          </Box>
        </CustomStackFullWidth>
      </NoSsr>
      {openModuleSelection && (
        <ModuleSelection
          location={location}
          closeModal={handleCloseModuleModal}
          disableAutoFocus
        />
      )}
      <CustomModal
        handleClose={() => setOpenOtpModal(false)}
        openModal={openOtpModal}
      >
        <OtpForm
          data={otpData?.type ? otpData?.type : loginFormik?.values?.phone}
          formSubmitHandler={otpFormSubmitHandler}
          isLoading={isLoadingOtpVerifyApi || fireIsLoading}
          recaptcha="recaptcha-container"
          loginValue={loginValue}
          reSendOtp={formSubmitHandler}
          handleClose={() => setOpenOtpModal(false)}
        />
      </CustomModal>
    </>
  );
};

export default SignIn;
