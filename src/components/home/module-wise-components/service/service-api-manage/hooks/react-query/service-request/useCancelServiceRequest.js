import { useMutation } from "react-query";
import MainApi from "api-manage/MainApi";
import { service_request_cancel_api } from "../../../ApiRoutes";

const cancelServiceRequest = async (id) => {
  const { data } = await MainApi.post(
    `${service_request_cancel_api}/${id}/cancel`
  );
  return data;
};

export default function useCancelServiceRequest(params) {
  return useMutation((id) => cancelServiceRequest(id), params);
}
