import { useMutation } from "react-query";
import MainApi from "api-manage/MainApi";
import { service_request_delete_api } from "../../../ApiRoutes";

const deleteServiceRequest = async (id) => {
  const { data } = await MainApi.delete(`${service_request_delete_api}/${id}`);
  return data;
};

export default function useDeleteServiceRequest(params) {
  return useMutation((id) => deleteServiceRequest(id), params);
}
