import { useMutation } from "react-query";
import MainApi from "api-manage/MainApi";
import { custom_service_create_api } from "../../../ApiRoutes";

const createCustomService = async (postData) => {
  const { data } = await MainApi.post(custom_service_create_api, postData);
  return data;
};

export default function usePostCustomService() {
  return useMutation("create-custom-service", createCustomService);
}
