import { useMutation } from "react-query";
import MainApi from "api-manage/MainApi";
import {
  comfirm_booking,
  make_payment,
} from "components/home/module-wise-components/rental/rental-api-manage/ApiRoutes";

const addData = async (postData) => {
  const { data } = await MainApi.post(make_payment, postData);
  return data;
};

export default function useMakePayment() {
  return useMutation("make_payment", addData);
}
