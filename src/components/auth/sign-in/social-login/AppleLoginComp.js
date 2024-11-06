import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import AppleLogin from "react-apple-login";
import { Typography, useMediaQuery, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { appleLoginCredential } from "utils/staticCredential";
import { CustomGoogleButton } from "components/auth/sign-in/social-login/GoogleLoginComp";
import CustomImageContainer from "components/CustomImageContainer";
import appleLogo from "../../asset/Apple Logo.svg";
import jwt_decode from "jwt-decode";
import { getGuestId } from "helper-functions/getToken";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";

const AppleLoginComp = (props) => {
  const {
    socialLength,
    state,
    configData,
    item,
    loginMutation,
    handleSuccess,
    setMedium,
    setLoginInfo,
    setModalFor,
    setJwtToken,
    setUserInfo,
  } = props;
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const credentials = appleLoginCredential;
  const { t } = useTranslation();
  const [appleSdkLoaded, setAppleSdkLoaded] = useState(false);
  const [loginValue, setLoginValue] = useState(null);
  // client_id
  // Load Apple SDK
  useEffect(() => {
    if (typeof AppleID !== "undefined") {
      setAppleSdkLoaded(true);
    } else {
      console.warn("Apple SDK not loaded");
    }
  }, []); // Only runs once when the component mounts

  const handleToken = (token) => {
    if (token) {
      handleSuccess(token);
    } else {
      setMedium("apple");
      //setModalFor("phone_modal");
      //setOpenModal(true);
    }
  };
  const handlePostRequestOnSuccess = (response) => {
    const res = response;
    if (response?.is_exist_user === null && response?.is_personal_info === 1) {
      handleToken(response?.token);
    } else if (response?.is_personal_info === 0) {
      setLoginInfo({ ...res, email: response?.email, is_email: true });
      // setForWidth(false);
      setModalFor("user_info");
    } else {
      // setForWidth(false);
      setMedium("apple");
      setLoginInfo({ ...res, email: response?.email, is_email: true });
      setModalFor("is_exist_user");
    }
  };
  const handleAppleResponse = async (res) => {
    if (res.authorization?.id_token) {
      const userObj = jwt_decode(res.authorization?.id_token);

      setJwtToken({
        credential: res?.authorization?.id_token,
        clientId: res?.authorization?.code,
      });
      setUserInfo(userObj);
      const tempValue = {
        email: res?.email ?? userObj?.email,
        token: res.authorization?.id_token,
        unique_id: res.authorization?.code ?? res?.clientId,
        medium: res?.medium ?? "apple",
        login_type: res?.login_type ?? "social",
        guest_id: loginValue?.guest_id ?? getGuestId(),
      };
      //setLoginValue(tempValue);
      // const tempValue = {
      //   token: res?.token,
      //   unique_id: res?.code,
      //   medium: "apple",
      //   login_type: "social",
      //   guest_id: getGuestId(),
      // };
      setLoginValue(tempValue);
      loginMutation(tempValue, {
        onSuccess: (res) =>
          handlePostRequestOnSuccess({
            ...res,
            email: userObj?.email,
          }),
        onError: onErrorResponse,
      });
    }

    // Handle the response from Apple here
  };

  const handleView = (handleClick) => {
    if (state?.status === "social") {
      return (
        <CustomGoogleButton
          direction="row"
          spacing={1}
          width={isSmall ? "275px" : "320px"}
          onClick={handleClick}
          sx={{ marginInlineStart: { xs: "13px", md: "15px" } }}
        >
          <CustomImageContainer
            src={appleLogo.src}
            alt="apple"
            height="24px"
            width="24px"
            objectFit="cover"
            borderRadius="50%"
          />
          <Typography fontSize="14px" fontWeight="600">
            {t("Continue with Apple")}
          </Typography>
        </CustomGoogleButton>
      );
    }

    switch (socialLength) {
      case 1:
        return (
          <CustomGoogleButton
            onClick={handleClick}
            direction="row"
            spacing={1}
            width="100%"
          >
            <CustomImageContainer
              src={appleLogo.src}
              alt="apple"
              height="24px"
              width="24px"
              objectFit="cover"
              borderRadius="50%"
            />
            <Typography fontSize="14px" fontWeight="600">
              {t("Continue with Apple")}
            </Typography>
          </CustomGoogleButton>
        );
      case 2:
        return (
          <CustomGoogleButton
            onClick={handleClick}
            direction="row"
            spacing={1}
            width="100%"
          >
            <CustomImageContainer
              src={appleLogo.src}
              alt="apple"
              height="24px"
              width="24px"
              objectFit="cover"
              borderRadius="50%"
            />
            <Typography fontSize="14px" fontWeight="600">
              {t("Apple")}
            </Typography>
          </CustomGoogleButton>
        );
      case 3:
        return (
          <CustomGoogleButton onClick={handleClick} direction="row" spacing={1}>
            <CustomImageContainer
              src={appleLogo.src}
              alt="apple"
              height="24px"
              width="24px"
              objectFit="cover"
              borderRadius="50%"
            />
          </CustomGoogleButton>
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        width:
          socialLength === 3 && state?.status !== "social" ? "45px" : "100%",
      }}
    >
      {appleSdkLoaded ? (
        <AppleLogin
          clientId={configData?.apple_login[0]?.client_id}
          redirectURI={configData?.apple_login[0]?.redirect_url_react}
          responseType="code"
          responseMode="form_post"
          usePopup={true}
          callback={handleAppleResponse}
          scope="email name"
          render={(
            renderProps // Custom Apple Sign-in Button
          ) => <>{handleView(renderProps.onClick)}</>}
        />
      ) : (
        <Typography>{t("Loading Apple Login...")}</Typography>
      )}
    </div>
  );
};

AppleLoginComp.propTypes = {
  socialLength: PropTypes.number.isRequired,
  state: PropTypes.object.isRequired,
};

export default AppleLoginComp;
