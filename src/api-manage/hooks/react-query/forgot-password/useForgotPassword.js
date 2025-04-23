import { useMutation } from "react-query";
import MainApi from "../../../MainApi";

const forgotPassword = async (phone) => {
  let tempData 
  if(
    phone?.verification_method==="email"
  ){
    tempData={
      email:phone?.email,
      verification_method:"email"
    }
  }else{
    tempData={
      phone:phone?.phone,
      verification_method:"phone"
    }
  }
  const { data } = await MainApi.post("/api/v1/auth/forgot-password", tempData);
  return data;
};
export const useForgotPassword = ({
  onSuccessHandlerForForgotpass,
  onErrorResponse,
}) => {
  return useMutation("forgot_password", forgotPassword, {
    onSuccess: onSuccessHandlerForForgotpass,
    onError: onErrorResponse,
  });
};
