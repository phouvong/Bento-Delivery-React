import { useMutation } from "react-query";
import {firebase_otp, firebase_reset_password} from "../../../ApiRoutes";
import MainApi from "../../../MainApi";

const sendOtp = async (otpData) => {
  const { data } = await MainApi.put(`${firebase_reset_password}`, otpData);
  return data;
};
export const useFireBaseResetPass = () => {
  return useMutation("firebase_otp", sendOtp);
};
