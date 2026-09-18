import { useMutation } from "react-query";
import MainApi from "api-manage/MainApi";
import { service_request_update_api } from "../../../ApiRoutes";

const updateServiceRequest = async ({ id, ...body }) => {
  const { data } = await MainApi.put(
    `${service_request_update_api}/${id}`,
    body
  );
  return data;
};

export default function usePutServiceRequest(params) {
  return useMutation(
    "update-service-request",
    (postData) => updateServiceRequest(postData),
    params
  );
}
