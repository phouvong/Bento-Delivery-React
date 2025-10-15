import MainApi from "../../../MainApi";
import { confirm_return_parcel } from "../../../ApiRoutes";
import { useMutation, useQuery } from "react-query";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";

const postData = async (formData) => {
  const { data } = await MainApi.post(confirm_return_parcel, formData);
  return data;
};

export default function usePostParcelReturn() {
  return useMutation("parcel-return", postData);
}
