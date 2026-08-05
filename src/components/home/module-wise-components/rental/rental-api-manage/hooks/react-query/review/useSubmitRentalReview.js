import { useMutation } from "react-query";
import { submit_rental_review_api } from "../../../ApiRoutes";
import MainApi from "api-manage/MainApi";

const submitData = async (formData) => {
  const { data } = await MainApi.post(`${submit_rental_review_api}`, formData);
  return data;
};

export const useSubmitRentalReview = () => {
  return useMutation("submit-rental-review", submitData);
};
