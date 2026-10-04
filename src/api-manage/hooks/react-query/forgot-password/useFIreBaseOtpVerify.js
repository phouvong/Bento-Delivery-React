import { useMutation } from "react-query";
import { firebase_otp, verify_phone_api } from "../../../ApiRoutes";
import MainApi from "../../../MainApi";

const sendOtp = async (otpData) => {
  const { data } = await MainApi.post(`${firebase_otp}`, otpData);
  return data;
};
export const useFireBaseOtpVerify = () => {
  return useMutation("firebase_otp", sendOtp);
};
