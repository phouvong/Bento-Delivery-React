import MainApi from "api-manage/MainApi";
import { useQuery } from "react-query";

import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { vehicle_category_list } from "../../../ApiRoutes";
import { useDispatch } from "react-redux";
import { setRentalCategoriesList } from "redux/slices/rentalCategories";
import { setCategories } from "redux/slices/storedData";

// Define a standalone fetcher function
const fetchCategoryVehicleLists = async () => {
  const { data } = await MainApi.get(`${vehicle_category_list}`);
  return data;
};

// Use the fetcher function in useQuery
export const useGetCategoryVehicleLists = () => {
  const dispatch = useDispatch();
  return useQuery("category-list", fetchCategoryVehicleLists, {
    cacheTime: 1000 * 60,        // 1 minute
    staleTime: 1000 * 30,        // 30 seconds
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    onSuccess: (data) => {
      //dispatch(setCategories(data.vehicles));
      dispatch(setRentalCategoriesList(data.vehicles));
    },
    onError: onSingleErrorResponse, // Prevent refetching when the window regains focus
  });
};
