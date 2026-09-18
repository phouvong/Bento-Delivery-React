import MainApi from "api-manage/MainApi";
import { useQuery } from "react-query";
import { banner_list } from "../../../ApiRoutes";
import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";

// Define a standalone fetcher function
const fetchVehicleBannerList = async () => {
	const { data } = await MainApi.get(`${banner_list}`);
	return data;
};

// Use the fetcher function in useQuery with caching options
export const useGetVehicleBannerList = () => {
	return useQuery("vehicle-banner-lists", fetchVehicleBannerList, {
		retry: false,
		cacheTime: 1000 * 60,        // 1 minute
		staleTime: 1000 * 30,        // 30 seconds
		refetchOnWindowFocus: false,
		refetchOnMount: false,       // 👈 prevent refetch on mount
		onError: onSingleErrorResponse,
	});
};
