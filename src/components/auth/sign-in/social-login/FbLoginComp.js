import { useEffect, useState } from "react";
import { Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { useVerifyPhone } from "api-manage/hooks/react-query/forgot-password/useVerifyPhone";
import { usePostEmail } from "api-manage/hooks/react-query/social-login/useEmailPost";
import { getLanguage } from "helper-functions/getLanguage";
import {
  setJwtTokenByDispatch,
  setUserInfoByDispatch,
} from "redux/slices/fbCredentials";
import { CustomStackFullWidth } from "../../../../styled-components/CustomStyles.style";
import { fb_app_id } from "utils/staticCredential";
import CustomImageContainer from "../../../CustomImageContainer";
import CustomModal from "../../../modal";
import OtpForm from "../../sign-up/OtpForm";
import { CustomGoogleButton } from "components/auth/sign-in/social-login/GoogleLoginComp";
import googleLatest from "../../asset/Facebook.png";
import { getGuestId } from "helper-functions/getToken";

const FbLoginComp = (props) => {
  const {
    handleSuccess,
    configData,
    socialLength,
    state,
    setModalFor,
    setMedium,
    loginMutation,
    setLoginInfo,
  } = props;
  const { userInfo, jwtToken } = useSelector(
    (state) => state.fbCredentialsStore
  );
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const [loginValue, setLoginValue] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openOtpModal, setOpenOtpModal] = useState(false);
  const [otpData, setOtpData] = useState({ phone: "" });
  const [mainToken, setMainToken] = useState(null);
  const dispatch = useDispatch();
  const appId = fb_app_id;
  const { mutate } = usePostEmail();
  const handleToken = (response) => {
    if (response?.token) {
      handleSuccess(response.token);
    } else {
      setMedium("facebook");
      setModalFor("phone_modal");
      setOpenModal(true);
    }
  };
  useEffect(() => {
    if (otpData?.phone !== "") {
      setOpenOtpModal(true);
    }
  }, [otpData]);

  const handlePostRequestOnSuccess = (response) => {
    const res = response?.data;
    if (
      response?.data?.is_exist_user === null &&
      response?.data?.is_personal_info === 1
    ) {
      handleToken(response?.data);
    } else if (response?.data?.is_personal_info === 0) {
      setLoginInfo({
        ...res,
        email: response?.data?.email,
        is_email: true,
      });
      setModalFor("user_info");
    } else {
      setMedium("facebook");
      setLoginInfo({
        ...res,
        email: response?.data?.email,
        is_email: true,
      });
      setModalFor("is_exist_user");
    }
  };
  const responseFacebook = async (res) => {
    dispatch(setUserInfoByDispatch(res));
    dispatch(setJwtTokenByDispatch(res));
    if (res?.status !== "unknown") {
      const tempValue = {
        email: res?.email,
        token: res?.accessToken,
        unique_id: res?.id,
        medium: "facebook",
        phone: res?.phone,
        login_type: "social",
        guest_id: getGuestId(),
      };
      setLoginValue(tempValue);
      await mutate(tempValue, {
        onSuccess: (res) =>
          handlePostRequestOnSuccess({
            ...res,
          }),
        onError: (error) => {
          error?.response?.data?.errors?.forEach((item) =>
            item.code === "email" ? handleToken() : toast.error(item.message)
          );
        },
      });
    }
  };

  const { mutate: signInMutate, isLoading } = useVerifyPhone();

  const onSuccessHandlerOtp = async (res) => {
    toast.success(res?.message);
    setOpenOtpModal(false);
    setOpenModal(false);
    await handleSuccess(mainToken);
  };

  const formSubmitHandler = (values) => {
    signInMutate(values, {
      onSuccess: onSuccessHandlerOtp,
      onError: onErrorResponse,
    });
  };

  const handleView = (fbHandler) => {
    if (state?.status === "social") {
      return (
        <CustomGoogleButton
          onClick={fbHandler}
          direction="row"
          spacing={1}
          width={isSmall ? "275px" : "320px"}
          sx={{
            marginInlineStart: {
              xs: "13px !important",
              sm: "13px !important",
              md: "0px",
            },
          }}
        >
          <CustomImageContainer
            src={googleLatest.src}
            alt="facebook"
            height="24px"
            width="24px"
            objectFit="cover"
            borderRadius="50%"
          />
          <Typography fontSize="14px" fontWeight="600">
            {t("Continue with Facebook")}
          </Typography>
        </CustomGoogleButton>
      );
    }

    switch (socialLength) {
      case 1:
        return (
          <CustomGoogleButton
            direction="row"
            spacing={1}
            width="100%"
            onClick={fbHandler}
          >
            <CustomImageContainer
              src={googleLatest.src}
              alt="facebook"
              height="24px"
              width="24px"
              objectFit="cover"
              borderRadius="50%"
            />
            <Typography fontSize="14px" fontWeight="600">
              {t("Continue with Facebook")}
            </Typography>
          </CustomGoogleButton>
        );
      case 2:
        return (
          <CustomGoogleButton
            direction="row"
            spacing={1}
            width="100%"
            onClick={fbHandler}
          >
            <CustomImageContainer
              src={googleLatest.src}
              alt="facebook"
              height="24px"
              width="24px"
              objectFit="cover"
              borderRadius="50%"
            />
            <Typography fontSize="14px" fontWeight="600">
              {t("Facebook")}
            </Typography>
          </CustomGoogleButton>
        );
      case 3:
        return (
          <CustomGoogleButton direction="row" spacing={1} onClick={fbHandler}>
            <CustomImageContainer
              src={googleLatest.src}
              alt="facebook"
              height="24px"
              width="24px"
              objectFit="cover"
              borderRadius="50%"
            />
          </CustomGoogleButton>
        );
      default:
        break;
    }
  };
  const { t } = useTranslation();
  const lanDirection = getLanguage() ? getLanguage() : "ltr";
  return (
    <>
      <FacebookLogin
        appId={appId}
        autoLoad={false}
        fields="name,email,picture"
        callback={responseFacebook}
        render={(renderProps) => <>{handleView(renderProps.onClick)}</>}
      />
      <CustomModal
        openModal={openOtpModal}
        setModalOpen={setOpenOtpModal}
        handleClose={() => setOpenModal(false)}
      >
        <OtpForm
          data={otpData}
          formSubmitHandler={formSubmitHandler}
          isLoading={isLoading}
          loginValue={loginValue}
        />
      </CustomModal>
    </>
  );
};

FbLoginComp.propTypes = {};

export default FbLoginComp;
