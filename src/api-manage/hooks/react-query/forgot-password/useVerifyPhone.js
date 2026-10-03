import { useMutation } from "react-query";
import { verify_phone_api } from "../../../ApiRoutes";
import MainApi from "../../../MainApi";
import { getApiContent } from "api-manage/getApiContent";

const sendOtp = async (otpData) => {
  const { data } = await MainApi.post(`${verify_phone_api}`, otpData);
  return getApiContent(data);
};
export const useVerifyPhone = () => {
  return useMutation("verify_phone_otp", sendOtp);
};
