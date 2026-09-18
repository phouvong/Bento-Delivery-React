import { useMutation } from "react-query";
import MainApi from "api-manage/MainApi";
import { custom_service_update_api } from "../../../ApiRoutes";

const updateCustomService = async ({ id, ...body }) => {
  const { data } = await MainApi.put(
    `${custom_service_update_api}/${id}`,
    body
  );
  return data;
};

export default function usePutCustomService(params) {
  return useMutation(
    "update-custom-service",
    (postData) => updateCustomService(postData),
    params
  );
}
