import { useMutation } from "react-query";
import MainApi from "api-manage/MainApi";
import { service_submit_review_api } from "../../../ApiRoutes";

export interface ServiceReviewPayload {
  booking_id: number | string;
  service_id: number | string;
  rating: number | string;
  comment?: string;
  // Optional image files — sent as multipart `attachment[]` when provided.
  attachment?: File[];
}

const submitData = async ({ attachment, ...fields }: ServiceReviewPayload) => {
  // The endpoint validates form fields (see the documented `-F` curl), so always
  // send multipart/form-data — a JSON body makes the backend report fields as missing.
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });
  attachment?.forEach((file) => formData.append("attachment[]", file));
  const { data } = await MainApi.post(service_submit_review_api, formData);
  return data;
};

// POST a completed service booking review (rating + comment + optional images).
export const useSubmitServiceReview = () =>
  useMutation("submit-service-review", submitData);
