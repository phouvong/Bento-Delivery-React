import { useMutation } from "react-query";
import MainApi from "api-manage/MainApi";
import { service_request_create_api } from "../../../ApiRoutes";

const createServiceRequest = async (postData) => {
  const { data } = await MainApi.post(service_request_create_api, postData);
  return data;
};

export default function usePostServiceRequest() {
  return useMutation("create-service-request", createServiceRequest);
}
