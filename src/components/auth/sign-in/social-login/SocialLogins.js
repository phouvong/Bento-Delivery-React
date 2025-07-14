import { Stack, Typography } from "@mui/material";
import { memo } from "react";
import GoogleLoginComp from "./GoogleLoginComp";
import { useTranslation } from "react-i18next";
import FbLoginComp from "./FbLoginComp";
import { useRouter } from "next/router";
import AppleLoginComp from "components/auth/sign-in/social-login/AppleLoginComp";

const SocialLogins = (props) => {
  const router = useRouter();
  const {
    socialLogin,
    configData,
    state,

    setJwtToken,
    setUserInfo,
    handleSuccess,
    setModalFor,
    setMedium,
    loginMutation,
    setLoginInfo,
  } = props;
  const { t } = useTranslation();

  const combineLoginData = [...socialLogin, ...configData?.apple_login];
  const dataWithCentralize = combineLoginData.map((item) => ({
    ...item,
    ...(configData?.centralize_login || {}),
  }));

  const dataWithCentralizeFiltered = dataWithCentralize.filter((item) => {
    if (item?.login_medium === "google") {
      return (
        item?.status === true &&
        configData?.centralize_login?.google_login_status === 1
      );
    }
    if (item?.login_medium === "facebook") {
      return (
        item?.status === true &&
        configData?.centralize_login?.facebook_login_status === 1
      );
    }
    if (item?.login_medium === "apple") {
      return (
        item?.status === true &&
        configData?.centralize_login?.apple_login_status === 1
      );
    }
    return true; // Keep the item if it's not related to google, facebook, or apple
  });

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      spacing={state?.status === "social" ? 2 : 1}
      direction={
        (socialLogin?.length === 1 && state?.status === "all") ||
        state?.status === "social"
          ? "column"
          : "row"
      }
      width="100%"
    >
      {(socialLogin?.length === 1 && state?.status === "all") ||
        (state?.status === "social" && (
          <Typography fontSize="16px">
            {t(`Welcome to ${configData?.business_name} `)}
          </Typography>
        ))}
      {state?.status === "social" ? (
        <Stack
          gap={2}
          direction={
            (socialLogin?.length === 1 && state?.status === "all") ||
            state?.status === "social"
              ? "column"
              : "row"
          }
        >
          {dataWithCentralizeFiltered?.map((item, index) => {
            if (item?.login_medium === "google" && item?.status === true) {
              return (
                <GoogleLoginComp
                  key={index}
                  handleSuccess={handleSuccess}
                  configData={configData}
                  socialLength={dataWithCentralizeFiltered?.length}
                  state={state}
                  setJwtToken={setJwtToken}
                  setUserInfo={setUserInfo}
                  setModalFor={setModalFor}
                  setMedium={setMedium}
                  loginMutation={loginMutation}
                  setLoginInfo={setLoginInfo}
                />
              );
            } else if (
              item?.login_medium === "facebook" &&
              item?.status === true
            ) {
              return (
                <FbLoginComp
                  key={index}
                  handleSuccess={handleSuccess}
                  //handleParentModalClose={handleParentModalClose}
                  configData={configData}
                  socialLength={dataWithCentralizeFiltered?.length}
                  state={state}
                  setJwtToken={setJwtToken}
                  setUserInfo={setUserInfo}
                  setModalFor={setModalFor}
                  setMedium={setMedium}
                  loginMutation={loginMutation}
                  setLoginInfo={setLoginInfo}
                />
              );
            } else if (
              item?.login_medium === "apple" &&
              item?.status === true
            ) {
              return (
                <AppleLoginComp
                  key={index}
                  handleSuccess={handleSuccess}
                  //handleParentModalClose={handleParentModalClose}
                  configData={configData}
                  socialLength={dataWithCentralizeFiltered?.length}
                  state={state}
                  setJwtToken={setJwtToken}
                  setUserInfo={setUserInfo}
                  setModalFor={setModalFor}
                  setMedium={setMedium}
                  loginMutation={loginMutation}
                  setLoginInfo={setLoginInfo}
                  item={item}
                />
              );
            }
          })}
        </Stack>
      ) : (
        <>
          {dataWithCentralizeFiltered?.map((item, index) => {
            if (item?.login_medium === "google" && item?.status === true) {
              return (
                <GoogleLoginComp
                  key={index}
                  handleSuccess={handleSuccess}
                  configData={configData}
                  socialLength={dataWithCentralizeFiltered?.length}
                  state={state}
                  setJwtToken={setJwtToken}
                  setUserInfo={setUserInfo}
                  setModalFor={setModalFor}
                  setMedium={setMedium}
                  loginMutation={loginMutation}
                  setLoginInfo={setLoginInfo}
                />
              );
            } else if (
              item?.login_medium === "facebook" &&
              item?.status === true
            ) {
              return (
                <FbLoginComp
                  key={index}
                  handleSuccess={handleSuccess}
                  //handleParentModalClose={handleParentModalClose}
                  configData={configData}
                  socialLength={dataWithCentralizeFiltered?.length}
                  state={state}
                  setJwtToken={setJwtToken}
                  setUserInfo={setUserInfo}
                  setModalFor={setModalFor}
                  setMedium={setMedium}
                  loginMutation={loginMutation}
                  setLoginInfo={setLoginInfo}
                />
              );
            } else if (
              item?.login_medium === "apple" &&
              item?.status === true
            ) {
              return (
                <AppleLoginComp
                  key={index}
                  handleSuccess={handleSuccess}
                  configData={configData}
                  socialLength={dataWithCentralizeFiltered?.length}
                  state={state}
                  setJwtToken={setJwtToken}
                  setUserInfo={setUserInfo}
                  setModalFor={setModalFor}
                  setMedium={setMedium}
                  loginMutation={loginMutation}
                  setLoginInfo={setLoginInfo}
                  item={item}
                />
              );
            }
          })}
        </>
      )}
    </Stack>
  );
};

SocialLogins.propTypes = {};

export default memo(SocialLogins);
