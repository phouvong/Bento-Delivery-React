import { useMutation } from "react-query";
import MainApi from "../../../MainApi";
import { monthly_order_remove_api } from "../../../ApiRoutes";

const deleteData = async (id) => {
  const { data } = await MainApi.delete(
    `${monthly_order_remove_api}?id=${id}`
  );
  return data;
};

export default function useDeleteMonthlyOrder(params) {
  return useMutation((id) => deleteData(id), params);
}
