import MainApi from "api-manage/MainApi";
import { useQuery } from "react-query";

import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { vehicle_details } from "../../../ApiRoutes";

// Define a standalone fetcher function
const fetchVehicleDetails = async (id) => {
  if (id) {
    const { data } = await MainApi.get(`${vehicle_details}/${id}`);
    return data;
  }
};

// Use the fetcher function in useQuery
export const useGetVehicleDetails = (id, options = {}) => {
  const defaultOptions = {
    onError: onSingleErrorResponse,
    enabled: Boolean(id),
  };

  return useQuery(["vehicle-details", id], () => fetchVehicleDetails(id), {
    ...defaultOptions,
    ...options,
  });
};
