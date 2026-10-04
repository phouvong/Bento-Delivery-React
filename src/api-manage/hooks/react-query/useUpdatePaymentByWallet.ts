
import { useMutation } from "react-query";
import {wallet_payment_api } from "api-manage/ApiRoutes";
import MainApi from "api-manage/MainApi";
export type TPaymentMethodFormData = {
  order_id: string | number;
  _method: string;
};

const updateData = async (formData: TPaymentMethodFormData) => {
  const { data } = await MainApi.post(`${wallet_payment_api}`, formData);
  return data;
};
export const useUpdatePaymentByWallet = () => {
  return useMutation("update-payment-method", updateData);
};