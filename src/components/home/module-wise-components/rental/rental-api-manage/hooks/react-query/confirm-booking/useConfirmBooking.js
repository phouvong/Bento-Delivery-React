import { useMutation } from "react-query";
import MainApi from "api-manage/MainApi";
import { comfirm_booking } from "components/home/module-wise-components/rental/rental-api-manage/ApiRoutes";

const addData = async (postData) => {
  const { data } = await MainApi.post(comfirm_booking, postData);
  return data;
};

export default function useConfirmBooking() {
  return useMutation("add-address", addData);
}
