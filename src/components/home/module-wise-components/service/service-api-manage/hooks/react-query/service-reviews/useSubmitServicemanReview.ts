import { useMutation } from "react-query";
import MainApi from "api-manage/MainApi";
import { service_submit_serviceman_review_api } from "../../../ApiRoutes";

export interface ServicemanReviewPayload {
  booking_id: number | string;
  serviceman_id: number | string;
  rating: number | string;
  comment?: string;
}

const submitData = async (fields: ServicemanReviewPayload) => {
  // Send multipart/form-data — the service backend validates form fields, not a JSON body.
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });
  const { data } = await MainApi.post(
    service_submit_serviceman_review_api,
    formData
  );
  return data;
};

// POST a review (rating + comment) for one serviceman on a completed booking.
export const useSubmitServicemanReview = () =>
  useMutation("submit-serviceman-review", submitData);
