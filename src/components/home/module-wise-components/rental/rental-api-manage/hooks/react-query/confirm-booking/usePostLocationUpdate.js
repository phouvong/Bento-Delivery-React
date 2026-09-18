import { useMutation } from "react-query";
import MainApi from "api-manage/MainApi";
import {
  comfirm_booking,
  update_location,
} from "components/home/module-wise-components/rental/rental-api-manage/ApiRoutes";

const addData = async (postData) => {
  const { data } = await MainApi.put(
    `${update_location}/${postData?.userId}`,
    postData
  );
  return data;
};

export default function usePostLocationUpdate() {
  return useMutation("update_user", addData);
}
