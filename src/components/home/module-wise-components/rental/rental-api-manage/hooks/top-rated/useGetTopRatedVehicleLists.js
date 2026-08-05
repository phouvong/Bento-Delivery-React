import MainApi from "api-manage/MainApi";
import { useQuery } from "react-query";
import { top_rated_vehicle_list } from "../../ApiRoutes";
import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";

// Define a standalone fetcher function
const fetchTopRatedVehicleLists = async () => {
  const { data } = await MainApi.get(`${top_rated_vehicle_list}`);
  return data;
};

// Use the fetcher function in useQuery
export const useGetTopRatedVehicleLists = () => {
  return useQuery("top-rated-vehicle-list", fetchTopRatedVehicleLists, {
    onError: onSingleErrorResponse, // Prevent refetching when the window regains focus
  });
};
