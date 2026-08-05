import { useMutation } from "react-query";
import MainApi from "api-manage/MainApi";
import { remove_multiple_cart } from "components/home/module-wise-components/rental/rental-api-manage/ApiRoutes";
import { getGuestId } from "helper-functions/getToken";

const addData = async (postData) => {
  const { data } = await MainApi.delete(
    `${remove_multiple_cart}?cart_ids=${JSON.stringify(
      postData
    )}&guest_id=${getGuestId()}`
  );
  return data;
};

export default function useDeleteMultipleItem() {
  return useMutation("delete_items", addData);
}
