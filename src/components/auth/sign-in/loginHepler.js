import { ACTIONS } from "components/auth/state";

export const getActiveLoginStatus = (state, loginDispatch) => {
  const { otp, manual, social } = state.activeLoginType;
  let newStatus = "";

  switch (true) {
    case otp && manual && social:
      newStatus = "all";
      break;
    case otp && manual:
      newStatus = "otp_manual";
      break;
    case otp && social:
      newStatus = "otp_social";
      break;
    case manual && social:
      newStatus = "manual_social";
      break;
    case otp:
      newStatus = "otp";
      break;
    case manual:
      newStatus = "manual";
      break;
    case social:
      newStatus = "social";
      break;
    default:
      newStatus = "manual";
  }
  loginDispatch({
    type: ACTIONS.setStatus,
    payload: newStatus,
  });
};

export const getLoginUserCheck = (
  response,
  data,
  handleTokenAfter,
  setOtpData,
  setMainToken,
  sendOTP,
  configData
) => {
  const isPhoneVerified = Number.parseInt(response?.is_phone_verified) === 1;
  const isEmailVerified = Number.parseInt(response?.is_email_verified) === 1;

  if (isPhoneVerified && isEmailVerified) {
    handleTokenAfter(response);
  } else {
    if (!isPhoneVerified && !isEmailVerified) {
      setOtpData({
        ...response,
        type: data?.email_or_phone,
        verification_type: "phone",
      });
    } else if (!isEmailVerified) {
      setOtpData({
        ...response,
        type: data?.email,
        verification_type: "email",
      });
    } else if (!isPhoneVerified) {
      if (configData?.firebase_otp_verification === 1) {
        sendOTP(response, setOtpData, setMainToken, data?.phone);
      } else {
        setOtpData({
          ...response,
          type: data?.phone,
          verification_type: "phone",
        });
      }
    }
    setMainToken(response);
  }
};
