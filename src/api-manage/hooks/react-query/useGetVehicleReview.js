import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { vehicle_review } from "api-manage/ApiRoutes";
import MainApi from "api-manage/MainApi";
import { useQuery } from "react-query";


const getProductReviews = async (pageParams) => {
  const { productId, page_limits, offSet } = pageParams;
  const { data } = await MainApi.get(
    `${vehicle_review}/${productId}?limit=${page_limits}&offset=${offSet}`
  );
  return data;
};

export default function useGetVehicleReview(pageParams) {
  return useQuery("vehicle-reviews", () => getProductReviews(pageParams), {
    enabled: false,
    onError: onSingleErrorResponse,
  });
}