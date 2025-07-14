
import MainApi from "api-manage/MainApi";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { setRentalCategoriesList } from "redux/slices/rentalCategories";
import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { vehicle_category_list } from "api-manage/ApiRoutes";


// Define a standalone fetcher function
const fetchCategoryVehicleLists = async () => {
  const { data } = await MainApi.get(`${vehicle_category_list}`);
  return data;
};

// Use the fetcher function in useQuery
export const useGetCategoryVehicleLists = () => {
  const dispatch = useDispatch();
  return useQuery("category-list", fetchCategoryVehicleLists, {
    staleTime: 5 * 60 * 1000, // Data will be considered fresh for 5 minutes
    cacheTime: 10 * 60 * 1000, // Data will be cached for 10 minutes
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      //dispatch(setCategories(data.vehicles));
      dispatch(setRentalCategoriesList(data.vehicles));
    },
    onError: onSingleErrorResponse, // Prevent refetching when the window regains focus
  });
};