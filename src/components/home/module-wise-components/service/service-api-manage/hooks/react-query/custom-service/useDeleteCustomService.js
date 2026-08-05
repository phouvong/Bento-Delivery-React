import { useMutation } from "react-query";
import MainApi from "api-manage/MainApi";
import { custom_service_delete_api } from "../../../ApiRoutes";

const deleteCustomService = async (id) => {
  const { data } = await MainApi.delete(`${custom_service_delete_api}/${id}`);
  return data;
};

export default function useDeleteCustomService(params) {
  return useMutation((id) => deleteCustomService(id), params);
}
